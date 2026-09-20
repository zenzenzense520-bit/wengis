# WENGIS data validation + production build for Windows PowerShell
# Equivalent to scripts/build.sh
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)
npm run validate-data
if ($?) { npm run build }
