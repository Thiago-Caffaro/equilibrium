<#
.SYNOPSIS
Creates a compact, local evidence record for one manual Equilibrium Core run.

.DESCRIPTION
The generated record includes the exact JAR hash, test-instance profile,
scenario, outcome, and an optional tail of the relevant log. It is ignored by
Git so local instance paths and log content are not published accidentally.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$JarPath,
    [Parameter(Mandatory)]
    [string]$InstanceProfile,
    [Parameter(Mandatory)]
    [string]$Scenario,
    [Parameter(Mandatory)]
    [ValidateSet('Passed', 'Failed')]
    [string]$Outcome,
    [string]$LogPath,
    [string]$OutputDirectory
)

if (-not (Test-Path -LiteralPath $JarPath -PathType Leaf)) {
    throw "JAR not found at '$JarPath'."
}
if ($LogPath -and -not (Test-Path -LiteralPath $LogPath -PathType Leaf)) {
    throw "Log not found at '$LogPath'."
}

$projectRoot = Split-Path -Parent $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($OutputDirectory)) {
    $OutputDirectory = Join-Path $projectRoot 'verification-evidence'
}
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null

$hash = (Get-FileHash -LiteralPath $JarPath -Algorithm SHA256).Hash
$timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss K'
$fileTimestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$outputPath = Join-Path $OutputDirectory "manual-$fileTimestamp.md"
$logExcerpt = if ($LogPath) { Get-Content -LiteralPath $LogPath -Tail 30 | Out-String } else { 'No log excerpt supplied.' }

$record = @"
# Equilibrium Core manual verification

- Recorded: $timestamp
- JAR: $JarPath
- SHA-256: $hash
- Instance profile: $InstanceProfile
- Outcome: $Outcome

## Scenario

$Scenario

## Relevant log excerpt

~~~text
$logExcerpt
~~~
"@
$record | Set-Content -LiteralPath $outputPath -Encoding utf8

Write-Host "Manual evidence written to '$outputPath'."
