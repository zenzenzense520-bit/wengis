# WENGIS dev server launcher for Windows PowerShell
# Equivalent to scripts/dev.sh
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)
npm run dev
