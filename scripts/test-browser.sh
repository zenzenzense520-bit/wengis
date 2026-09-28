#!/usr/bin/env bash
# 新增 Windows Edge 交互测试，服务启停由测试脚本管理。
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p logs
node scripts/tests/browser.mjs 2>&1 | tee logs/test-browser.log
