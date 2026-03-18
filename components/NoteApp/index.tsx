import React, { useState, useEffect } from 'react';
import { Save, Trash2, Plus } from 'lucide-react';
import MarkdownEditor from '@uiw/react-markdown-editor';

interface Note {
  id: string;
  name: string;
  path: string;
  content?: string;
  updated_at?: number;
}

const NoteApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [newNoteName, setNewNoteName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('');

  // 格式化时间
  const formatTime = (date: Date): string => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // 加载笔记列表
  useEffect(() => {
    fetchNotes();
  }, []);

  // 当笔记列表更新时，默认选择第一个笔记
  useEffect(() => {
    if (notes.length > 0 && !selectedNote) {
      setSelectedNote(notes[0]);
    }
  }, [notes, selectedNote]);

  // 加载单个笔记内容
  useEffect(() => {
    if (selectedNote) {
      fetchNoteContent(selectedNote.id);
    }
  }, [selectedNote]);

  // 获取所有笔记
  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // 获取单个笔记内容
  const fetchNoteContent = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
      }
    } catch (error) {
      console.error('Error fetching note content:', error);
    }
  };

  // 创建新笔记
  const createNote = async () => {
    if (!newNoteName.trim()) return;

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newNoteName, content: '' }),
      });

      if (response.ok) {
        setIsCreating(false);
        setNewNoteName('');
        fetchNotes();
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  // 保存笔记
  const saveNote = async () => {
    if (!selectedNote) return;

    try {
      const response = await fetch(`/api/notes/${selectedNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        // 保存成功
        console.log('Note saved successfully');
        // 更新最后保存时间
        setLastSaved(formatTime(new Date()));
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // 删除笔记
  const deleteNote = async (noteId: string) => {
    if (!confirm('确定要删除这篇笔记吗？')) return;

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (selectedNote && selectedNote.id === noteId) {
          setSelectedNote(null);
          setContent('');
        }
        fetchNotes();
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="flex h-full w-full bg-gray-100">
      {/* 左侧目录 */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">记事本</h2>
        </div>
        
        {/* 新建笔记 */}
        {isCreating ? (
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="笔记名称"
              value={newNoteName}
              onChange={(e) => setNewNoteName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={createNote}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                创建
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="p-4 border-b border-gray-200 flex items-center gap-2 hover:bg-gray-50"
          >
            <Plus size={18} />
            <span>新建笔记</span>
          </button>
        )}
        
        {/* 笔记列表 */}
        <div className="flex-1 overflow-y-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer ${selectedNote?.id === note.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              onClick={() => setSelectedNote(note)}
            >
              <div className="flex-1 min-w-0">
                <span className="truncate block">{note.name}</span>
                {note.updated_at && (
                  <span className="text-xs text-gray-500 truncate">
                    {new Date(note.updated_at * 1000).toLocaleString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className="text-gray-400 hover:text-red-500 ml-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* 右侧编辑区 */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
              <h3 className="text-lg font-medium">{selectedNote.name}</h3>
              <div className="flex items-center gap-4">
                {lastSaved && (
                  <span className="text-sm text-gray-500">
                    最后保存: {lastSaved}
                  </span>
                )}
                <button
                  onClick={saveNote}
                  className="flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  <Save size={18} />
                  保存
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <MarkdownEditor
                value={content}
                onChange={(value) => setContent(value || '')}
                placeholder="在这里输入 Markdown 内容..."
                className="h-full"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>请选择或创建一个笔记</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteApp;