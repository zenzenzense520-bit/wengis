#!/usr/bin/env bash
# 按已有锁文件安装依赖，记录输出；不新增软件包。
set -euo pipefail
cd "$(dirname "$0")/../.."
mkdir -p logs
npm ci --registry=https://registry.npmjs.org 2>&1 | tee logs/setup.log
