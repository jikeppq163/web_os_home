# My OS Home

一个模拟操作系统风格的个人数字门户，将常用工具、外部链接和个人应用聚合在统一的桌面体验中。

**在线体验**：[https://www.europlay.cn/](https://www.europlay.cn/)

## 核心特性

- **OS 桌面隐喻** — 桌面图标、Dock 栏、状态栏、小部件，还原经典桌面体验
- **应用聚合** — 内置浏览器打开外部链接，支持密码保护的应用访问
- **记事本** — 轻量笔记功能，支持 Markdown 格式
- **动态应用配置** — 后端 API 管理桌面应用，无需重新构建前端
- **安全防护** — Token 认证 + IP 白名单 + 防爆破机制（5 次错误临时封禁 30 分钟，累计 3 次封禁永久拉黑）
- **数据持久化** — SQLite 存储安全数据，重启不丢失

## 项目结构

```
my-os-home/
├── components/           # 组件目录
│   ├── AppIcon/          # 应用图标组件
│   ├── Background/       # 背景组件
│   ├── Desktop/          # 桌面组件
│   ├── Dock/             # Dock栏组件
│   ├── NoteApp/          # 记事本应用组件
│   ├── PasswordModal/    # 密码模态框组件
│   ├── ProxyBrowser/     # 内置浏览器组件
│   ├── Settings/         # 设置应用组件
│   ├── StatusBar/        # 状态栏组件
│   └── Widgets/          # 小部件组件
│       ├── CalendarWidget/  # 日历小部件
│       ├── ClockWidget/     # 时钟小部件
│       └── WeatherWidget/   # 天气小部件
├── src/                  # 源代码目录
│   └── index.css         # 全局样式
├── backend/              # 后端目录
│   ├── app/              # 后端应用
│   │   ├── models/       # 数据模型
│   │   ├── routes/       # 路由
│   │   └── services/     # 业务逻辑
│   ├── config/           # 配置文件
│   ├── .env              # 环境变量
│   ├── app.py            # 后端主应用
│   ├── requirements.txt  # 后端依赖
│   └── run.py            # 后端启动文件
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
- **前端**：Node.js (v18+), npm 或 pnpm
- **后端**：Python 3.7+, pip

### 安装和运行

#### 前端
1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd my-os-home
   ```

2. **安装前端依赖**
   ```bash
   npm install
   # 或
   pnpm install
   ```

3. **启动前端开发服务器**
   ```bash
   npm run dev
   # 或
   pnpm run dev
   ```

4. **构建前端生产版本**
   ```bash
   npm run build
   # 或
   pnpm run build
   ```

5. **预览前端生产构建**
   ```bash
   npm run preview
   # 或
   pnpm run preview
   ```

#### 后端
1. **进入后端目录**
   ```bash
   cd backend
   ```

2. **安装后端依赖**
   ```bash
   pip install -r requirements.txt
   ```

3. **启动后端服务器**
   ```bash
   python run.py
   ```

   后端服务器默认运行在 `http://localhost:5100`。

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

### 前端
| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19.2.4 | 前端框架 |
| TypeScript | ~5.8.2 | 类型系统 |
| Tailwind CSS | ^4.1.18 | CSS框架 |
| Vite | ^6.2.0 | 构建工具 |
| Lucide React | ^0.563.0 | 图标库 |
| date-fns | ^4.1.0 | 日期处理 |

### 后端
| 技术 | 用途 |
|------|------|
| Python | 后端编程语言 |
| Flask | Web框架 |
| Flask-CORS | 处理跨域请求 |
| python-dotenv | 加载环境变量 |

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