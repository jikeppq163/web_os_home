# Web OS 部署指南

本文档指导 AI 或开发者如何将本地版本部署到服务器。

---

## 服务器信息

| 项目 | 值 |
|------|-----|
| SSH 别名 | `GZ172` |
| 部署目录 | `~/webos` |
| PM2 进程名 | `webos` |
| 后端目录 | `~/webos/api` |
| 前端目录 | `~/webos/web` |

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

### 2. 服务器：拉取代码

```bash
# SSH 连接服务器
ssh GZ172

# 进入项目目录
cd ~/webos

# 拉取最新代码
git fetch origin
git checkout test
git pull origin test
```

### 3. 服务器：检查依赖并构建

```bash
# 检查后端依赖是否有变化
cd ~/webos/api
cat requirements.txt

# 如有新增依赖，安装
pip install -r requirements.txt

# 检查前端是否需要构建（如果是纯前端项目）
cd ~/webos/web
# npm install  # 如有新依赖
# npm run build  # 如需构建
```

### 4. 服务器：PM2 启动/重启服务

```bash
# 检查现有 PM2 进程
pm2 list

# 如果 webos 进程已存在，重启
pm2 restart webos

# 如果是首次部署，启动服务
cd ~/webos/api
pm2 start app.py --name webos --interpreter python3

# 保存 PM2 配置
pm2 save
```

### 5. 验证部署

```bash
# 检查服务状态
pm2 status webos

# 查看日志确认启动成功
pm2 logs webos --lines 20

# 测试 API 是否响应
curl -I http://localhost:PORT/api/apps
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
echo "[1/4] 提交本地变更..."
git add -A -- ':!backend/**/__pycache__/*' -- ':!backend/data/*.db*'
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')" || echo "无新变更"
git checkout $BRANCH 2>/dev/null || git checkout -b $BRANCH
git merge dev --no-edit
git push origin $BRANCH

# 服务器操作
echo "[2/4] 服务器拉取代码..."
ssh GZ172 "cd ~/webos && git checkout $BRANCH && git pull origin $BRANCH"

echo "[3/4] 检查依赖..."
ssh GZ172 "cd ~/webos/api && pip install -r requirements.txt -q"

echo "[4/4] 重启服务..."
ssh GZ172 "pm2 restart webos || (cd ~/webos/api && pm2 start app.py --name webos --interpreter python3)"
ssh GZ172 "pm2 save"

echo "=== 部署完成 ==="
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

3. **回滚**：
   ```bash
   # 服务器回滚到上一版本
   ssh GZ172 "cd ~/webos && git checkout HEAD~1 && pm2 restart webos"
   ```
