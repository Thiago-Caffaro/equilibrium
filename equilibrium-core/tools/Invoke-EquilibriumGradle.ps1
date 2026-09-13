<#
.SYNOPSIS
Runs the project's Gradle wrapper with a Java 21 JDK for this process only.

.EXAMPLE
.\tools\Invoke-EquilibriumGradle.ps1 build
.\tools\Invoke-EquilibriumGradle.ps1 test
.\tools\Invoke-EquilibriumGradle.ps1 runServer
#>
[CmdletBinding()]
param(
    [Parameter(Position = 0, ValueFromRemainingArguments = $true)]
    [string[]]$GradleArguments,
    [string]$JavaHome
)

$projectRoot = Split-Path -Parent $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($JavaHome)) {
    $javaCommand = Get-Command java -CommandType Application -ErrorAction Stop | Select-Object -First 1
    $JavaHome = Split-Path -Parent (Split-Path -Parent $javaCommand.Source)
}

$javaExecutable = Join-Path $JavaHome 'bin\java.exe'
if (-not (Test-Path -LiteralPath $javaExecutable)) {
    throw "Java executable not found at '$javaExecutable'. Pass -JavaHome with a JDK 21 installation."
}

$versionOutput = (& $javaExecutable -version 2>&1 | Out-String)
if ($versionOutput -notmatch 'version "21(?:\.|\")') {
    throw "Equilibrium requires Java 21. '$javaExecutable' reported: $versionOutput"
}

$env:JAVA_HOME = $JavaHome
$env:Path = (Join-Path $JavaHome 'bin') + [IO.Path]::PathSeparator + $env:Path
& (Join-Path $projectRoot 'gradlew.bat') @GradleArguments
exit $LASTEXITCODE
