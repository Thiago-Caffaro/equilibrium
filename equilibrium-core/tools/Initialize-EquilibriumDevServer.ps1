<#
.SYNOPSIS
Creates and configures the isolated development dedicated-server directory.

.DESCRIPTION
This is for the local NeoForge test server only. It sets online-mode=false so
the ModDevGradle development player can connect. Never use this configuration
as a public-server security policy.
#>
[CmdletBinding()]

$projectRoot = Split-Path -Parent $PSScriptRoot
$serverDirectory = Join-Path $projectRoot 'runs\server'
$propertiesPath = Join-Path $serverDirectory 'server.properties'
if (-not (Test-Path -LiteralPath $serverDirectory)) {
    New-Item -ItemType Directory -Path $serverDirectory | Out-Null
}
if (-not (Test-Path -LiteralPath $propertiesPath)) {
    New-Item -ItemType File -Path $propertiesPath | Out-Null
}

function Set-ServerProperty([string]$Path, [string]$Key, [string]$Value) {
    $lines = [System.Collections.Generic.List[string]](Get-Content -LiteralPath $Path)
    $pattern = '^' + [regex]::Escape($Key) + '='
    $index = $lines.FindIndex([Predicate[string]] { param($line) $line -match $pattern })
    if ($index -ge 0) {
        $lines[$index] = "$Key=$Value"
    } else {
        $lines.Add("$Key=$Value")
    }
    Set-Content -LiteralPath $Path -Value $lines -Encoding utf8
}

Set-ServerProperty $propertiesPath 'online-mode' 'false'
Write-Host "Development server prepared in '$serverDirectory'. Start it with: .\tools\Invoke-EquilibriumGradle.ps1 runServer"
