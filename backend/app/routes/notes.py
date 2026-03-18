from flask import Blueprint, jsonify, request
from app.services.note_service import NoteService

notes_bp = Blueprint('notes', __name__)
note_service = NoteService()

@notes_bp.route('/notes', methods=['GET'])
def get_notes():
    """获取所有笔记"""
    return note_service.get_notes()

@notes_bp.route('/notes/<note_id>', methods=['GET'])
def get_note(note_id):
    """获取单个笔记"""
    return note_service.get_note(note_id)

@notes_bp.route('/notes', methods=['POST'])
def create_note():
    """创建新笔记"""
    data = request.get_json()
    return note_service.create_note(data)

@notes_bp.route('/notes/<note_id>', methods=['PUT'])
def update_note(note_id):
    """更新笔记"""
    data = request.get_json()
    return note_service.update_note(note_id, data)

@notes_bp.route('/notes/<note_id>', methods=['DELETE'])
def delete_note(note_id):
    """删除笔记"""
    return note_service.delete_note(note_id)
