from flask import jsonify
from app.models.app_model import AppModel

class AppService:
    def __init__(self):
        # 创建模型实例
        self.app_model = AppModel()
    
    def get_all_apps(self):
        """获取所有应用配置"""
        apps = self.app_model.get_all()
        return jsonify(apps)
    
    def get_app_by_id(self, app_id):
        """根据 ID 获取应用配置"""
        app = self.app_model.get_by_id(app_id)
        if app:
            return jsonify(app)
        return jsonify({"error": "App not found"}), 404
    
    def update_apps(self, apps):
        """更新应用配置"""
        success = self.app_model.save_apps(apps)
        if success:
            return jsonify({"message": "Apps updated successfully"})
        return jsonify({"error": "Failed to update apps"}), 500