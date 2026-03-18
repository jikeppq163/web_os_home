from flask import Blueprint, jsonify, request

apps_bp = Blueprint('apps', __name__)

# 应用配置数据
apps_data = [
    {
        "id": "loan-calc",
        "name": "贷款规划器",
        "url": "https://www.europlay.cn/AILoanCalculator/",
        "icon": "calculator",
        "color": "from-orange-400 to-orange-600",
        "isDock": False,
        "useVPN": True,
        "requiresPassword": False
    },
    {
        "id": "open-claw-tools",
        "name": "open claw",
        "url": "http://lobe.europlay.cn",
        "icon": "calculator",
        "color": "from-orange-400 to-orange-600",
        "isDock": False,
        "useVPN": False,
        "requiresPassword": False
    },
    {
        "id": "github",
        "name": "GitHub",
        "url": "https://github.com",
        "icon": "github",
        "color": "from-gray-700 to-gray-900",
        "isDock": True,
        "useVPN": False,
        "requiresPassword": True
    },
    {
        "id": "browser",
        "name": "Safari",
        "url": "https://google.com",
        "icon": "globe",
        "color": "from-blue-400 to-blue-600",
        "isDock": True,
        "useVPN": True,
        "requiresPassword": True
    },
    {
        "id": "music",
        "name": "音乐",
        "url": "https://music.163.com/#/playlist?id=717848220",
        "icon": "music",
        "color": "from-red-400 to-pink-600",
        "isDock": False,
        "useVPN": True,
        "requiresPassword": False
    },
    {
        "id": "settings",
        "name": "Settings",
        "url": "#",
        "icon": "settings",
        "color": "from-gray-400 to-gray-600",
        "isDock": True,
        "useVPN": True,
        "requiresPassword": True
    },
    {
        "id": "note-app",
        "name": "记事本",
        "url": "#",
        "icon": "file-text",
        "color": "from-green-400 to-green-600",
        "isDock": True,
        "useVPN": False,
        "requiresPassword": False
    }
]

@apps_bp.route('/apps', methods=['GET'])
def get_apps():
    """获取应用列表"""
    return jsonify(apps_data)

@apps_bp.route('/apps', methods=['PUT'])
def update_apps():
    """更新应用列表"""
    global apps_data
    apps_data = request.get_json()
    return jsonify({"message": "应用配置更新成功"})