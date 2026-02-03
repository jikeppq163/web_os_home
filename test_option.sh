#!/bin/bash

# 测试脚本，验证选项解析

# 默认服务器：GZ172
TARGET_SERVER="default"

# 解析命令行参数
while getopts "hspj" opt; do
    case $opt in
        h)
            echo "测试帮助信息"
            exit 0
            ;;
        s)
            echo "ACTION=save"
            ;;
        p)
            echo "ACTION=push"
            TARGET_SERVER="default"
            ;;
        j)
            echo "ACTION=push"
            TARGET_SERVER="jp"
            ;;
        *)
            echo "测试默认选项"
            exit 1
            ;;
    esac
done

echo "TARGET_SERVER=$TARGET_SERVER"
