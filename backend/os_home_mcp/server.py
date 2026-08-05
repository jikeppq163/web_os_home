"""
os_home_mcp — My OS Home 的「AI 应用接入层」。

让 AI Agent（如 QwenPaw）把生成的应用一键注册进桌面。

两种运行模式：
  - streamable_http（默认，服务器上供 QwenPaw 远程/同机接入）
  - stdio（本机调试，配合 MCP Inspector）

工具集：
  reserve_port      为 AI 生成的后端应用分配一个空闲端口
  deploy_static     把 AI 生成的静态 dist 部署为可访问的静态应用
  register_app      核心：把一条应用写进 apps.json
  list_apps         列出已注册应用
  update_app        更新应用配置
  remove_app        删除应用
  test_app          通过代理探测应用 URL 是否可访问
  get_proxy_url     生成代理访问 URL
"""

from __future__ import annotations

import json
import os
import re
import shutil
import socket
import time
import urllib.parse
from pathlib import Path

import requests
from fastmcp import FastMCP

# ---------------------------------------------------------------------------
# 定位项目目录（默认以本文件所在位置推断项目根）
# ---------------------------------------------------------------------------
_HERE = Path(__file__).resolve().parent        # backend/os_home_mcp
_BACKEND_DIR = _HERE.parent                     # backend
_PROJECT_ROOT = _BACKEND_DIR.parent             # 项目根（my-os-home）

OS_HOME_DIR = Path(
    os.environ.get("OS_HOME_DIR", str(_PROJECT_ROOT))
).resolve()

APPS_FILE = OS_HOME_DIR / "backend" / "config" / "apps.json"
STATIC_APPS_DIR = OS_HOME_DIR / "backend" / "static_apps"

HOST = os.environ.get("OS_HOME_MCP_HOST", "127.0.0.1")
PORT = int(os.environ.get("OS_HOME_MCP_PORT", "5101"))

mcp = FastMCP("os-home")


# ---------------------------------------------------------------------------
# 内部工具函数
# ---------------------------------------------------------------------------
def _require_apps_file() -> Path:
    """确保 apps.json 存在，不存在则创建为空数组。"""
    APPS_FILE.parent.mkdir(parents=True, exist_ok=True)
    if not APPS_FILE.exists():
        APPS_FILE.write_text("[]", encoding="utf-8")
    return APPS_FILE


