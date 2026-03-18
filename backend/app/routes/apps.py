from flask import Blueprint, jsonify, request
from app.services.app_service import AppService

apps_bp = Blueprint('apps', __name__)
app_service = AppService()

@apps_bp.route('/apps', methods=['GET'])
def get_apps():
    """获取应用列表"""
    return app_service.get_all_apps()

@apps_bp.route('/apps', methods=['PUT'])
def update_apps():
    """更新应用列表"""
    apps = request.get_json()
    return app_service.update_apps(apps)