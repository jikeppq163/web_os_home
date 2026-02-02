# PasswordModal 组件

## 组件说明

PasswordModal 组件是 OS 模拟应用的密码模态框组件，负责处理需要密码认证的应用访问。

## 功能特性

- **密码输入**: 提供密码输入界面
- **认证逻辑**: 处理密码验证
- **错误提示**: 显示密码错误信息
- **动画效果**: 模态框显示和隐藏的动画效果
- **背景遮罩**: 模态框显示时的背景遮罩效果
- **键盘支持**: 支持键盘输入和回车确认

## 组件结构

```
components/PasswordModal/
├── index.tsx          # 组件主文件
└── README.md          # 组件说明文档
```

## 代码实现

### 核心代码

```tsx
import React, { useState } from 'react';

interface PasswordModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password validation for demo
    if (password === '1234') {
      setError('');
      onSuccess();
    } else {
      setError('密码错误，请重试');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 md:p-8 w-full max-w-md mx-4 animate-scale-in">
        <h2 className="text-white text-xl md:text-2xl font-bold mb-6 text-center">请输入密码</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入密码"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
            >
              确认
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
```

## Props 说明

| 属性名    | 类型          | 必填 | 说明                          |
| --------- | ------------- | ---- | ----------------------------- |
| isOpen    | boolean       | 是   | 控制模态框是否显示            |
| onSuccess | () => void    | 是   | 密码验证成功时的回调函数      |
| onCancel  | () => void    | 是   | 取消密码输入时的回调函数      |

## 使用示例

```tsx
import PasswordModal from './components/PasswordModal';

const App: React.FC = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handlePasswordSuccess = () => {
    // 处理密码验证成功逻辑
    setShowPasswordModal(false);
  };

  const handlePasswordCancel = () => {
    // 处理取消密码输入逻辑
    setShowPasswordModal(false);
  };

  return (
    <div>
      {/* 其他组件内容 */}
      
      <PasswordModal 
        isOpen={showPasswordModal} 
        onSuccess={handlePasswordSuccess}
        onCancel={handlePasswordCancel}
      />
    </div>
  );
};
```

## 历史记录

### 2026-02-02
- 组件迁移到独立文件夹结构
- 添加详细的组件说明文档

## 后续优化

- 可以考虑添加密码强度检测功能
- 可以考虑添加密码重置功能
- 可以考虑添加生物识别认证选项
- 可以考虑添加密码输入错误次数限制
- 可以考虑添加更美观的密码输入动画效果
