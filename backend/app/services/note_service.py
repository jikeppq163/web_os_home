import json
import os
from flask import jsonify

class NoteService:
    def __init__(self):
        # 笔记存储目录
        self.notes_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'notes')
        # 确保目录存在
        os.makedirs(self.notes_dir, exist_ok=True)
    
    def get_notes(self):
        """获取所有笔记文件"""
        try:
            notes = []
            for filename in os.listdir(self.notes_dir):
                if filename.endswith('.md'):
                    note_path = os.path.join(self.notes_dir, filename)
                    # 获取文件的修改时间
                    mtime = os.path.getmtime(note_path)
                    notes.append({
                        'id': filename[:-3],  # 去掉 .md 后缀
                        'name': filename[:-3],
                        'path': filename,
                        'updated_at': mtime
                    })
            # 按更新时间排序，最新的放最后面
            notes.sort(key=lambda x: x['updated_at'])
            return jsonify(notes)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    def get_note(self, note_id):
        """获取单个笔记内容"""
        try:
            note_file = os.path.join(self.notes_dir, f"{note_id}.md")
            if not os.path.exists(note_file):
                return jsonify({"error": "Note not found"}), 404
            
            with open(note_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            return jsonify({
                'id': note_id,
                'name': note_id,
                'content': content
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    def create_note(self, data):
        """创建新笔记"""
        try:
            name = data.get('name')
            content = data.get('content', '')
            
            if not name:
                return jsonify({"error": "Note name is required"}), 400
            
            note_file = os.path.join(self.notes_dir, f"{name}.md")
            
            # 检查文件是否已存在
            if os.path.exists(note_file):
                return jsonify({"error": "Note with this name already exists"}), 400
            
            with open(note_file, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return jsonify({
                'id': name,
                'name': name,
                'content': content,
                'message': 'Note created successfully'
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    def update_note(self, note_id, data):
        """更新笔记"""
        try:
            content = data.get('content')
            
            if content is None:
                return jsonify({"error": "Content is required"}), 400
            
            note_file = os.path.join(self.notes_dir, f"{note_id}.md")
            
            if not os.path.exists(note_file):
                return jsonify({"error": "Note not found"}), 404
            
            with open(note_file, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return jsonify({
                'id': note_id,
                'name': note_id,
                'content': content,
                'message': 'Note updated successfully'
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    def delete_note(self, note_id):
        """删除笔记"""
        try:
            note_file = os.path.join(self.notes_dir, f"{note_id}.md")
            
            if not os.path.exists(note_file):
                return jsonify({"error": "Note not found"}), 404
            
            os.remove(note_file)
            
            return jsonify({"message": "Note deleted successfully"})
        except Exception as e:
            return jsonify({"error": str(e)}), 500