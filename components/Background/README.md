# Background 组件

## 组件说明

Background 组件是 OS 模拟应用的背景管理组件，负责处理背景图片、启动动画和深色叠加层效果。

## 功能特性

- **背景图片设置**: 使用指定的壁纸 URL 作为背景
- **启动动画**: 系统启动时的淡入效果
- **深色叠加层**: 为了提高前景内容的可读性，添加黑色半透明叠加层
- **响应式设计**: 适配不同屏幕尺寸

## 组件结构

```
components/Background/
├── index.tsx          # 组件主文件
└── README.md          # 组件说明文档
```

## 代码实现

### 核心代码

```tsx
import React from 'react';
import { WALLPAPER_URL } from '../../constants';

interface BackgroundProps {
  isLoaded: boolean;
  children: React.ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ isLoaded, children }) => {
  return (
    <div 
      className={`relative w-screen h-screen bg-cover bg-center overflow-hidden transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundImage: `url(${WALLPAPER_URL})` }}
    >
      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      
      {children}
    </div>
  );
};

export default Background;
```

## Props 说明

| 属性名    | 类型          | 必填 | 说明                          |
| --------- | ------------- | ---- | ----------------------------- |
| isLoaded  | boolean       | 是   | 控制背景的加载状态，用于启动动画 |
| children  | React.ReactNode | 是   | 背景上的子组件内容            |

## 使用示例

```tsx
import Background from './components/Background';

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  return (
    <Background isLoaded={isLoaded}>
      {/* 其他组件内容 */}
    </Background>
  );
};
```

## 历史记录

### 2026-02-02
- 组件创建，提取自 App.tsx 中的背景相关代码
- 实现背景图片、启动动画和深色叠加层功能
- 添加详细的组件说明文档

## 后续优化

- 可以考虑添加背景图片自定义功能
- 可以考虑添加多种背景样式选择
- 可以考虑添加背景动画效果
