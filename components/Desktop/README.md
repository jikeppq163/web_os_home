# Desktop 组件

## 组件说明

Desktop 组件是 OS 模拟应用的桌面管理组件，负责管理桌面布局、小部件和应用图标。

## 功能特性

- **小部件区域**: 显示时钟、日历和天气等小部件
- **应用图标网格**: 以网格形式显示桌面应用图标
- **响应式布局**: 适配不同屏幕尺寸，自动调整网格列数
- **滚动行为**: 支持垂直滚动，适配大量应用图标
- **触摸支持**: 支持触摸设备的交互

## 组件结构

```
components/Desktop/
├── index.tsx          # 组件主文件
└── README.md          # 组件说明文档
```

## 代码实现

### 核心代码

```tsx
import React from 'react';
import AppIcon from '../AppIcon';
import CalendarWidget from '../Widgets/CalendarWidget';
import WeatherWidget from '../Widgets/WeatherWidget';
import ClockWidget from '../Widgets/ClockWidget';
import { AppConfig } from '../../types';

interface DesktopProps {
  desktopApps: AppConfig[];
  onAppClick: (app: AppConfig) => void;
}

const Desktop: React.FC<DesktopProps> = ({ desktopApps, onAppClick }) => {
  return (
    <main className="absolute top-10 left-0 right-0 bottom-24 md:bottom-28 p-4 md:p-10 overflow-y-auto no-scrollbar touch-pan-y">
      <div className="max-w-6xl mx-auto pb-8">
          {/* Grid Container */}
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-y-8 md:gap-x-10 auto-rows-max">
              
              {/* Widgets Section */}
              <div className="col-span-2 row-span-2 aspect-square">
                  <ClockWidget className="w-full h-full" />
              </div>
               <div className="col-span-2 row-span-2 aspect-square">
                  <CalendarWidget className="w-full h-full" />
              </div>
               <div className="col-span-4 md:col-span-2 row-span-1 aspect-[4/1] md:aspect-[2/1]">
                  <WeatherWidget className="w-full h-full" />
              </div>
              <div className="hidden md:block col-span-2" />

              {/* Desktop Apps */}
              {desktopApps.map((app) => (
                  <div key={app.id} className="flex justify-center items-start pt-2">
                      <AppIcon app={app} onClick={onAppClick} />
                  </div>
              ))}
          </div>
      </div>
    </main>
  );
};

export default Desktop;
```

## Props 说明

| 属性名       | 类型                | 必填 | 说明                          |
| ------------ | ------------------- | ---- | ----------------------------- |
| desktopApps  | AppConfig[]         | 是   | 桌面应用图标列表              |
| onAppClick   | (app: AppConfig) => void | 是   | 应用图标点击事件处理函数      |

## 使用示例

```tsx
import Desktop from './components/Desktop';
import { APPS } from '../../constants';

const App: React.FC = () => {
  const desktopApps = APPS.filter(app => !app.isDock);

  const handleAppClick = (app: AppConfig) => {
    // 处理应用点击逻辑
  };

  return (
    <div>
      <Desktop 
        desktopApps={desktopApps} 
        onAppClick={handleAppClick} 
      />
    </div>
  );
};
```

## 历史记录

### 2026-02-02
- 组件创建，提取自 App.tsx 中的桌面相关代码
- 实现小部件区域和应用图标网格布局
- 添加详细的组件说明文档

## 后续优化

- 可以考虑添加应用图标拖拽功能
- 可以考虑添加应用图标重命名功能
- 可以考虑添加应用文件夹功能，用于组织应用图标
- 可以考虑添加桌面背景自定义功能
- 可以考虑添加更多小部件类型和自定义小部件功能
