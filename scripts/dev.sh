#!/usr/bin/env bash
# WENGIS 开发服务器启动脚本（跨平台约定入口）
# Windows 无 bash 时使用等价脚本 scripts/dev.ps1
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p logs
# 允许测试使用独立端口，启动输出统一落盘。
npm run dev -- "$@" 2>&1 | tee logs/dev.log
