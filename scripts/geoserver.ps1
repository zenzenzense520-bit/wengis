# GeoServer lifecycle launcher (pinned to JDK 21, does not touch system Java 25)
# Usage:
#   .\scripts\geoserver.ps1 start     # start in foreground (this window)
#   .\scripts\geoserver.ps1 stop      # graceful shutdown via shutdown.bat
#   .\scripts\geoserver.ps1 url       # print web UI URL
param(
  [ValidateSet('start', 'stop', 'url')]
  [string]$Action = 'start'
)

$jdk = 'D:\java\jdk-21'
$gs  = 'D:\geoserver'
$port = 8080

if (-not (Test-Path "$jdk\bin\java.exe")) {
  Write-Error "JDK 21 not found at $jdk"
  exit 1
}
if (-not (Test-Path "$gs\start.jar")) {
  Write-Error "GeoServer not found at $gs"
  exit 1
}

$env:JAVA_HOME = $jdk
$env:GEOSERVER_HOME = $gs
$env:GEOSERVER_DATA_DIR = "$gs\data_dir"
$env:Path = "$jdk\bin;$env:Path"

switch ($Action) {
  'start' {
    Write-Output "[GeoServer] JAVA_HOME=$jdk"
    Write-Output "[GeoServer] GEOSERVER_HOME=$gs"
    Write-Output "[GeoServer] starting on http://localhost:$port/geoserver (first boot takes ~60s)"
    & "$gs\bin\startup.bat"
  }
  'stop' {
    Write-Output '[GeoServer] shutting down...'
    & "$gs\bin\shutdown.bat"
  }
  'url' {
    Write-Output "http://localhost:$port/geoserver"
  }
}
