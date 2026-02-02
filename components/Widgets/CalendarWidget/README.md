# CalendarWidget 组件

## 组件说明

CalendarWidget 组件是 OS 模拟应用的日历小部件，负责显示当前月份的日历。

## 功能特性

- **月份显示**: 显示当前月份的完整日历
- **日期高亮**: 高亮显示当前日期
- **响应式设计**: 适配不同屏幕尺寸
- **导航功能**: 支持月份切换

## 组件结构

```
components/Widgets/CalendarWidget/
├── index.tsx          # 组件主文件
└── README.md          # 组件说明文档
```

## 代码实现

### 核心代码

```tsx
import React, { useState } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, format } from 'date-fns';

interface CalendarWidgetProps {
  className?: string;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ className }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dates = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevMonth} className="text-white hover:text-gray-300">
            &lt;
          </button>
          <h3 className="text-white font-medium">{format(currentMonth, 'MMMM yyyy')}</h3>
          <button onClick={handleNextMonth} className="text-white hover:text-gray-300">
            &gt;
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-white/80 text-xs">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {dates.map(date => (
            <div
              key={date.toString()}
              className={`aspect-square flex items-center justify-center text-sm ${
                isSameDay(date, new Date())
                  ? 'bg-blue-500 text-white rounded-full'
                  : format(date, 'MM') !== format(currentMonth, 'MM')
                  ? 'text-white/40'
                  : 'text-white'
              }`}
            >
              {format(date, 'd')}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 ${className}`}>
      {renderCalendar()}
    </div>
  );
};

export default CalendarWidget;
```

## Props 说明

| 属性名    | 类型     | 必填 | 说明                          |
| --------- | -------- | ---- | ----------------------------- |
| className | string   | 否   | 自定义 CSS 类名               |

## 使用示例

```tsx
import CalendarWidget from './components/Widgets/CalendarWidget';

const Example: React.FC = () => {
  return (
    <div>
      {/* 基本使用 */}
      <CalendarWidget />
      
      {/* 带自定义类名 */}
      <CalendarWidget className="w-full h-64" />
    </div>
  );
};
```

## 历史记录

### 2026-02-02
- 组件迁移到独立文件夹结构
- 添加详细的组件说明文档

## 后续优化

- 可以考虑添加事件标记功能
- 可以考虑添加事件创建和管理功能
- 可以考虑添加不同视图模式（日、周、月）
- 可以考虑添加日历主题自定义选项
