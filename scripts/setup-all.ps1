# =====================================================================
# WENGIS 一键全流程：建库入库 -> GeoServer 发布（只需输入一次密码）
# 用法：powershell -ExecutionPolicy Bypass -File scripts\setup-all.ps1
# 完成后写 logs/setup-all-result.json 供核验
# =====================================================================
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
New-Item -ItemType Directory -Force (Join-Path $root 'logs') | Out-Null
$resultPath = Join-Path $root 'logs/setup-all-result.json'

function Test-GeoServer {
  try {
    Invoke-WebRequest -Uri 'http://localhost:8080/geoserver/web/' -UseBasicParsing -TimeoutSec 5 | Out-Null
    return $true
  } catch {
    return $false
  }
}

function Wait-GeoServer {
  param([int]$MaxSeconds = 120)
  for ($i = 0; $i -lt ($MaxSeconds / 3); $i++) {
    Start-Sleep -Seconds 3
    if (Test-GeoServer) { return $true }
    Write-Host '    等待 GeoServer 启动…' -ForegroundColor Yellow
  }
  return $false
}

try {
  # 1. 读一次密码（建库与发布共用，仅存于本进程环境变量）
  $secure = Read-Host '请输入 postgres 数据库密码（建库与 GeoServer 发布共用，输入不回显）' -AsSecureString
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  $env:WENGIS_DB_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)

  # 2. 建库与数据导入
  Write-Host '========== 第一步：PostGIS 建库与数据导入 ==========' -ForegroundColor Green
  & (Join-Path $PSScriptRoot 'setup-db.ps1')

  # 3. 确保 GeoServer 在线
  Write-Host '========== 第二步：GeoServer 发布 ==========' -ForegroundColor Green
  if (-not (Test-GeoServer)) {
    Write-Host 'GeoServer 未运行，正在用 JDK21 启动…' -ForegroundColor Yellow
    $env:JAVA_HOME = 'D:\java\jdk-21'
    $env:GEOSERVER_HOME = 'D:\geoserver'
    $env:GEOSERVER_DATA_DIR = 'D:\geoserver\data_dir'
    Start-Process -FilePath 'D:\geoserver\bin\startup.bat' -WorkingDirectory 'D:\geoserver\bin' -WindowStyle Hidden
    if (-not (Wait-GeoServer)) {
      throw 'GeoServer 启动超时，请手动运行 scripts\geoserver.ps1 start 后再执行 publish-geoserver.ps1'
    }
  }

  # 4. GeoServer 发布
  & (Join-Path $PSScriptRoot 'publish-geoserver.ps1')

  $result = [ordered]@{
    ok = $true
    finishedAt = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    database = 'wengis'
    layers = @('wengis:ancient_5a', 'wengis:provinces')
    wms = 'http://localhost:8080/geoserver/wengis/wms'
    wfs = 'http://localhost:8080/geoserver/wengis/wfs'
  }
  $result | ConvertTo-Json | Set-Content -Path $resultPath -Encoding UTF8
  Write-Host ''
  Write-Host '全流程完成，结果已写入 logs/setup-all-result.json' -ForegroundColor Green
} catch {
  $err = [ordered]@{
    ok = $false
    finishedAt = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    error = $_.Exception.Message
  }
  $err | ConvertTo-Json | Set-Content -Path $resultPath -Encoding UTF8
  Write-Host "执行失败：$($_.Exception.Message)" -ForegroundColor Red
  Write-Host '可修正后重新运行本脚本（建库与发布均幂等）。' -ForegroundColor Yellow
  exit 1
}
