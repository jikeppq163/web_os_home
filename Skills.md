# 项目技能文件

## 1. 系统环境需求及检查

### 必要环境
- **前端**：Node.js (v18+), npm 或 pnpm
- **后端**：Python 3.7+, pip

### 环境检查方法

#### 检查 Node.js 版本
```bash
node -v
```

#### 检查 npm 版本
```bash
npm -v
```

#### 检查 pnpm 版本（可选）
```bash
pnpm -v
```

#### 检查 Python 版本
```bash
python --version
# 或
python3 --version
```

#### 检查 pip 版本
```bash
pip --version
# 或
pip3 --version
```

## 2. 启动项目进入调试模式

### 前端
#### 安装依赖
```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

#### 启动前端开发服务器
```bash
# 使用 npm
npm run dev

# 或使用 pnpm
pnpm run dev
```

前端开发服务器启动后，会在控制台显示访问地址，通常为 `http://localhost:5173`。

### 后端
#### 安装依赖
```bash
cd backend
pip install -r requirements.txt
```

#### 启动后端服务器
```bash
cd backend
python run.py
```

后端服务器默认运行在 `http://localhost:5100`。

## 3. 构建项目，常态化运行

### 前端
#### 构建生产版本
```bash
# 使用 npm
npm run build

# 或使用 pnpm
pnpm run build
```

构建完成后，生成的静态文件会位于 `dist` 目录中。

#### 预览生产构建
```bash
# 使用 npm
npm run preview

# 或使用 pnpm
pnpm run preview
```

### 后端
后端是 Python 项目，不需要构建步骤。在生产环境中，您可以使用 Gunicorn 或 uWSGI 等 WSGI 服务器来运行后端应用，以提高性能和稳定性。

#### 使用 Gunicorn 运行后端
1. **安装 Gunicorn**
   ```bash
   pip install gunicorn
   ```

2. **使用 Gunicorn 启动后端**
   ```bash
   cd backend
   gunicorn -w 4 -b 0.0.0.0:5100 app:app
   ```

## 4. 将项目配置到 Nginx

### 配置步骤

1. **确保 Nginx 已安装**
   ```bash
   # 检查 Nginx 是否已安装
   nginx -v
   ```

2. **修改 Nginx 配置文件**
   项目中已提供了 `nginx.conf` 文件，可以根据需要修改。主要配置如下：

   ```nginx
   server {
       listen 80;
       server_name example.com; # 替换为你的域名
       
       # 前端配置
       location / {
           root /path/to/my-os-home/dist; # 替换为项目构建后的 dist 目录路径
           index index.html;
           try_files $uri $uri/ /index.html;
       }
       
       # 后端 API 配置
       location /api {
           proxy_pass http://localhost:5100; # 后端服务器地址
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **重启 Nginx 服务**
   ```bash
   # 在 Ubuntu/Debian 系统上
   sudo systemctl restart nginx
   
   # 在 CentOS/RHEL 系统上
   sudo service nginx restart
   ```

4. **验证配置**
   - 打开浏览器，访问你的域名或服务器 IP 地址，应该能看到前端项目运行
   - 访问 `http://your-domain/api/apps`，应该能看到后端 API 返回的应用配置数据

### 注意事项
- 确保 Nginx 用户有访问 `dist` 目录的权限
- 如果你使用了防火墙，确保 80 端口（或你配置的其他端口）已开放
- 对于 HTTPS 配置，需要在 Nginx 中添加 SSL 证书相关配置
- 确保后端服务器正在运行，并且可以通过 `http://localhost:5100` 访问