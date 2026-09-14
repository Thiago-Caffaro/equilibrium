[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$CreateJarPath,
    [string]$ScriptPath = (Join-Path $PSScriptRoot '..\balance-lab\kubejs\server_scripts\01-create-merchant-rice-bale-compacting.js')
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $ScriptPath)) {
    throw "Experiment script not found: $ScriptPath"
}
if (-not (Test-Path -LiteralPath $CreateJarPath)) {
    throw "Create JAR not found: $CreateJarPath"
}

$scriptText = Get-Content -Raw -LiteralPath $ScriptPath
if ($scriptText -match '(?m)^(?!\s*//).*event\.recipes\.create\.compacting\s*\(') {
    throw 'The unavailable KubeJS Create helper is still used.'
}
if ($scriptText -notmatch "type:\s*'create:compacting'") {
    throw 'The experiment is not a Create compacting recipe.'
}
if (([regex]::Matches($scriptText, "item:\s*'farmersdelight:rice_panicle'")).Count -ne 9) {
    throw 'The experiment must contain exactly nine rice-panicle inputs.'
}
if ($scriptText -notmatch "id:\s*'farmersdelight:rice_bale'") {
    throw 'The experiment must produce a rice bale using Create 6 result syntax.'
}
if ($scriptText -notmatch "\.id\('equilibrium:merchant_rice_bale_compacting'\)") {
    throw 'The experiment recipe ID is missing or changed.'
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path -LiteralPath $CreateJarPath))
try {
    $entry = $archive.GetEntry('data/create/recipe/compacting/diorite_from_flint.json')
    if ($null -eq $entry) {
        throw 'Create 6 compacting recipe fixture is missing from the installed JAR.'
    }

    $reader = [System.IO.StreamReader]::new($entry.Open())
    try {
        $fixture = $reader.ReadToEnd() | ConvertFrom-Json
    }
    finally {
        $reader.Dispose()
    }
}
finally {
    $archive.Dispose()
}

if ($fixture.type -ne 'create:compacting' -or
    $fixture.ingredients.Count -lt 1 -or
    $fixture.results.Count -lt 1 -or
    [string]::IsNullOrWhiteSpace($fixture.results[0].id)) {
    throw 'The installed Create JAR does not expose the expected compacting schema.'
}

Write-Output 'PASS: native Create 6 compacting schema and EXP-CM-001 contract verified.'
