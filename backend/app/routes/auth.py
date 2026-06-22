from flask import Blueprint, jsonify, request
import hashlib
import time
import threading
from app.db import get_connection

auth_bp = Blueprint('auth', __name__)

# 密码（实际应用中应该从环境变量或配置文件读取）
PASSWORD = 'ouyuan'

# 防爆破配置（可通过环境变量覆盖）
import os
BRUTE_FORCE_CONFIG = {
    'max_attempts': int(os.environ.get('BF_MAX_ATTEMPTS', '5')),
    'window_seconds': int(os.environ.get('BF_WINDOW_SECONDS', '300')),
    'ban_seconds': int(os.environ.get('BF_BAN_SECONDS', '1800')),
    'permanent_ban_threshold': int(os.environ.get('BF_PERMANENT_THRESHOLD', '3')),
}

# 线程锁，保护需要原子性的复合操作
brute_force_lock = threading.Lock()


def _cleanup_expired():
    """清理过期的失败记录和临时黑名单"""
    conn = get_connection()
    now = time.time()
    cutoff = now - BRUTE_FORCE_CONFIG['window_seconds']

    # 清理过期失败记录
    conn.execute("DELETE FROM brute_force_attempts WHERE attempt_at < ?", (cutoff,))

    # 清理过期临时黑名单（expire_at IS NOT NULL 表示临时封禁）
    conn.execute("DELETE FROM ip_blacklist WHERE expire_at IS NOT NULL AND expire_at < ?", (now,))

    conn.commit()


def _is_blacklisted(ip):
    """检查 IP 是否在黑名单中"""
    conn = get_connection()
    row = conn.execute(
        "SELECT expire_at FROM ip_blacklist WHERE ip = ?", (ip,)
    ).fetchone()
    if row is None:
        return False
    # 临时封禁检查是否过期
    if row['expire_at'] is not None and time.time() >= row['expire_at']:
        conn.execute("DELETE FROM ip_blacklist WHERE ip = ?", (ip,))
        conn.commit()
        return False
    return True


def _is_permanently_banned(ip):
    """检查 IP 是否被永久封禁"""
    conn = get_connection()
    row = conn.execute(
        "SELECT expire_at FROM ip_blacklist WHERE ip = ?", (ip,)
    ).fetchone()
    return row is not None and row['expire_at'] is None


def _record_failure(ip):
    """记录一次密码失败尝试，超过阈值则加入黑名单"""
    conn = get_connection()
    now = time.time()
    cutoff = now - BRUTE_FORCE_CONFIG['window_seconds']

    # 插入失败记录
    conn.execute(
        "INSERT INTO brute_force_attempts (ip, attempt_at) VALUES (?, ?)",
        (ip, now)
    )

    # 统计窗口期内失败次数
    row = conn.execute(
        "SELECT COUNT(*) as cnt FROM brute_force_attempts WHERE ip = ? AND attempt_at >= ?",
        (ip, cutoff)
    ).fetchone()
    recent_failures = row['cnt']

    # 超过阈值，加入黑名单
    if recent_failures >= BRUTE_FORCE_CONFIG['max_attempts']:
        # 从 ban_history 统计累计封禁次数
        hist_row = conn.execute(
            "SELECT COUNT(*) as cnt FROM ban_history WHERE ip = ?", (ip,)
        ).fetchone()
        total_bans = hist_row['cnt']

        if total_bans >= BRUTE_FORCE_CONFIG['permanent_ban_threshold']:
            # 永久封禁
            conn.execute("""
                INSERT INTO ip_blacklist (ip, expire_at, ban_count, updated_at)
                VALUES (?, NULL, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(ip) DO UPDATE SET
                    expire_at = NULL,
                    ban_count = ban_count + 1,
                    updated_at = CURRENT_TIMESTAMP
            """, (ip, total_bans + 1))
            conn.execute(
                "INSERT INTO ban_history (ip, ban_type) VALUES (?, 'permanent')",
                (ip,)
            )
        else:
            # 临时封禁
            expire_at = now + BRUTE_FORCE_CONFIG['ban_seconds']
            conn.execute("""
                INSERT INTO ip_blacklist (ip, expire_at, ban_count, updated_at)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(ip) DO UPDATE SET
                    expire_at = ?,
                    ban_count = ban_count + 1,
                    updated_at = CURRENT_TIMESTAMP
            """, (ip, expire_at, total_bans + 1, expire_at))
            conn.execute(
                "INSERT INTO ban_history (ip, ban_type) VALUES (?, 'temporary')",
                (ip,)
            )

        # 清除该 IP 的失败记录
        conn.execute("DELETE FROM brute_force_attempts WHERE ip = ?", (ip,))

    conn.commit()


