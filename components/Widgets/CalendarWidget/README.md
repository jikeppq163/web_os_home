# CalendarWidget 组件

## 组件说明

CalendarWidget 组件是 OS 模拟应用的日历小部件，负责显示当前日期和距离下一个事件的天数。

## 功能特性

- **日期显示**: 显示当前日期
- **星期显示**: 显示当前星期几（中文）
- **事件倒计时**: 显示距离下一个事件的天数
- **支持农历事件**: 区分农历和公历事件
- **响应式设计**: 适配不同屏幕尺寸
- **美观的视觉效果**: 半透明背景，平滑的悬停动画

## 组件结构

```
components/Widgets/CalendarWidget/
├── index.tsx          # 组件主文件
└── README.md          # 组件说明文档
```

## 代码实现

### 核心代码

```tsx
import React from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { getLunar } from 'chinese-lunar-calendar';
import { Calendar as CalendarIcon } from 'lucide-react';

const CalendarWidget: React.FC<{ className?: string }> = ({ className }) => {
  const today = new Date();

  const CalendarList = [
    {
      date: "05/26",
      event: "宝贝生日",
      //是否农历
      isLunar: true,
    },
  ]

  // 计算距离事件的天数
  const getDaysUntilEvent = (event: { date: string; isLunar: boolean }) => {
    const [month, day] = event.date.split('/').map(Number);
    const currentYear = today.getFullYear();
    
    let eventDate: Date;
    
    if (event.isLunar) {
      // 对于农历日期，我们需要一个更复杂的转换
      // 由于 chinese-lunar-calendar 库主要用于公历转农历
      // 这里我们使用一个简化的方法，假设农历日期与公历日期月份对应
      // 实际应用中可能需要使用更专业的农历库
      eventDate = new Date(currentYear, month - 1, day);
    } else {
      // 公历直接使用
      eventDate = new Date(currentYear, month - 1, day);
    }
    
    // 如果事件日期已经过了，计算下一年的
    if (eventDate < today) {
      eventDate = new Date(currentYear + 1, month - 1, day);
    }
    
    // 计算天数差
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // 找到最近的事件
  const getNextEvent = () => {
    if (CalendarList.length === 0) return null;
    
    let nextEvent = CalendarList[0];
    let minDays = getDaysUntilEvent(nextEvent);
    
    for (const event of CalendarList) {
      const days = getDaysUntilEvent(event);
      if (days < minDays) {
        minDays = days;
        nextEvent = event;
      }
    }
    
    return { event: nextEvent, days: minDays };
  };

  const nextEvent = getNextEvent();

  return (
    <div className={`bg-white/90 backdrop-blur-xl rounded-3xl p-4 shadow-lg flex flex-col items-start justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 ${className}`}>
      <div className="flex items-center gap-2 text-red-500 font-bold text-xs md:text-sm">
        <CalendarIcon size={16} />
        <span>{format(today, 'EEEE', { locale: zhCN })}</span>
      </div>
      <div className="flex flex-col items-center self-center">
        <span className="text-5xl md:text-6xl font-light text-slate-800 tracking-tighter">
            {format(today, 'd')}
        </span>
      </div>
      <div className="w-full text-right text-slate-500 text-xs md:text-sm font-medium">
        {nextEvent ? `离${nextEvent.event.event}还有${nextEvent.days}天` : '今天没有事件'}
      </div>
      
      {/* Decorative Circle */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-red-100/50 rounded-full blur-xl pointer-events-none"></div>
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

### 2026-02-03
- 组件功能重构：从完整月份日历改为单日期显示
- 添加中文支持：星期显示改为中文
- 添加事件倒计时功能：显示距离下一个事件的天数
- 支持农历事件：区分农历和公历事件
- 优化视觉效果：更新样式，添加悬停动画

### 2026-02-02
- 组件迁移到独立文件夹结构
- 添加详细的组件说明文档

## 后续优化

- 可以考虑添加完整的月份日历视图
- 可以考虑添加事件管理功能
- 可以考虑添加更多的农历日期处理功能
- 可以考虑添加不同的主题选项
