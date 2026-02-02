#!/bin/bash

# 项目根目录
PROJECT_ROOT=$(pwd)
# 构建输出目录
BUILD_DIR="$PROJECT_ROOT/dist"
# 服务器信息
SERVER="GZ172"
SERVER_DIR="/home/html/os_home/dist"

echo "=== 开始构建项目 ==="
# 运行构建命令
npm run build

# 检查构建是否成功
if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

# 检查构建目录是否存在
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ 构建目录不存在，构建可能失败"
    exit 1
fi

# 检查构建目录是否有文件
if [ -z "$(ls -A "$BUILD_DIR")" ]; then
    echo "❌ 构建目录为空，构建可能失败"
    exit 1
fi

echo "✅ 构建成功，构建产物如下："
ls -la "$BUILD_DIR"

echo "=== 开始推送构建产物到服务器 ==="
# 使用 rsync 推送构建产物到服务器
# -avz: 归档模式，压缩传输
# --delete: 删除目标目录中不存在的文件
# --exclude: 排除不需要传输的文件
rsync -avz --delete "$BUILD_DIR/" "$SERVER:$SERVER_DIR/"

# 检查推送是否成功
if [ $? -ne 0 ]; then
    echo "❌ 推送失败，请检查服务器连接和权限"
    exit 1
fi

echo "✅ 推送成功！构建产物已推送到 $SERVER:$SERVER_DIR"
echo "=== 操作完成 ==="
