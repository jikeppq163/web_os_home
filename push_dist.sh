#!/bin/bash

# 项目根目录
PROJECT_ROOT=$(pwd)
# 构建输出目录
BUILD_DIR="$PROJECT_ROOT/dist"
# 服务器信息
SERVER="GZ172"
SERVER_DIR="/home/html/os_home/dist"
# JP246服务器信息
JP_SERVER="JP246"
JP_SERVER_DIR="/home/os"

# 默认行为：保存并推送到服务器
ACTION="push"
# 默认服务器：GZ172
TARGET_SERVER="default"

# 解析命令行参数
while getopts "hspj" opt; do
    case $opt in
        h)
            echo "用法: $0 [-h] [-s] [-p] [-j] [提交信息]"
            echo "  -h: 显示此帮助信息"
            echo "  -s: 仅保存到git"
            echo "  -p: 保存并推送到默认服务器（GZ172）"
            echo "  -j: 保存并推送到JP246服务器"
            echo "  [提交信息]: 可选，Git提交时使用的自定义信息"
            exit 0
            ;;
        s)
            ACTION="save"
            ;;
        p)
            ACTION="push"
            TARGET_SERVER="default"
            ;;
        j)
            ACTION="push"
            TARGET_SERVER="jp"
            ;;
        *)
            echo "用法: $0 [-h] [-s] [-p] [-j] [提交信息]"
            echo "  -h: 显示此帮助信息"
            echo "  -s: 仅保存到git"
            echo "  -p: 保存并推送到默认服务器（GZ172）"
            echo "  -j: 保存并推送到JP246服务器"
            echo "  [提交信息]: 可选，Git提交时使用的自定义信息"
            exit 1
            ;;
    esac
done

# 获取提交信息（如果提供）
shift $((OPTIND - 1))
COMMIT_MESSAGE="feat: 更新构建产物"
if [ $# -gt 0 ]; then
    COMMIT_MESSAGE="$@"
fi

# Git保存函数
git_save() {
    echo "=== 开始保存到Git ==="
    
    # 检查Git状态
    if ! git status > /dev/null 2>&1; then
        echo "❌ 当前目录不是Git仓库"
        exit 1
    fi
    
    # 添加所有更改
    git add .
    
    # 检查是否有更改
    if git diff --cached --quiet; then
        echo "✅ 没有更改需要提交"
        return 0
    fi
    
    # 提交更改
    git commit -m "$COMMIT_MESSAGE"
    
    # 检查提交是否成功
    if [ $? -ne 0 ]; then
        echo "❌ Git提交失败"
        exit 1
    fi
    
    echo "✅ Git保存成功"
}

# 构建函数
build_project() {
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
}

# 推送函数
push_to_server() {
    echo "=== 开始推送构建产物到服务器 ==="
    
    # 根据目标服务器选择不同的服务器信息
    if [ "$TARGET_SERVER" = "jp" ]; then
        CURRENT_SERVER="$JP_SERVER"
        CURRENT_SERVER_DIR="$JP_SERVER_DIR"
    else
        CURRENT_SERVER="$SERVER"
        CURRENT_SERVER_DIR="$SERVER_DIR"
    fi
    
    # 使用 rsync 推送构建产物到服务器
    # -avz: 归档模式，压缩传输
    # --delete: 删除目标目录中不存在的文件
    # --exclude: 排除不需要传输的文件
    rsync -avz --delete "$BUILD_DIR/" "$CURRENT_SERVER:$CURRENT_SERVER_DIR/"
    
    # 检查推送是否成功
    if [ $? -ne 0 ]; then
        echo "❌ 推送失败，请检查服务器连接和权限"
        exit 1
    fi
    
    echo "✅ 推送成功！构建产物已推送到 $CURRENT_SERVER:$CURRENT_SERVER_DIR"
}

# 执行操作
case $ACTION in
    save)
        git_save
        ;;
    push)
        git_save
        build_project
        push_to_server
        ;;
esac

echo "=== 操作完成 ==="