def get_brute_force_status(ip=None):
    """获取防爆破状态信息"""
    conn = get_connection()
    _cleanup_expired()

    if ip:
        row = conn.execute(
            "SELECT expire_at, ban_count FROM ip_blacklist WHERE ip = ?", (ip,)
        ).fetchone()
        is_banned = row is not None
        is_permanent = is_banned and row['expire_at'] is None
        ban_remaining = 0
        if is_banned and not is_permanent:
            ban_remaining = int(row['expire_at'] - time.time())

        fail_row = conn.execute(
            "SELECT COUNT(*) as cnt FROM brute_force_attempts WHERE ip = ?", (ip,)
        ).fetchone()

        # 从 ban_history 获取累计封禁次数
        hist_row = conn.execute(
            "SELECT COUNT(*) as cnt FROM ban_history WHERE ip = ?", (ip,)
        ).fetchone()

        return {
            'ip': ip,
            'is_blacklisted': is_banned,
            'is_permanent': is_permanent,
            'ban_remaining_seconds': ban_remaining,
            'recent_failures': fail_row['cnt'],
            'ban_count': hist_row['cnt'],
            'max_attempts': BRUTE_FORCE_CONFIG['max_attempts'],
            'permanent_ban_threshold': BRUTE_FORCE_CONFIG['permanent_ban_threshold'],
        }

    # 全局状态
    blacklisted = conn.execute("SELECT ip, expire_at FROM ip_blacklist").fetchall()
    permanent_bans = [r['ip'] for r in blacklisted if r['expire_at'] is None]
    temporary_bans = []
    for r in blacklisted:
        if r['expire_at'] is not None:
            remaining = int(r['expire_at'] - time.time())
            if remaining > 0:
                temporary_bans.append({
                    'ip': r['ip'],
                    'remaining_seconds': remaining
                })

    # 获取当前有失败尝试记录的 IP 及其失败次数
    attempting_rows = conn.execute(
        "SELECT ip, COUNT(*) as cnt FROM brute_force_attempts GROUP BY ip"
    ).fetchall()
    attempting_ips = [{'ip': r['ip'], 'failures': r['cnt']} for r in attempting_rows]

    tracked = conn.execute("SELECT COUNT(DISTINCT ip) as cnt FROM brute_force_attempts").fetchone()

    return {
        'blacklisted_ips': [r['ip'] for r in blacklisted],
        'permanent_bans': permanent_bans,
        'temporary_bans': temporary_bans,
        'attempting_ips': attempting_ips,
        'total_tracked_ips': tracked['cnt'],
    }


def unban_ip(ip, password=None):
    """手动解除 IP 黑名单（需要密码验证）"""
    conn = get_connection()
    row = conn.execute(
        "SELECT expire_at FROM ip_blacklist WHERE ip = ?", (ip,)
    ).fetchone()
    if row is None:
        return False, False

    was_permanent = row['expire_at'] is None
    conn.execute("DELETE FROM ip_blacklist WHERE ip = ?", (ip,))
    conn.execute("DELETE FROM brute_force_attempts WHERE ip = ?", (ip,))
    conn.commit()
    # 注意：不清除 ban_count（已随记录删除），保留历史可通过日志
    return True, was_permanent


def save_token(token, ip):
    """保存 Token 到数据库"""
    conn = get_connection()
    conn.execute(
        "INSERT INTO tokens (token, ip) VALUES (?, ?)",
        (token, ip)
    )
    conn.commit()


def verify_token(token):
    """验证 Token 并返回关联 IP"""
    conn = get_connection()
    row = conn.execute(
        "SELECT ip FROM tokens WHERE token = ?", (token,)
    ).fetchone()
    return row['ip'] if row else None


def add_to_whitelist_db(ip):
    """添加 IP 到白名单"""
    conn = get_connection()
    conn.execute(
        "INSERT OR IGNORE INTO ip_whitelist (ip) VALUES (?)", (ip,)
    )
    conn.commit()


def remove_from_whitelist_db(ip):
    """从白名单删除 IP"""
    conn = get_connection()
    cursor = conn.execute("DELETE FROM ip_whitelist WHERE ip = ?", (ip,))
    conn.commit()
    return cursor.rowcount > 0


def get_whitelist_db():
    """获取所有白名单 IP"""
    conn = get_connection()
    rows = conn.execute("SELECT ip FROM ip_whitelist").fetchall()
    return [r['ip'] for r in rows]


def is_ip_in_whitelist_db(ip):
    """检查 IP 是否在白名单中，支持网段格式"""
    conn = get_connection()
    # 精确匹配
    row = conn.execute("SELECT ip FROM ip_whitelist WHERE ip = ?", (ip,)).fetchone()
    if row:
        return True
    # 网段匹配（如 192.168.*.*）
    rows = conn.execute("SELECT ip FROM ip_whitelist WHERE ip LIKE '%*%'").fetchall()
    import re
    for r in rows:
        whitelist_ip = r['ip']
        regex_pattern = whitelist_ip.replace('.', '\\.').replace('*', '.*')
        if re.match(regex_pattern, ip):
            return True
    return False


