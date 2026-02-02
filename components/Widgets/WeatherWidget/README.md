# WeatherWidget 组件

## 组件说明

WeatherWidget 组件是 OS 模拟应用的天气小部件，负责显示当前天气信息。

## 功能特性

- **天气信息显示**: 显示当前天气状况、温度和位置
- **响应式设计**: 适配不同屏幕尺寸
- **模拟数据**: 使用模拟数据显示天气信息

## 组件结构

```
components/Widgets/WeatherWidget/
├── index.tsx          # 组件主文件
└── README.md          # 组件说明文档
```

## 代码实现

### 核心代码

```tsx
import React from 'react';

interface WeatherWidgetProps {
  className?: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ className }) => {
  // 模拟天气数据
  const weatherData = {
    location: '北京',
    temperature: '22°C',
    condition: '晴天',
    icon: '☀️'
  };

  return (
    <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center justify-between ${className}`}>
      <div>
        <div className="text-white font-medium">{weatherData.location}</div>
        <div className="text-white text-2xl font-bold mt-1">{weatherData.temperature}</div>
        <div className="text-white/80 text-sm">{weatherData.condition}</div>
      </div>
      <div className="text-5xl">
        {weatherData.icon}
      </div>
    </div>
  );
};

export default WeatherWidget;
```

## Props 说明

| 属性名    | 类型     | 必填 | 说明                          |
| --------- | -------- | ---- | ----------------------------- |
| className | string   | 否   | 自定义 CSS 类名               |

## 使用示例

```tsx
import WeatherWidget from './components/Widgets/WeatherWidget';

const Example: React.FC = () => {
  return (
    <div>
      {/* 基本使用 */}
      <WeatherWidget />
      
      {/* 带自定义类名 */}
      <WeatherWidget className="w-full h-32" />
    </div>
  );
};
```

## 历史记录

### 2026-02-02
- 组件迁移到独立文件夹结构
- 添加详细的组件说明文档

## 后续优化

- 可以考虑添加真实天气 API 集成
- 可以考虑添加天气预报功能
- 可以考虑添加位置选择功能
- 可以考虑添加天气详情查看功能
- 可以考虑添加天气主题适配
