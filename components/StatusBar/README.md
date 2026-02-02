# StatusBar 组件

## 组件说明

StatusBar 组件是 OS 模拟应用的状态栏组件，负责显示系统状态信息，包括日期、时间和系统图标。

## 功能特性

- **日期显示**: 显示当前星期、月份和日期
- **时间显示**: 实时显示当前时间，精确到秒
- **系统图标**: 显示信号、Wi-Fi 和电池状态图标
- **响应式设计**: 适配不同屏幕尺寸
- **固定定位**: 始终固定在屏幕顶部

## 组件结构

```
components/StatusBar/
├── index.tsx          # 组件主文件
└── README.md          # 组件说明文档
```

## 代码实现

### 核心代码

```tsx
import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';
import { format } from 'date-fns';

const StatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-8 px-4 md:px-6 flex justify-between items-center text-white text-sm font-medium z-50 select-none backdrop-blur-sm bg-black/10 fixed top-0 left-0 right-0">
      <div className="flex items-center gap-4">
        <span>{format(time, 'EEE MMM d')}</span>
        <span>{format(time, 'h:mm a')}</span>
      </div>
      <div className="flex items-center gap-3">
        <Signal size={16} />
        <Wifi size={16} />
        <Battery size={20} />
      </div>
    </div>
  );
};

export default StatusBar;
```

## 依赖说明

| 依赖项       | 版本   | 用途                  |
| ------------ | ------ | --------------------- |
| lucide-react | ^latest | 提供系统图标           |
| date-fns     | ^latest | 日期和时间格式化       |

## 组件使用

```tsx
import StatusBar from './components/StatusBar';

const App: React.FC = () => {
  return (
    <div>
      <StatusBar />
      {/* 其他组件内容 */}
    </div>
  );
};
```

## 历史记录

### 2026-02-02
- 组件迁移到独立文件夹结构
- 添加详细的组件说明文档
- 日期显示改为中文格式，使用"yyyy年MM月dd日 EEEE"格式

## 后续优化

- 可以考虑添加更多系统状态图标，如蓝牙、定位等
- 可以考虑添加状态栏通知功能
- 可以考虑添加状态栏自定义选项
- 可以考虑添加状态栏主题适配
