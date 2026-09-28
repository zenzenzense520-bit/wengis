#!/usr/bin/env bash
# WENGIS 数据校验 + 生产构建脚本（跨平台约定入口）
# Windows 无 bash 时使用等价脚本 scripts/build.ps1
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p logs
# 构建过程统一保存到日志。
npm run validate-data 2>&1 | tee logs/build.log
npm run build 2>&1 | tee -a logs/build.log
