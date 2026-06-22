# Web OS 部署指南

本文档指导 AI 或开发者如何将本地版本部署到服务器。

---

## 架构概览

```
浏览器 → Nginx (443/HTTPS) → 静态文件 (dist/)
                            → /api/* → Flask (5100)
```

- **前端**：Nginx 直接服务 dist 静态文件（高效）
- **后端 API**：Nginx 反向代理到 Flask (端口 5100)
- **SSL**：Let's Encrypt 证书，由 Certbot 管理

---

## 服务器信息

| 项目 | 值 |
|------|-----|
| SSH 别名 | `GZ172` |
| 代码目录 | `~/my-os-home` |
| PM2 进程名 | `my-os-home` |
| 后端目录 | `~/my-os-home/backend` |
| 后端端口 | `5100` |
| 前端 dist | `/home/html/os_home/dist` |
| Nginx 配置 | `/etc/nginx/nginx.conf` |
| SSL 证书 | `/etc/letsencrypt/live/www.europlay.cn/` |
| 域名 | `www.europlay.cn` |

---

## Nginx 配置说明

服务器 Nginx 已配置 HTTPS，关键配置如下：

```nginx
server {
    listen 443 ssl;
    server_name www.europlay.cn;

    ssl_certificate /etc/letsencrypt/live/www.europlay.cn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.europlay.cn/privkey.pem;

    # 前端静态文件
    root /home/html/os_home/dist;
    index index.html;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理到 Flask
    location /api {
        proxy_pass http://127.0.0.1:5100/api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket 支持
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## 部署步骤

### 1. 本地：Git 提交并推送

```bash
# 查看当前变更
git status

# 添加变更文件（排除 __pycache__ 和 .db 文件）
git add -A -- ':!backend/**/__pycache__/*' -- ':!backend/data/*.db*'

# 提交（按需修改提交信息）
git commit -m "feat: 更新内容描述"

# 创建/切换到部署分支（按需选择: test, staging, production）
git checkout -b test 2>/dev/null || git checkout test
git merge dev --no-edit

# 推送到远程
git push origin test
```

### 2. 本地：构建前端

```bash
# 安装依赖（如有变化）
npm install

# 构建生产版本
npm run build

# 生成 dist/ 目录
ls dist/
```

### 3. 服务器：拉取代码

```bash
ssh GZ172

# 进入项目目录
cd ~/my-os-home

# 拉取最新代码
git fetch origin
git checkout test
git pull origin test
```

### 4. 服务器：检查依赖并重启后端

```bash
# 检查后端依赖是否有变化
cd ~/my-os-home/backend
cat requirements.txt

# 如有新增依赖，安装
pip3 install -r requirements.txt

# 重启后端服务
pm2 restart my-os-home
```

### 5. 上传前端 dist 到服务器

```bash
# 从本地上传 dist 到服务器（在本地执行）
scp -r dist/* GZ172:/home/html/os_home/dist/
```

### 6. 验证部署

```bash
# 检查后端服务状态
ssh GZ172 "pm2 status my-os-home"

# 查看日志
ssh GZ172 "pm2 logs my-os-home --lines 10 --nostream"

# 测试 API
curl -s https://www.europlay.cn/api/apps

# 测试前端页面
curl -I https://www.europlay.cn
```

---

## 快速部署脚本

将以下命令保存为 `deploy.sh` 一键执行：

```bash
#!/bin/bash
set -e

BRANCH=${1:-test}
echo "=== 部署到分支: $BRANCH ==="

# 本地操作
echo "[1/5] 提交本地变更..."
git add -A -- ':!backend/**/__pycache__/*' -- ':!backend/data/*.db*'
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')" || echo "无新变更"
git checkout $BRANCH 2>/dev/null || git checkout -b $BRANCH
git merge dev --no-edit
git push origin $BRANCH

echo "[2/5] 构建前端..."
npm install
npm run build

echo "[3/5] 服务器拉取代码..."
ssh GZ172 "cd ~/my-os-home && git checkout $BRANCH && git pull origin $BRANCH"

echo "[4/5] 检查依赖并重启后端..."
ssh GZ172 "cd ~/my-os-home/backend && pip3 install -r requirements.txt -q"
ssh GZ172 "pm2 restart my-os-home || (cd ~/my-os-home/backend && pm2 start app.py --name my-os-home --interpreter python3)"
ssh GZ172 "pm2 save"

echo "[5/5] 上传前端 dist..."
scp -r dist/* GZ172:/home/html/os_home/dist/

echo "=== 部署完成 ==="
echo "访问: https://www.europlay.cn"
```

使用方法：
```bash
chmod +x deploy.sh
./deploy.sh test       # 部署到 test 分支
./deploy.sh staging    # 部署到 staging 分支
./deploy.sh production # 部署到 production 分支
```

---

## 注意事项

1. **分支策略**：
   - `dev` - 开发分支
   - `test` - 测试环境
   - `master` - 生产环境

2. **排除文件**：
   - `__pycache__/` - Python 缓存
   - `*.db-shm`, `*.db-wal` - SQLite 临时文件

3. **SSL 证书续期**：
   ```bash
   # Certbot 自动续期
   ssh GZ172 "certbot renew --dry-run"
   ```

4. **Nginx 配置重载**：
   ```bash
   # 修改 nginx.conf 后重载
   ssh GZ172 "nginx -t && nginx -s reload"
   ```

5. **回滚**：
   ```bash
   # 服务器回滚代码
   ssh GZ172 "cd ~/my-os-home && git checkout HEAD~1"

   # 重启后端
   ssh GZ172 "pm2 restart my-os-home"

   # 前端需要重新上传上一版本的 dist
   ```
