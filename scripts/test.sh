#!/usr/bin/env bash
# 新增可复现验证入口，保存测试和构建输出。
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p logs
node --experimental-strip-types scripts/tests/logic.mjs 2>&1 | tee logs/test.log
bash scripts/build.sh 2>&1 | tee -a logs/test.log
