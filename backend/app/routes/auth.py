from flask import Blueprint, jsonify, request
import hashlib
import time

auth_bp = Blueprint('auth', __name__)

# 存储有效的tokens和对应的IP地址
token_store = {}
# IP白名单
ip_whitelist = set()
# 密码（实际应用中应该从环境变量或配置文件读取）
PASSWORD = 'ouyuan'

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """登录获取Token"""
    data = request.get_json()
    password = data.get('password')
    
    if not password:
        return jsonify({'error': 'Password is required'}), 400
    
    # 获取客户端IP
    client_ip = request.remote_addr
    
    # 验证密码
    if password != PASSWORD:
        return jsonify({'error': 'Invalid password'}), 401
    
    # 生成Token：密码 + IP + 时间戳的MD5
    timestamp = str(int(time.time()))
    token_data = f"{password}{client_ip}{timestamp}"
    token = hashlib.md5(token_data.encode()).hexdigest()
    
    # 存储Token和对应的IP
    token_store[token] = client_ip
    # 将IP添加到白名单
    ip_whitelist.add(client_ip)
    
    return jsonify({'token': token, 'ip': client_ip, 'whitelisted': True}), 200

def is_ip_in_whitelist(ip, whitelist):
    """检查IP是否在白名单中，支持网段格式"""
    for whitelist_ip in whitelist:
        # 检查是否是精确匹配
        if ip == whitelist_ip:
            return True
        # 检查是否是网段格式（如 192.168.*.*）
        if '*' in whitelist_ip:
            # 将网段转换为正则表达式
            regex_pattern = whitelist_ip.replace('.', '\\.').replace('*', '.*')
            import re
            if re.match(regex_pattern, ip):
                return True
    return False

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
    if token not in token_store:
        return jsonify({'error': 'Invalid token'}), 401
    
    stored_ip = token_store[token]
    if stored_ip != client_ip:
        return jsonify({'error': 'IP address mismatch'}), 401
    
    # 验证IP是否在白名单中
    if not is_ip_in_whitelist(client_ip, ip_whitelist):
        return jsonify({'error': 'IP address not in whitelist'}), 401
    
    return jsonify({'valid': True}), 200

@auth_bp.route('/auth/whitelist', methods=['GET'])
def get_whitelist():
    """获取IP白名单"""
    # 转换为列表以便JSON序列化
    whitelist = list(ip_whitelist)
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
    ip_whitelist.add(ip)
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
    if ip in ip_whitelist:
        ip_whitelist.remove(ip)
        return jsonify({'message': 'IP removed from whitelist', 'ip': ip}), 200
    else:
        return jsonify({'error': 'IP not found in whitelist'}), 404