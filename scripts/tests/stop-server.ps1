# 修复 Git Bash 退出后 Vite 子进程遗留；只关闭本项目的测试端口。
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$listeners = @(Get-NetTCPConnection -LocalPort 43210 -State Listen -ErrorAction SilentlyContinue)
foreach ($listener in $listeners) {
    $testProcess = Get-CimInstance Win32_Process -Filter "ProcessId=$($listener.OwningProcess)"
    if (-not $testProcess) { continue }
    $commandText = [string]$testProcess.CommandLine
    if ($commandText.IndexOf($projectRoot, [StringComparison]::OrdinalIgnoreCase) -lt 0 -or
        $commandText -notmatch 'vite' -or $commandText -notmatch '--port\s+43210') {
        throw 'Test port belongs to another process; cleanup refused.'
    }
    Stop-Process -Id $listener.OwningProcess -Force
}
