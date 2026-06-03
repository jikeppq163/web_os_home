#!/usr/bin/env python3
"""
防爆破机制测试脚本
模拟多次错误密码登录，验证 IP 黑名单机制
"""
import requests
import json
import time

BASE_URL = "http://127.0.0.1:5100/api"
CORRECT_PASSWORD = "ouyuan"
WRONG_PASSWORD = "wrong_password"

def test_brute_force():
    print("=" * 60)
    print("防爆破机制测试")
    print("=" * 60)

    # 1. 先查看初始状态
    print("\n[1] 查看初始防爆破状态...")
    resp = requests.get(f"{BASE_URL}/auth/brute-force/status")
    print(f"    状态: {resp.json()}")

    # 2. 模拟 4 次错误密码（未触发封禁）
    print("\n[2] 模拟 4 次错误密码登录（不应触发封禁）...")
    for i in range(4):
        resp = requests.post(f"{BASE_URL}/auth/login", json={"password": WRONG_PASSWORD})
        print(f"    第 {i+1} 次: HTTP {resp.status_code} - {resp.json()['error']}")

    # 3. 查看状态（应该有 4 次失败记录）
    print("\n[3] 查看当前 IP 的防爆破状态...")
    resp = requests.get(f"{BASE_URL}/auth/brute-force/status")
    status = resp.json()
    print(f"    全局状态: {json.dumps(status, indent=4)}")

    # 4. 第 5 次错误密码（触发封禁）
    print("\n[4] 第 5 次错误密码登录（应触发封禁）...")
    resp = requests.post(f"{BASE_URL}/auth/login", json={"password": WRONG_PASSWORD})
    print(f"    第 5 次: HTTP {resp.status_code} - {resp.json()['error']}")

    # 5. 查看状态（应该已被封禁）
    print("\n[5] 查看封禁状态...")
    resp = requests.get(f"{BASE_URL}/auth/brute-force/status")
    status = resp.json()
    print(f"    全局状态: {json.dumps(status, indent=4)}")

    # 6. 用正确密码尝试登录（应仍被拒绝）
    print("\n[6] 用正确密码尝试登录（应仍被拒绝，伪装成密码错误）...")
    resp = requests.post(f"{BASE_URL}/auth/login", json={"password": CORRECT_PASSWORD})
    print(f"    正确密码: HTTP {resp.status_code} - {resp.json()['error']}")

    # 7. 手动解封
    print("\n[7] 手动解封 IP...")
    # 获取被封禁的 IP
    blacklisted = status.get('blacklisted_ips', [])
    if blacklisted:
        target_ip = blacklisted[0]
        resp = requests.post(f"{BASE_URL}/auth/brute-force/unban", json={
            "ip": target_ip,
            "password": CORRECT_PASSWORD
        })
        print(f"    解封结果: HTTP {resp.status_code} - {resp.json()}")

        # 8. 解封后用正确密码登录（应成功）
        print("\n[8] 解封后用正确密码登录（应成功）...")
        resp = requests.post(f"{BASE_URL}/auth/login", json={"password": CORRECT_PASSWORD})
        print(f"    登录结果: HTTP {resp.status_code} - {resp.json()}")
    else:
        print("    没有被封禁的 IP，跳过解封测试")

    print("\n" + "=" * 60)
    print("测试完成")
    print("=" * 60)

if __name__ == "__main__":
    try:
        test_brute_force()
    except requests.exceptions.ConnectionError:
        print("❌ 无法连接到后端服务，请先启动: cd backend && python3 app.py")
    except Exception as e:
        print(f"❌ 测试出错: {e}")
