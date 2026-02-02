# AppIcon 组件

## 组件说明

AppIcon 组件是 OS 模拟应用的应用图标组件，负责显示应用的图标和名称，支持不同尺寸和交互效果。

## 功能特性

- **应用图标显示**: 显示应用的图标图片
- **应用名称显示**: 显示应用的名称
- **不同尺寸**: 支持不同尺寸的图标显示
- **点击事件**: 支持应用图标点击事件
- **悬停效果**: 应用图标悬停时的动画效果
- **VPN 标记**: 显示需要 VPN 的应用标记

## 组件结构

```
components/AppIcon/
├── index.tsx          # 组件主文件
└── README.md          # 组件说明文档
```

## 代码实现

### 核心代码

```tsx
import React from 'react';
import { AppConfig } from '../../types';

interface AppIconProps {
  app: AppConfig;
  onClick: (app: AppConfig) => void;
  size?: 'small' | 'normal' | 'large';
}

const AppIcon: React.FC<AppIconProps> = ({ app, onClick, size = 'normal' }) => {
  const sizeClasses = {
    small: 'w-10 h-10',
    normal: 'w-14 h-14',
    large: 'w-16 h-16'
  };

  return (
    <div 
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={() => onClick(app)}
    >
      <div className={`${sizeClasses[size]} rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}>
        <img 
          src={app.icon} 
          alt={app.name} 
          className="w-full h-full object-cover" 
        />
        {app.useVPN && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </div>
        )}
      </div>
      <span className="text-white text-xs md:text-sm font-medium text-center w-full truncate">
        {app.name}
      </span>
    </div>
  );
};

export default AppIcon;
```

## Props 说明

| 属性名    | 类型                | 必填 | 说明                          |
| --------- | ------------------- | ---- | ----------------------------- |
| app       | AppConfig           | 是   | 应用配置信息                  |
| onClick   | (app: AppConfig) => void | 是   | 应用图标点击事件处理函数      |
| size      | 'small'  'normal'  'large' | 否   | 图标尺寸，默认 'normal'       |

## 使用示例

```tsx
import AppIcon from './components/AppIcon';

const Example: React.FC = () => {
  const app = {
    id: '1',
    name: 'Example App',
    icon: 'https://example.com/icon.png',
    url: 'https://example.com',
    useVPN: false,
    isDock: false,
    requiresPassword: false
  };

  const handleAppClick = (app: AppConfig) => {
    // 处理应用点击逻辑
  };

  return (
    <div>
      {/* 正常尺寸 */}
      <AppIcon app={app} onClick={handleAppClick} />
      
      {/* 小尺寸 */}
      <AppIcon app={app} onClick={handleAppClick} size="small" />
      
      {/* 大尺寸 */}
      <AppIcon app={app} onClick={handleAppClick} size="large" />
    </div>
  );
};
```

## 历史记录

### 2026-02-02
- 组件迁移到独立文件夹结构
- 添加详细的组件说明文档

## 后续优化

- 可以考虑添加应用图标拖拽功能
- 可以考虑添加应用图标重命名功能
- 可以考虑添加应用图标自定义功能
- 可以考虑添加应用图标状态管理（如正在运行的标记）
- 可以考虑添加应用图标快捷操作菜单
