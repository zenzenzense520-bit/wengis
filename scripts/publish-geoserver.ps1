# =====================================================================
# WENGIS GeoServer 一键发布：工作区 -> PostGIS Store -> 图层 -> SLD 样式
# 前置：GeoServer 已启动、setup-db.ps1 已完成建库与数据导入
# 用法：powershell -ExecutionPolicy Bypass -File scripts\publish-geoserver.ps1
# =====================================================================
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$gsUrl = 'http://localhost:8080/geoserver'
$ws = 'wengis'
$admin = 'admin'
$adminPwd = 'geoserver'
$auth = "Basic $([Convert]::ToBase64String([Text.Encoding]::GetEncoding('ISO-8859-1').GetBytes("$admin`:$adminPwd")))"
$baseHeaders = @{ Authorization = $auth; Accept = 'application/json' }

Write-Host '==> [1/7] 检查 GeoServer 服务' -ForegroundColor Cyan
try {
  Invoke-RestMethod -Uri "$gsUrl/rest/about/version.json" -Headers $baseHeaders -TimeoutSec 10 | Out-Null
} catch {
  throw "无法连接 GeoServer（$gsUrl）。请先运行 scripts\geoserver.ps1 start。"
}

Write-Host '==> [2/7] 读取并验证 postgres 数据库密码' -ForegroundColor Cyan
$psqlClient = if (Test-Path 'E:\postgis\bin\psql.exe') { 'E:\postgis\bin\psql.exe' } else { 'psql' }
# 用 psql 实测密码：返回是否连接成功（EAP 临时放宽，避免 stderr 误判）
function Test-DbPwd {
  param([string]$Pwd)
  $prevEap = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    $env:PGPASSWORD = $Pwd
    & $psqlClient -U postgres -h localhost -d wengis -tAc 'SELECT 1' 2>&1 | Out-Null
    return ($LASTEXITCODE -eq 0)
  } finally {
    $ErrorActionPreference = $prevEap
    $env:PGPASSWORD = ''
  }
}
if ($env:WENGIS_DB_PASSWORD -and (Test-DbPwd $env:WENGIS_DB_PASSWORD)) {
  $dbPwd = $env:WENGIS_DB_PASSWORD
  Write-Host '    环境变量密码验证通过' -ForegroundColor Green
} else {
  do {
    $secure = Read-Host '请输入 postgres 数据库密码' -AsSecureString
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    $dbPwd = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    if (Test-DbPwd $dbPwd) { break }
    Write-Host '    密码错误或无法连接，请重新输入' -ForegroundColor Red
  } while ($true)
}
$env:PGPASSWORD = ''

# 读取错误响应体文本
function Get-ErrorDetail {
  param($Exception)
  $resp = $Exception.Response
  if (-not $resp) { return $Exception.Message }
  try {
    $stream = $resp.GetResponseStream()
    $reader = New-Object IO.StreamReader($stream)
    return "$([int]$resp.StatusCode) $($reader.ReadToEnd())"
  } catch {
    return $Exception.Message
  }
}

# 发起 REST 请求；失败抛出含响应体的错误
function Invoke-Gs {
  param([string]$Method, [string]$Path, [object]$Body, [string]$ContentType = 'application/json')
  $h = $baseHeaders.Clone()
  if ($PSBoundParameters.ContainsKey('Body')) { $h['Content-Type'] = $ContentType }
  try {
    if ($PSBoundParameters.ContainsKey('Body')) {
      return Invoke-RestMethod -Uri "$gsUrl$Path" -Method $Method -Headers $h -Body $Body -TimeoutSec 40
    }
    return Invoke-RestMethod -Uri "$gsUrl$Path" -Method $Method -Headers $h -TimeoutSec 40
  } catch {
    throw "GeoServer REST $Method $Path 失败：$(Get-ErrorDetail $_.Exception)"
  }
}

# 资源是否存在（GET 200 为真，404 为假，其余错误抛出）
function Test-Gs {
  param([string]$Path)
  try {
    Invoke-RestMethod -Uri "$gsUrl$Path" -Headers $baseHeaders -TimeoutSec 20 | Out-Null
    return $true
  } catch {
    $code = $_.Exception.Response
    if ($code -and [int]$code.StatusCode -eq 404) { return $false }
    throw "GeoServer REST GET $Path 失败：$(Get-ErrorDetail $_.Exception)"
  }
}

# 3. 工作区（幂等）
Write-Host '==> [3/7] 创建工作区 wengis' -ForegroundColor Cyan
if (Test-Gs "/rest/workspaces/$ws.json") {
  Write-Host '    工作区已存在' -ForegroundColor Yellow
} else {
  # 仅传 name：GeoServer 2.28 安全 XStream 禁止 JSON 直接反序列化 java.net.URI
  $wsBody = @{ workspace = @{ name = $ws } } | ConvertTo-Json -Depth 5
  Invoke-Gs -Method 'POST' -Path '/rest/workspaces' -Body $wsBody | Out-Null
}

# 4. PostGIS 数据仓库（PUT 幂等创建/更新）
Write-Host '==> [4/7] 配置 PostGIS 数据仓库' -ForegroundColor Cyan
$storeBody = @{
  dataStore = @{
    name = $ws
    type = 'PostGIS'
    enabled = $true
    connectionParameters = @{
      entry = @(
        @{ '@key' = 'host'; '$' = 'localhost' },
        @{ '@key' = 'port'; '$' = '5432' },
        @{ '@key' = 'database'; '$' = 'wengis' },
        @{ '@key' = 'schema'; '$' = 'wengis' },
        @{ '@key' = 'user'; '$' = 'postgres' },
        @{ '@key' = 'passwd'; '$' = $dbPwd },
        @{ '@key' = 'dbtype'; '$' = 'postgis' },
        @{ '@key' = 'Expose primary keys'; '$' = 'true' }
      )
    }
  }
} | ConvertTo-Json -Depth 8
# 不存在用 POST 创建，已存在用 PUT 更新（GeoServer 2.28 对不存在的 datastore PUT 返回 404）
$storePath = "/rest/workspaces/$ws/datastores/$ws.json"
if (Test-Gs $storePath) {
  Invoke-Gs -Method 'PUT' -Path $storePath -Body $storeBody | Out-Null
} else {
  Invoke-Gs -Method 'POST' -Path "/rest/workspaces/$ws/datastores" -Body $storeBody | Out-Null
  Write-Host '    PostGIS 数据仓库已创建' -ForegroundColor Green
}

# 5. 发布图层（已存在则跳过，避免重复发布报错）
Write-Host '==> [5/7] 发布图层 ancient_5a / provinces' -ForegroundColor Cyan
foreach ($layer in @('ancient_5a', 'provinces')) {
  $ftPath = "/rest/workspaces/$ws/datastores/$ws/featuretypes/$layer.json"
  if (Test-Gs $ftPath) {
    Write-Host "    图层 $layer 已存在，跳过" -ForegroundColor Yellow
  } else {
    $ftBody = @{ featureType = @{ name = $layer; nativeName = $layer; srs = 'EPSG:4326'; enabled = $true } } | ConvertTo-Json -Depth 5
    Invoke-Gs -Method 'POST' -Path "/rest/workspaces/$ws/datastores/$ws/featuretypes" -Body $ftBody | Out-Null
    Write-Host "    图层 $layer 已发布" -ForegroundColor Green
  }
}

# 6. 上传 SLD 样式（幂等）
Write-Host '==> [6/7] 上传 SLD 样式' -ForegroundColor Cyan
function Publish-Style {
  param([string]$Name, [string]$SldPath)
  $sld = [IO.File]::ReadAllText($SldPath, [Text.Encoding]::UTF8)
  $bytes = [Text.Encoding]::UTF8.GetBytes($sld)
  $sldType = 'application/vnd.ogc.sld+xml; charset=utf-8'
  if (Test-Gs "/rest/workspaces/$ws/styles/$Name.json") {
    # 已存在：PUT 更新 SLD 内容
    Invoke-Gs -Method 'PUT' -Path "/rest/workspaces/$ws/styles/$Name" -Body $bytes -ContentType $sldType | Out-Null
  } else {
    # 不存在：POST 一步创建并上传 SLD（name 通过 query 参数，避免 JSON 元数据方式 500）
    Invoke-Gs -Method 'POST' -Path "/rest/workspaces/$ws/styles?name=$Name" -Body $bytes -ContentType $sldType | Out-Null
  }
  Write-Host "    样式 $Name 已上传" -ForegroundColor Green
}
Publish-Style -Name 'ancient_5a_category' -SldPath (Join-Path $root 'sld\ancient_5a_category.sld')
Publish-Style -Name 'provinces' -SldPath (Join-Path $root 'sld\provinces.sld')

# 7. 绑定默认样式
Write-Host '==> [7/7] 绑定图层默认样式' -ForegroundColor Cyan
$bindSpot = @{ layer = @{ defaultStyle = @{ name = "$ws:ancient_5a_category"; workspace = $ws } } } | ConvertTo-Json -Depth 5
Invoke-Gs -Method 'PUT' -Path "/rest/layers/$ws`:ancient_5a" -Body $bindSpot | Out-Null
$bindProv = @{ layer = @{ defaultStyle = @{ name = "$ws:provinces"; workspace = $ws } } } | ConvertTo-Json -Depth 5
Invoke-Gs -Method 'PUT' -Path "/rest/layers/$ws`:provinces" -Body $bindProv | Out-Null

Write-Host ''
Write-Host '发布完成。验证地址：' -ForegroundColor Green
Write-Host "  WMS Capabilities: $gsUrl/$ws/wms?service=WMS&request=GetCapabilities"
Write-Host "  WFS 点数据:       $gsUrl/$ws/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=$ws:ancient_5a&count=1&outputFormat=application/json"
