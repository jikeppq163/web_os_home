#!/bin/bash

# 项目根目录
PROJECT_ROOT=$(pwd)
# 后端目录
BACKEND_DIR="$PROJECT_ROOT/backend"

# 检查后端目录是否存在
if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ 后端目录不存在"
    exit 1
fi

# 检查app.py文件是否存在
if [ ! -f "$BACKEND_DIR/app.py" ]; then
    echo "❌ app.py文件不存在"
    exit 1
fi

# 进入后端目录并启动服务
echo "=== 启动后端服务 ==="
cd "$BACKEND_DIR"
python3 app.py
