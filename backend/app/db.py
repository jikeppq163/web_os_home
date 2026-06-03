"""
SQLite 数据库模块
负责数据库连接、表初始化、基础操作
"""
import sqlite3
import os
import threading

# 数据库文件路径
DB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
DB_PATH = os.path.join(DB_DIR, 'os_home.db')

# 线程本地连接
_local = threading.local()


def get_connection():
    """获取线程安全的数据库连接"""
    if not hasattr(_local, 'conn') or _local.conn is None:
        os.makedirs(DB_DIR, exist_ok=True)
        conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA busy_timeout=5000")
        _local.conn = conn
    return _local.conn


def init_db():
    """初始化数据库表结构"""
    conn = get_connection()
    cursor = conn.cursor()

    # 防爆破失败记录
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS brute_force_attempts (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            ip          TEXT NOT NULL,
            attempt_at  REAL NOT NULL,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_attempts_ip ON brute_force_attempts(ip)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_attempts_time ON brute_force_attempts(attempt_at)")

    # IP 黑名单
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ip_blacklist (
            ip          TEXT PRIMARY KEY,
            expire_at   REAL,
            ban_count   INTEGER DEFAULT 1,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # 封禁历史记录（用于累计 ban_count，解封不丢失）
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ban_history (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            ip          TEXT NOT NULL,
            ban_type    TEXT NOT NULL,       -- 'temporary' or 'permanent'
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_ban_history_ip ON ban_history(ip)")

    # Token 存储
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tokens (
            token       TEXT PRIMARY KEY,
            ip          TEXT NOT NULL,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_tokens_ip ON tokens(ip)")

    # IP 白名单
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ip_whitelist (
            ip          TEXT PRIMARY KEY,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()


def close_all():
    """关闭当前线程的数据库连接"""
    if hasattr(_local, 'conn') and _local.conn is not None:
        _local.conn.close()
        _local.conn = None
