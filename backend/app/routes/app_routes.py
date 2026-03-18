from app import app
from app.services.app_service import AppService
from app.services.note_service import NoteService
from flask import request

# 创建服务实例
app_service = AppService()
note_service = NoteService()

@app.route('/api/apps', methods=['GET'])
def get_apps():
    """获取应用配置列表"""
    return app_service.get_all_apps()

@app.route('/api/apps/<app_id>', methods=['GET'])
def get_app(app_id):
    """获取单个应用配置"""
    return app_service.get_app_by_id(app_id)

@app.route('/api/apps', methods=['PUT'])
def update_apps():
    """更新应用配置"""
    data = request.get_json()
    if not data or not isinstance(data, list):
        return {"error": "Invalid data format"}, 400
    return app_service.update_apps(data)

# 记事本相关路由
@app.route('/api/notes', methods=['GET'])
def get_notes():
    """获取所有笔记"""
    return note_service.get_notes()

@app.route('/api/notes/<note_id>', methods=['GET'])
def get_note(note_id):
    """获取单个笔记"""
    return note_service.get_note(note_id)

@app.route('/api/notes', methods=['POST'])
def create_note():
    """创建新笔记"""
    data = request.get_json()
    return note_service.create_note(data)

@app.route('/api/notes/<note_id>', methods=['PUT'])
def update_note(note_id):
    """更新笔记"""
    data = request.get_json()
    return note_service.update_note(note_id, data)

@app.route('/api/notes/<note_id>', methods=['DELETE'])
def delete_note(note_id):
    """删除笔记"""
    return note_service.delete_note(note_id)