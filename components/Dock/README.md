# Dock 组件

## 组件说明

Dock 组件是 OS 模拟应用的底部快捷栏组件，负责显示常用应用的快捷方式。

## 功能特性

- **应用快捷方式**: 显示常用应用的图标
- **居中布局**: 水平居中显示在屏幕底部
- **响应式设计**: 适配不同屏幕尺寸，自动调整大小
- **悬停效果**: 应用图标悬停时的动画效果
- **点击反馈**: 应用图标点击时的反馈效果
- **滚动支持**: 应用图标过多时支持水平滚动

## 组件结构

```
components/Dock/
├── index.tsx          # 组件主文件
└── README.md          # 组件说明文档
```

## 代码实现

### 核心代码

```tsx
import React from 'react';
import { AppConfig } from '../../types';
import AppIcon from '../AppIcon';

interface DockProps {
  apps: AppConfig[];
  onAppClick: (app: AppConfig) => void;
}

const Dock: React.FC<DockProps> = ({ apps, onAppClick }) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-auto max-w-[95%] md:max-w-[90%] z-40">
        <div className="bg-white/20 backdrop-blur-2xl border border-white/20 px-3 py-3 md:px-6 md:py-4 rounded-[1.5rem] md:rounded-[2rem] flex items-end gap-3 md:gap-6 shadow-2xl transition-all hover:bg-white/30 overflow-x-auto no-scrollbar">
            {apps.map((app) => (
                <div key={app.id} className="relative group shrink-0">
                     {/* Bounce effect wrapper */}
                    <AppIcon app={app} size="normal" onClick={onAppClick} />
                    {/* Active Indicator Dot (Cosmetic) */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            ))}
        </div>
    </div>
  );
};

export default Dock;
```

## Props 说明

| 属性名    | 类型                | 必填 | 说明                          |
| --------- | ------------------- | ---- | ----------------------------- |
| apps      | AppConfig[]         | 是   | Dock 中显示的应用列表         |
| onAppClick | (app: AppConfig) => void | 是   | 应用图标点击事件处理函数      |

## 使用示例

```tsx
import Dock from './components/Dock';
import { APPS } from '../../constants';

const App: React.FC = () => {
  const dockApps = APPS.filter(app => app.isDock);

  const handleAppClick = (app: AppConfig) => {
    // 处理应用点击逻辑
  };

  return (
    <div>
      <Dock apps={dockApps} onAppClick={handleAppClick} />
    </div>
  );
};
```

## 历史记录

### 2026-02-02
- 组件迁移到独立文件夹结构
- 添加详细的组件说明文档

## 后续优化

- 可以考虑添加 Dock 应用拖拽排序功能
- 可以考虑添加 Dock 应用添加/删除功能
- 可以考虑添加 Dock 大小调整功能
- 可以考虑添加 Dock 位置自定义功能
- 可以考虑添加 Dock 动画效果增强
