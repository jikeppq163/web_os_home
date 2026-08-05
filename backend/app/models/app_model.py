import json
import os

class AppModel:
    def __init__(self):
        # 配置文件路径
        self.config_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'config')
        self.apps_file = os.path.join(self.config_dir, 'apps.json')
        self.default_apps_file = os.path.join(self.config_dir, 'apps.default.json')
        # 加载配置
        self.apps = self._load_apps()
    
    def _load_apps(self):
        """加载应用配置，优先使用 apps.json，失败则使用默认配置"""
        try:
            if os.path.exists(self.apps_file):
                with open(self.apps_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                # 如果 apps.json 不存在，使用默认配置
                return self._load_default_apps()
        except (json.JSONDecodeError, Exception):
            # 如果配置文件无效，使用默认配置
            return self._load_default_apps()
    
    def _load_default_apps(self):
        """加载默认应用配置"""
        try:
            with open(self.default_apps_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, Exception):
            # 如果默认配置也无效，返回空列表
            return []
    
    def save_apps(self, apps):
        """保存应用配置到文件"""
        try:
            with open(self.apps_file, 'w', encoding='utf-8') as f:
                json.dump(apps, f, ensure_ascii=False, indent=2)
            self.apps = apps
            return True
        except Exception:
            return False
    
    def get_all(self):
        """获取所有应用配置（实时从文件读取，支持被外部如 MCP 修改后即时生效）"""
        return self._load_apps()
    
    def get_by_id(self, app_id):
        """根据 ID 获取应用配置（实时从文件读取）"""
        return next((app for app in self._load_apps() if app['id'] == app_id), None)