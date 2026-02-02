# ProxyBrowser 组件

## 组件说明

ProxyBrowser 组件是 OS 模拟应用的代理浏览器组件，负责处理需要 VPN 访问的应用。

## 功能特性

- **应用嵌入**: 在模态框中嵌入应用网页
- **标题栏**: 显示应用名称和关闭按钮
- **响应式设计**: 适配不同屏幕尺寸
- **动画效果**: 模态框显示和隐藏的动画效果
- **背景遮罩**: 模态框显示时的背景遮罩效果

## 组件结构

```
components/ProxyBrowser/
├── index.tsx          # 组件主文件
└── README.md          # 组件说明文档
```

## 代码实现

### 核心代码

```tsx
import React from 'react';
import { AppConfig } from '../../types';

interface ProxyBrowserProps {
  isOpen: boolean;
  app: AppConfig | null;
  onClose: () => void;
}

const ProxyBrowser: React.FC<ProxyBrowserProps> = ({ isOpen, app, onClose }) => {
  if (!isOpen || !app) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] mx-4 animate-scale-in flex flex-col">
        {/* Title Bar */}
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-white text-lg font-medium">{app.name}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Browser Content */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={app.url}
            title={app.name}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );
};

export default ProxyBrowser;
```

## Props 说明

| 属性名    | 类型                | 必填 | 说明                          |
| --------- | ------------------- | ---- | ----------------------------- |
| isOpen    | boolean             | 是   | 控制模态框是否显示            |
| app       | AppConfig  null   | 是   | 当前打开的应用配置信息        |
| onClose   | () => void          | 是   | 关闭模态框的回调函数          |

## 使用示例

```tsx
import ProxyBrowser from './components/ProxyBrowser';

const App: React.FC = () => {
  const [showBrowser, setShowBrowser] = useState(false);
  const [activeApp, setActiveApp] = useState<AppConfig | null>(null);

  const handleCloseBrowser = () => {
    setShowBrowser(false);
    setActiveApp(null);
  };

  const handleAppClick = (app: AppConfig) => {
    setActiveApp(app);
    setShowBrowser(true);
  };

  return (
    <div>
      {/* 其他组件内容 */}
      
      <ProxyBrowser 
        isOpen={showBrowser}
        app={activeApp}
        onClose={handleCloseBrowser}
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

- 可以考虑添加浏览器导航功能（前进、后退、刷新）
- 可以考虑添加浏览器地址栏
- 可以考虑添加浏览器标签页功能
- 可以考虑添加浏览器历史记录
- 可以考虑添加浏览器书签功能
- 可以考虑添加浏览器缩放功能
