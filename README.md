# 模拟OS风格的个人主页

一个精心设计的模拟操作系统风格的个人主页，融合了现代Web技术与经典OS界面元素，为用户提供直观、美观且功能丰富的个人数字空间。

## 项目特色

### 🎨 视觉设计
- **现代化OS风格界面**：模仿经典操作系统的视觉元素，包括桌面、dock栏、状态栏等
- **动态背景效果**：带有加载动画的渐变背景
- **响应式设计**：适配不同屏幕尺寸
- **精美的应用图标**：每个应用都有独特的图标和颜色主题

### 🚀 核心功能
- **应用启动器**：通过桌面图标和dock栏快速访问常用应用
- **内置浏览器**：支持在应用内打开特定网页，提供更流畅的用户体验
- **安全认证**：部分应用支持密码保护，保护敏感信息
- **状态管理**：顶部状态栏显示系统状态和小部件
- **桌面小部件**：包括日历、时钟和天气等实用小部件

### 🔧 技术实现
- **React 19**：使用最新的React版本构建组件化界面
- **TypeScript**：提供类型安全，提高代码质量
- **Tailwind CSS**：实现快速、响应式的样式设计
- **Vite**：现代化的构建工具，提供快速的开发体验
- **Lucide React**：使用简洁美观的图标库

## 项目结构

```
my-os-home/
├── components/           # 组件目录
│   ├── AppIcon/          # 应用图标组件
│   ├── Background/       # 背景组件
│   ├── Desktop/          # 桌面组件
│   ├── Dock/             # Dock栏组件
│   ├── PasswordModal/    # 密码模态框组件
│   ├── ProxyBrowser/     # 内置浏览器组件
│   ├── StatusBar/        # 状态栏组件
│   └── Widgets/          # 小部件组件
│       ├── CalendarWidget/  # 日历小部件
│       ├── ClockWidget/     # 时钟小部件
│       └── WeatherWidget/   # 天气小部件
├── src/                  # 源代码目录
│   └── index.css         # 全局样式
├── App.tsx               # 应用主组件
├── constants.tsx         # 应用配置常量
├── types.ts              # TypeScript类型定义
├── package.json          # 项目配置和依赖
└── vite.config.ts        # Vite配置
```

## 已配置应用

### 常用应用
- **贷款规划器**：个人财务规划工具
- **GitHub**：代码托管平台（支持密码保护）
- **Safari**：网络浏览器
- **Mail**：邮件客户端
- **Photos**：图片浏览（链接到Unsplash）
- **音乐**：在线音乐播放器（链接到网易云音乐）
- **Settings**：系统设置
- **Blog**：个人博客

## 快速开始

### 前提条件
- Node.js (v18+)
- npm 或 pnpm

### 安装和运行

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd my-os-home
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   pnpm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   pnpm run dev
   ```

4. **构建生产版本**
   ```bash
   npm run build
   # 或
   pnpm run build
   ```

5. **预览生产构建**
   ```bash
   npm run preview
   # 或
   pnpm run preview
   ```

## 自定义配置

### 添加新应用

要添加新应用，只需在 `constants.tsx` 文件中的 `APPS` 数组中添加新的应用配置对象：

```typescript
{
  id: 'app-id',           // 应用唯一标识符
  name: '应用名称',        // 应用显示名称
  url: 'https://example.com', // 应用链接
  icon: <IconComponent color="white" size={32} />, // 应用图标
  color: 'from-blue-400 to-blue-600', // 应用颜色主题
  isDock: true,           // 是否显示在Dock栏
  useVPN: false,          // 是否使用内置浏览器打开
  requiresPassword: false // 是否需要密码认证
}
```

### 自定义背景

背景配置位于 `components/Background` 组件中，您可以根据需要修改渐变效果或添加自定义背景图片。

### 调整小部件

小部件配置位于 `components/Widgets` 目录下，您可以根据需要修改或添加新的小部件。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.2.4 | 前端框架 |
| TypeScript | ~5.8.2 | 类型系统 |
| Tailwind CSS | ^4.1.18 | CSS框架 |
| Vite | ^6.2.0 | 构建工具 |
| Lucide React | ^0.563.0 | 图标库 |
| date-fns | ^4.1.0 | 日期处理 |

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 致谢

- 感谢 React 团队提供优秀的前端框架
- 感谢 Tailwind CSS 团队提供便捷的样式解决方案
- 感谢 Lucide 团队提供精美的图标库
- 感谢所有为这个项目做出贡献的开发者

---

**享受您的个人OS风格主页！** 🎉