def _read_apps() -> list[dict]:
    _require_apps_file()
    try:
        return json.loads(APPS_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []


def _write_apps(apps: list[dict]) -> None:
    APPS_FILE.write_text(
        json.dumps(apps, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def _slugify(name: str) -> str:
    """把应用名转成可作 id/目录名的 slug。保留中文，空格与特殊字符转连字符。"""
    s = name.strip().lower()
    s = re.sub(r"[\/\\\s.:]+", "-", s)
    s = re.sub(r"[^a-z0-9\u4e00-\u9fff\-_]", "", s)
    return s or f"app-{int(time.time())}"


def _unique_id(apps: list[dict], base: str) -> str:
    """保证 id 唯一，冲突时追加序号。"""
    existing = {a.get("id") for a in apps}
    if base not in existing:
        return base
    i = 2
    while f"{base}-{i}" in existing:
        i += 1
    return f"{base}-{i}"


def _resolve_target(target: str) -> str:
    """把 local:端口 或短 host 解析为完整 URL。"""
    if target.startswith("local:"):
        rest = target[len("local:"):]
        return f"http://127.0.0.1/{rest}"
    if target.startswith(("http://", "https://")):
        return target
    return f"https://{target}"


def _find_free_port() -> int:
    """在 127.0.0.1 上找一个空闲端口。"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


# ---------------------------------------------------------------------------
# 工具
# ---------------------------------------------------------------------------
@mcp.tool
def reserve_port() -> dict:
    """为 AI 生成的后端应用分配一个空闲端口（绑定在 127.0.0.1）。

    Returns:
        包含空闲端口的 dict，形如 {"port": 8080}。
    """
    return {"port": _find_free_port()}


@mcp.tool
def deploy_static(source_dir: str, name: str) -> dict:
    """把 AI 生成的静态网页（vite build 产物等）部署为 My OS Home 的静态应用。

    Args:
        source_dir: 源目录绝对路径（含 index.html 的 dist 目录）。
        name: 应用名称，用于生成目录名。

    Returns:
        部署结果，含可访问的 url（同源 /static_apps/... 路径）。
    """
    if not os.path.isdir(source_dir):
        return {"ok": False, "error": f"源目录不存在: {source_dir}"}

    slug = _slugify(name)
    target_dir = STATIC_APPS_DIR / slug

    # 先清空旧目录再拷贝，避免残留旧文件
    if target_dir.exists():
        shutil.rmtree(target_dir)
    shutil.copytree(source_dir, target_dir)

    index = target_dir / "index.html"
    url = f"/static_apps/{slug}/index.html" if index.exists() else f"/static_apps/{slug}/"

    return {
        "ok": True,
        "slug": slug,
        "url": url,
        "disk_path": str(target_dir),
    }


@mcp.tool
def register_app(
    name: str,
    url: str,
    icon: str = "globe",
    color: str = "from-blue-400 to-blue-600",
    is_dock: bool = False,
    use_vpn: bool = False,
    requires_password: bool = False,
    app_id: str = "",
) -> dict:
    """把一条应用注册进 My OS Home 桌面（写入 apps.json）。

    Args:
        name: 应用显示名称。
        url: 应用访问地址。支持 "local:8080"（本机后端服务）、
             "https://..."、"http://..."、"/static_apps/<slug>/index.html"（静态应用）。
        icon: 图标名（lucide 图标名，如 timer、calculator、globe）。
        color: 渐变配色（如 from-blue-400 to-blue-600）。
        is_dock: 是否固定到 Dock 栏。
        use_vpn: 是否走 VPN 代理访问。
        requires_password: 打开是否需密码。
        app_id: 可选，指定应用 id；缺省由 name 自动生成。
    """
    apps = _read_apps()
    base_id = _slugify(app_id or name)
    app_id = _unique_id(apps, base_id)

    entry = {
        "id": app_id,
        "name": name,
        "url": url,
        "icon": icon or "globe",
        "color": color,
        "isDock": is_dock,
        "useVPN": use_vpn,
        "requiresPassword": requires_password,
    }
    apps.append(entry)
    _write_apps(apps)

    return {"ok": True, "app": entry, "apps_count": len(apps)}


@mcp.tool
def list_apps() -> dict:
    """列出当前已注册的所有应用。"""
    apps = _read_apps()
    return {"apps": apps, "count": len(apps)}


@mcp.tool
def update_app(
    app_id: str,
    name: str | None = None,
    url: str | None = None,
    icon: str | None = None,
    color: str | None = None,
    is_dock: bool | None = None,
    use_vpn: bool | None = None,
    requires_password: bool | None = None,
) -> dict:
    """更新一个已注册应用的配置（仅更新传入的非 None 字段）。

    Args:
        app_id: 要更新的应用 id。
        name: 新的显示名称。
        url: 新的访问地址。
        icon: 新的图标名。
        color: 新的渐变配色。
        is_dock: 是否固定到 Dock 栏。
        use_vpn: 是否走 VPN 代理访问。
        requires_password: 打开是否需密码。
    """
    apps = _read_apps()
    field_map = {
        "name": "name",
        "url": "url",
        "icon": "icon",
        "color": "color",
        "is_dock": "isDock",
        "use_vpn": "useVPN",
        "requires_password": "requiresPassword",
    }
    changes = {
        k: v for k, v in {
            "name": name,
            "url": url,
            "icon": icon,
            "color": color,
            "is_dock": is_dock,
            "use_vpn": use_vpn,
            "requires_password": requires_password,
        }.items() if v is not None
    }
    if not changes:
        return {"ok": False, "error": "未提供任何可更新的字段"}
    for app in apps:
        if app.get("id") == app_id:
            for k, v in changes.items():
                app[field_map[k]] = v
            _write_apps(apps)
            return {"ok": True, "app": app}
    return {"ok": False, "error": f"未找到应用 id: {app_id}"}


@mcp.tool
def remove_app(app_id: str, delete_files: bool = False) -> dict:
    """删除一个已注册的应用。

    Args:
        app_id: 要删除的应用 id。
        delete_files: 若为 True 且该应用是静态应用，则同时删除其静态文件目录。
    """
    apps = _read_apps()
    target = next((a for a in apps if a.get("id") == app_id), None)
    if not target:
        return {"ok": False, "error": f"未找到应用 id: {app_id}"}

    apps = [a for a in apps if a.get("id") != app_id]
    _write_apps(apps)

    if delete_files and target.get("url", "").startswith("/static_apps/"):
        parts = target["url"].split("/")
        slug = parts[2] if len(parts) > 2 else None
        if slug:
            d = STATIC_APPS_DIR / slug
            if d.exists():
                shutil.rmtree(d)

    return {"ok": True, "removed": app_id, "apps_count": len(apps)}


@mcp.tool
def test_app(url: str) -> dict:
    """探测一个应用 URL 是否可访问（通过代理相同逻辑解析）。

    Args:
        url: 应用地址，支持 local:端口 / http(s):// / /static_apps/...。
    """
    if url.startswith("/static_apps/"):
        # 同源静态应用：检查文件是否存在
        rel = url.lstrip("/")
        fp = OS_HOME_DIR / rel
        return {
            "ok": fp.exists(),
            "url": url,
            "detail": "静态文件存在" if fp.exists() else "静态文件缺失",
        }

    resolved = _resolve_target(url)
    try:
        r = requests.get(resolved, timeout=5, verify=False)
        return {"ok": r.status_code < 500, "url": url, "status": r.status_code}
    except Exception as e:
        return {"ok": False, "url": url, "error": str(e)}


@mcp.tool
def get_proxy_url(target: str) -> dict:
    """生成 My OS Home 代理浏览器可用的代理 URL。

    Args:
        target: 目标地址，支持 local:端口 / http(s)://...
    """
    resolved = _resolve_target(target)
    proxy = f"/api/proxy/{urllib.parse.quote(resolved, safe='')}"
    return {"proxy_url": proxy, "resolved": resolved}


# ---------------------------------------------------------------------------
# 入口
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    transport = os.environ.get("OS_HOME_MCP_TRANSPORT", "streamable-http")
    if transport == "stdio":
        mcp.run(transport="stdio")
    else:
        print(f"os_home_mcp listening on http://{HOST}:{PORT}/mcp")
        # host/port 在 run 时传入（fastmcp 3.x 已从构造函数移除）
        mcp.run(transport="streamable-http", host=HOST, port=PORT)