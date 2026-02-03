# ClockWidget 组件

## 组件说明

ClockWidget 组件是 OS 模拟应用的时钟小部件，负责显示当前时间、日期和农历日期。

## 功能特性

- **时间显示**: 实时显示当前时间，格式为 HH:mm
- **日期显示**: 显示当前日期，使用中文格式
- **农历显示**: 显示当前农历日期，使用专业的农历计算库确保准确性
- **响应式设计**: 适配不同屏幕尺寸
- **动画效果**: 平滑的时间更新动画
- **美观的视觉效果**: 磨砂半透明背景，优雅的字体层次

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
import { zhCN } from 'date-fns/locale';
import { getLunar } from 'chinese-lunar-calendar';

const ClockWidget: React.FC<{ className?: string }> = ({ className }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

    const getLunarDate = () => {
      const lunar = getLunar(time.getFullYear(), time.getMonth() + 1, time.getDate());
      return lunar.dateStr;
    };

    return (
        <div className={`bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-6 shadow-lg flex flex-col justify-center items-center text-white relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 ${className}`}>
             <span className="text-4xl md:text-5xl lg:text-6xl font-thin tracking-wider tabular-nums">
                {format(time, 'HH:mm')}
             </span>
             <span className="text-base md:text-lg lg:text-xl font-light opacity-80 mt-2">
                {format(time, 'MMMM do', { locale: zhCN })}
             </span>
             <span className="text-sm md:text-base font-light opacity-60 mt-1">
                {getLunarDate()}
             </span>
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

### 2026-02-03
- 修复农历显示问题：
  - 替换了原来的简化农历计算实现
  - 集成了专业的 `chinese-lunar-calendar` 库
  - 确保农历日期的准确性

### 2026-02-02
- 组件添加详细的说明文档
- 时钟小组件优化：
  - 修复半透明效果问题，确保背景色能够正常显示
  - 保留磨砂半透明背景效果
  - 添加中文语言支持，日期显示改为中文

## 后续优化

- 可以考虑添加时区选择功能
- 可以考虑添加时钟样式自定义选项
- 可以考虑添加闹钟功能
- 可以考虑添加世界时钟功能
