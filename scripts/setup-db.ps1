# =====================================================================
# WENGIS 一键建库脚本：建库 -> PostGIS 扩展 -> 建表 -> 导入点与省界 -> 验证
# 用法：在项目根目录执行  powershell -ExecutionPolicy Bypass -File scripts\setup-db.ps1
# 密码仅在本脚本进程内通过 PGPASSWORD 传递，不会写入磁盘
# =====================================================================
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# 定位 psql（优先 PostGIS 免安装目录，其次 PATH）
$psql = 'E:\postgis\bin\psql.exe'
if (-not (Test-Path $psql)) { $psql = 'psql' }
$dbHost = 'localhost'
$dbUser = 'postgres'
$dbName = 'wengis'

Write-Host '==> [1/6] 读取 postgres 密码（输入不回显）' -ForegroundColor Cyan
if ($env:WENGIS_DB_PASSWORD) {
  $env:PGPASSWORD = $env:WENGIS_DB_PASSWORD
} else {
  $secure = Read-Host '请输入 postgres 数据库密码' -AsSecureString
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  $env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
}
# SQL 文件均为 UTF-8，强制 psql 按 UTF-8 解析；抑制 NOTICE（PostgreSQL 提示走 stderr，避免干扰）
$env:PGCLIENTENCODING = 'UTF8'
$env:PGOPTIONS = '-c client_min_messages=warning'

# 统一封装 psql：临时放宽 EAP，避免 psql 的 stderr 提示被 Stop 策略误判为终止错误
function Exec-Psql {
  param([string]$Database, [string[]]$Arguments)
  $prevEap = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    $output = & $psql -U $dbUser -h $dbHost -d $Database @Arguments 2>&1
    $code = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $prevEap
  }
  return [pscustomobject]@{ Code = $code; Text = ($output | Out-String) }
}

# 连接自检：提前暴露密码错误/服务不可达
$connect = Exec-Psql -Database 'postgres' -Arguments @('-tAc', 'SELECT 1')
if ($connect.Code -ne 0) {
  throw "无法连接 PostgreSQL（$dbUser@$dbHost:5432）。请检查密码与服务。psql 输出：$($connect.Text)"
}

# 1. 建库（幂等：已存在则跳过）
Write-Host '==> [2/6] 检查并创建数据库 wengis' -ForegroundColor Cyan
$exists = (Exec-Psql -Database 'postgres' -Arguments @('-tAc', "SELECT 1 FROM pg_database WHERE datname='$dbName'")).Text.Trim()
if ($exists -ne '1') {
  $created = Exec-Psql -Database 'postgres' -Arguments @('-v', 'ON_ERROR_STOP=1', '-f', 'sql/01_create_db.sql')
  if ($created.Code -ne 0) { throw "建库失败，psql 输出：$($created.Text)" }
} else {
  Write-Host '    数据库已存在，跳过建库' -ForegroundColor Yellow
}

# 2. 扩展 + 表结构
function Run-File {
  param([string]$File, [string]$Label)
  Write-Host "==> $Label" -ForegroundColor Cyan
  $r = Exec-Psql -Database $dbName -Arguments @('-v', 'ON_ERROR_STOP=1', '-f', $File)
  if ($r.Code -ne 0) { throw "执行失败：$File`npsql 输出：$($r.Text)" }
}

Run-File -File 'sql/02_create_schema.sql' -Label '[3/6] 创建 PostGIS 扩展、表、索引、视图'

# 3. 重新生成入库 SQL（确保为最新数据）
Write-Host '==> [4/6] 生成点与省界入库 SQL' -ForegroundColor Cyan
node scripts/geojson2sql.mjs
if ($LASTEXITCODE -ne 0) { throw '点数据 SQL 生成失败' }
node scripts/provinces2sql.mjs
if ($LASTEXITCODE -ne 0) { throw '省界 SQL 生成失败' }

# 4. 导入点与省界
Run-File -File 'sql/04_insert_ancient_5a.generated.sql' -Label '[5/6] 导入 148 处景区点'
Run-File -File 'sql/05_insert_provinces.generated.sql' -Label '        导入 35 个省级面要素'

# 5. 验证（输出统计结果）
Write-Host '==> [6/6] 验证' -ForegroundColor Cyan
$verify = Exec-Psql -Database $dbName -Arguments @('-f', 'sql/03_verify.sql')
Write-Host $verify.Text

Write-Host '建库与数据导入完成。' -ForegroundColor Green
