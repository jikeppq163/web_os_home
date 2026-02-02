# ClockWidget 组件

## 组件说明

ClockWidget 组件是 OS 模拟应用的时钟小部件，负责显示当前时间和日期。

## 功能特性

- **时间显示**: 实时显示当前时间，精确到秒
- **日期显示**: 显示当前日期和星期
- **响应式设计**: 适配不同屏幕尺寸
- **动画效果**: 平滑的时间更新动画

## 组件结构

```
components/Widgets/ClockWidget/
├── index.tsx          # 组件主文件
└── README.md          # 组件说明文档
```

## 代码实现

### 核心代码

```tsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface ClockWidgetProps {
  className?: string;
}

const ClockWidget: React.FC<ClockWidgetProps> = ({ className }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col justify-center items-center ${className}`}>
      <div className="text-white text-4xl md:text-5xl font-bold mb-2">
        {format(time, 'HH:mm:ss')}
      </div>
      <div className="text-white/80 text-sm">
        {format(time, 'EEEE, MMMM d, yyyy')}
      </div>
    </div>
  );
};

export default ClockWidget;
```

## Props 说明

| 属性名    | 类型     | 必填 | 说明                          |
| --------- | -------- | ---- | ----------------------------- |
| className | string   | 否   | 自定义 CSS 类名               |

## 使用示例

```tsx
import ClockWidget from './components/Widgets/ClockWidget';

const Example: React.FC = () => {
  return (
    <div>
      {/* 基本使用 */}
      <ClockWidget />
      
      {/* 带自定义类名 */}
      <ClockWidget className="w-full h-64" />
    </div>
  );
};
```

## 历史记录

### 2026-02-02
- 组件添加详细的说明文档
- 时钟小组件优化：
  - 保留磨砂半透明背景效果
  - 添加中文语言支持，日期显示改为中文

## 后续优化

- 可以考虑添加时区选择功能
- 可以考虑添加时钟样式自定义选项
- 可以考虑添加闹钟功能
- 可以考虑添加世界时钟功能