@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """登录获取Token"""
    data = request.get_json()
    password = data.get('password')

    if not password:
        return jsonify({'error': 'Password is required'}), 400

    # 获取客户端IP
    client_ip = request.remote_addr

    # 防爆破检查：黑名单 IP 直接拒绝（伪装成密码错误）
    with brute_force_lock:
        if _is_blacklisted(client_ip):
            return jsonify({'error': 'Invalid password'}), 401

    # 验证密码
    if password != PASSWORD:
        # 记录失败
        with brute_force_lock:
            _record_failure(client_ip)
        return jsonify({'error': 'Invalid password'}), 401

    # 密码正确，清除该 IP 的失败记录
    conn = get_connection()
    conn.execute("DELETE FROM brute_force_attempts WHERE ip = ?", (client_ip,))
    conn.commit()

    # 生成Token：密码 + IP + 时间戳的MD5
    timestamp = str(int(time.time()))
    token_data = f"{password}{client_ip}{timestamp}"
    token = hashlib.md5(token_data.encode()).hexdigest()

    # 存储Token和对应的IP
    save_token(token, client_ip)
    # 将IP添加到白名单
    add_to_whitelist_db(client_ip)

    return jsonify({'token': token, 'ip': client_ip, 'whitelisted': True}), 200


@auth_bp.route('/auth/verify', methods=['POST'])
def verify():
    """验证Token"""
    data = request.get_json()
    token = data.get('token')

    if not token:
        return jsonify({'error': 'Token is required'}), 400

    # 获取客户端IP
    client_ip = request.remote_addr

    # 验证Token和IP
    stored_ip = verify_token(token)
    if stored_ip is None:
        return jsonify({'error': 'Invalid token'}), 401

    if stored_ip != client_ip:
        return jsonify({'error': 'IP address mismatch'}), 401

    # 验证IP是否在白名单中
    if not is_ip_in_whitelist_db(client_ip):
        return jsonify({'error': 'IP address not in whitelist'}), 401

    return jsonify({'valid': True}), 200


@auth_bp.route('/auth/whitelist', methods=['GET'])
def get_whitelist():
    """获取IP白名单"""
    whitelist = get_whitelist_db()
    return jsonify({'whitelist': whitelist}), 200


@auth_bp.route('/auth/whitelist', methods=['POST'])
def add_to_whitelist():
    """添加IP到白名单"""
    data = request.get_json()
    ip = data.get('ip')
    password = data.get('password')

    if not ip:
        return jsonify({'error': 'IP address is required'}), 400

    if not password:
        return jsonify({'error': 'Password is required'}), 400

    # 验证密码
    if password != PASSWORD:
        return jsonify({'error': 'Invalid password'}), 401

    # 添加IP到白名单
    add_to_whitelist_db(ip)
    return jsonify({'message': 'IP added to whitelist', 'ip': ip}), 200


@auth_bp.route('/auth/whitelist/<ip>', methods=['DELETE'])
def remove_from_whitelist(ip):
    """从白名单中删除IP"""
    data = request.get_json()
    password = data.get('password')

    if not password:
        return jsonify({'error': 'Password is required'}), 400

    # 验证密码
    if password != PASSWORD:
        return jsonify({'error': 'Invalid password'}), 401

    # 从白名单中删除IP
    if remove_from_whitelist_db(ip):
        return jsonify({'message': 'IP removed from whitelist', 'ip': ip}), 200
    else:
        return jsonify({'error': 'IP not found in whitelist'}), 404


# ===== 防爆破管理接口 =====

@auth_bp.route('/auth/brute-force/status', methods=['GET'])
def brute_force_status():
    """查看防爆破状态（支持查询指定 IP 或全局）"""
    target_ip = request.args.get('ip')
    status = get_brute_force_status(target_ip)
    return jsonify(status), 200


@auth_bp.route('/auth/brute-force/unban', methods=['POST'])
def brute_force_unban():
    """手动解除 IP 黑名单（需要密码验证）"""
    data = request.get_json()
    ip = data.get('ip')
    password = data.get('password')

    if not ip:
        return jsonify({'error': 'IP address is required'}), 400

    if not password:
        return jsonify({'error': 'Password is required'}), 400

    # 验证密码
    if password != PASSWORD:
        return jsonify({'error': 'Invalid password'}), 401

    unbanned, was_permanent = unban_ip(ip)
    if unbanned:
        return jsonify({
            'message': 'IP unbanned successfully',
            'ip': ip,
            'was_permanent': was_permanent,
        }), 200
    else:
        return jsonify({'error': 'IP not found in blacklist'}), 404
