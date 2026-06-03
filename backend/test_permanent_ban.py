#!/usr/bin/env python3
"""
永久封禁机制测试脚本
模拟多次触发封禁，验证永久拉黑机制
"""
import requests
import json
import time

BASE_URL = "http://127.0.0.1:5100/api"
CORRECT_PASSWORD = "ouyuan"
WRONG_PASSWORD = "wrong_password"

def test_permanent_ban():
    print("=" * 60)
    print("永久封禁机制测试")
    print("=" * 60)

    # 1. 查看初始状态
    print("\n[1] 查看初始状态...")
    resp = requests.get(f"{BASE_URL}/auth/brute-force/status")
    print(f"    状态: {resp.json()}")

    # 2. 第 1 次触发封禁（5 次错误密码）
    print("\n[2] 第 1 次触发封禁（5 次错误密码）...")
    for i in range(5):
        requests.post(f"{BASE_URL}/auth/login", json={"password": WRONG_PASSWORD})
    resp = requests.get(f"{BASE_URL}/auth/brute-force/status?ip=127.0.0.1")
    status = resp.json()
    print(f"    封禁状态: 临时封禁, 剩余 {status['ban_remaining_seconds']}s, 封禁次数={status['ban_count']}")

    # 3. 手动解封
    print("\n[3] 手动解封...")
    requests.post(f"{BASE_URL}/auth/brute-force/unban", json={
        "ip": "127.0.0.1",
        "password": CORRECT_PASSWORD
    })
    print("    已解封")

    # 4. 第 2 次触发封禁
    print("\n[4] 第 2 次触发封禁...")
    for i in range(5):
        requests.post(f"{BASE_URL}/auth/login", json={"password": WRONG_PASSWORD})
    resp = requests.get(f"{BASE_URL}/auth/brute-force/status?ip=127.0.0.1")
    status = resp.json()
    print(f"    封禁状态: 临时封禁, 剩余 {status['ban_remaining_seconds']}s, 封禁次数={status['ban_count']}")

    # 5. 手动解封
    print("\n[5] 手动解封...")
    requests.post(f"{BASE_URL}/auth/brute-force/unban", json={
        "ip": "127.0.0.1",
        "password": CORRECT_PASSWORD
    })
    print("    已解封")

    # 6. 第 3 次触发封禁
    print("\n[6] 第 3 次触发封禁...")
    for i in range(5):
        requests.post(f"{BASE_URL}/auth/login", json={"password": WRONG_PASSWORD})
    resp = requests.get(f"{BASE_URL}/auth/brute-force/status?ip=127.0.0.1")
    status = resp.json()
    print(f"    封禁状态: 临时封禁, 剩余 {status['ban_remaining_seconds']}s, 封禁次数={status['ban_count']}")

    # 7. 手动解封
    print("\n[7] 手动解封...")
    resp = requests.post(f"{BASE_URL}/auth/brute-force/unban", json={
        "ip": "127.0.0.1",
        "password": CORRECT_PASSWORD
    })
    print(f"    解封结果: {resp.json()}")

    # 8. 第 4 次触发封禁 → 应该永久封禁！
    print("\n[8] 第 4 次触发封禁（应触发永久封禁）...")
    for i in range(5):
        requests.post(f"{BASE_URL}/auth/login", json={"password": WRONG_PASSWORD})
    resp = requests.get(f"{BASE_URL}/auth/brute-force/status?ip=127.0.0.1")
    status = resp.json()
    print(f"    封禁状态: {'永久封禁' if status['is_permanent'] else '临时封禁'}, 封禁次数={status['ban_count']}")

    # 9. 用正确密码尝试（应仍被拒绝）
    print("\n[9] 用正确密码尝试登录（应被拒绝）...")
    resp = requests.post(f"{BASE_URL}/auth/login", json={"password": CORRECT_PASSWORD})
    print(f"    结果: HTTP {resp.status_code} - {resp.json()['error']}")

    # 10. 查看全局状态
    print("\n[10] 查看全局状态...")
    resp = requests.get(f"{BASE_URL}/auth/brute-force/status")
    status = resp.json()
    print(f"    永久封禁 IP: {status.get('permanent_bans', [])}")

    print("\n" + "=" * 60)
    print("测试完成")
    print("=" * 60)

if __name__ == "__main__":
    try:
        test_permanent_ban()
    except requests.exceptions.ConnectionError:
        print("❌ 无法连接到后端服务，请先启动: cd backend && python3 app.py")
    except Exception as e:
        print(f"❌ 测试出错: {e}")
