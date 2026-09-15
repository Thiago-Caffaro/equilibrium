[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$FarmersDelightJarPath,
    [Parameter(Mandatory)]
    [string]$SomeAssemblyRequiredJarPath,
    [Parameter(Mandatory)]
    [string]$SliceAndDiceJarPath,
    [string]$FarmersDelightConfigPath = 'C:\Users\thiag\curseforge\minecraft\Instances\Equilibrium - Test grounds\config\farmersdelight-common.toml',
    [string]$SomeAssemblyRequiredConfigPath = 'C:\Users\thiag\curseforge\minecraft\Instances\Equilibrium - Test grounds\config\someassemblyrequired-server.toml',
    [string]$SliceAndDiceConfigPath = 'C:\Users\thiag\curseforge\minecraft\Instances\Equilibrium - Test grounds\config\sliceanddice-common.toml'
)

$ErrorActionPreference = 'Stop'

foreach ($path in @($FarmersDelightJarPath, $SomeAssemblyRequiredJarPath, $SliceAndDiceJarPath, $FarmersDelightConfigPath, $SomeAssemblyRequiredConfigPath, $SliceAndDiceConfigPath)) {
    if (-not (Test-Path -LiteralPath $path)) {
        throw "Required evidence input not found: $path"
    }
}

Add-Type -AssemblyName System.IO.Compression.FileSystem

function Read-ArchiveJson {
    param(
        [Parameter(Mandatory)] [System.IO.Compression.ZipArchive]$Archive,
        [Parameter(Mandatory)] [string]$EntryPath
    )

    $entry = $Archive.GetEntry($EntryPath)
    if ($null -eq $entry) {
        throw "Expected JAR entry is missing: $EntryPath"
    }

    $reader = [System.IO.StreamReader]::new($entry.Open())
    try {
        return $reader.ReadToEnd() | ConvertFrom-Json
    }
    finally {
        $reader.Dispose()
    }
}

function Assert-Equal {
    param(
        [Parameter(Mandatory)] $Actual,
        [Parameter(Mandatory)] $Expected,
        [Parameter(Mandatory)] [string]$Message
    )

    if ($Actual -ne $Expected) {
        throw "$Message Expected '$Expected', found '$Actual'."
    }
}

$fdArchive = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path -LiteralPath $FarmersDelightJarPath))
$sarArchive = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path -LiteralPath $SomeAssemblyRequiredJarPath))
$sliceAndDiceArchive = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path -LiteralPath $SliceAndDiceJarPath))
try {
    $riceTag = Read-ArchiveJson $fdArchive 'data/c/tags/item/crops/rice.json'
    if (@($riceTag.values).Count -ne 1 -or $riceTag.values[0] -ne 'farmersdelight:rice') {
        throw 'The installed c:crops/rice tag no longer contains exactly farmersdelight:rice.'
    }

    $riceMilling = Read-ArchiveJson $fdArchive 'data/farmersdelight/recipe/integration/create/milling/rice_panicle.json'
    Assert-Equal $riceMilling.type 'create:milling' 'Rice milling must use the Create milling recipe type.'
    Assert-Equal $riceMilling.ingredients[0].item 'farmersdelight:rice_panicle' 'Rice milling input changed.'
    Assert-Equal $riceMilling.results[0].id 'farmersdelight:rice' 'Rice milling first output changed.'
    Assert-Equal $riceMilling.results[0].count 1 'Rice milling first output count changed.'
    Assert-Equal $riceMilling.results[1].id 'farmersdelight:straw' 'Rice milling second output changed.'
    Assert-Equal $riceMilling.results[1].count 1 'Rice milling second output count changed.'
    Assert-Equal $riceMilling.processing_time 50 'Rice milling processing time changed.'
    if (@($riceMilling.'neoforge:conditions' | Where-Object { $_.type -eq 'neoforge:mod_loaded' -and $_.modid -eq 'create' }).Count -ne 1) {
        throw 'Rice milling no longer declares the required Create-loaded condition.'
    }

    $cookedRice = Read-ArchiveJson $fdArchive 'data/farmersdelight/recipe/cooking/cooked_rice.json'
    Assert-Equal $cookedRice.ingredients[0].tag 'c:crops/rice' 'Cooked-rice input must remain the shared rice tag.'

    $breadCutting = Read-ArchiveJson $sarArchive 'data/someassemblyrequired/recipe/cutting/create/bread_slice.json'
    Assert-Equal $breadCutting.type 'create:cutting' 'Bread-slice integration must use Create cutting.'
    Assert-Equal $breadCutting.ingredients[0].item 'minecraft:bread' 'Bread-slice input changed.'
    Assert-Equal $breadCutting.results[0].id 'someassemblyrequired:bread_slice' 'Bread-slice output changed.'
    Assert-Equal $breadCutting.results[0].count 4 'Bread-slice output count changed.'
    if (@($breadCutting.'neoforge:conditions' | Where-Object { $_.type -eq 'neoforge:mod_loaded' -and $_.modid -eq 'create' }).Count -ne 1) {
        throw 'Bread-slice integration no longer declares the required Create-loaded condition.'
    }
    if (@($breadCutting.'neoforge:conditions' | Where-Object { $_.type -eq 'neoforge:not' -and $_.value.modid -eq 'sliceanddice' }).Count -ne 1) {
        throw 'Bread-slice integration no longer protects the Slice & Dice overlap.'
    }

    $baconSandwich = Read-ArchiveJson $sarArchive 'data/someassemblyrequired/recipe/pressing/bacon_sandwich.json'
    Assert-Equal $baconSandwich.type 'create:pressing' 'Bacon-sandwich integration must use Create pressing.'
    Assert-Equal $baconSandwich.results[0].id 'farmersdelight:bacon_sandwich' 'Bacon-sandwich output changed.'
    foreach ($modId in @('create', 'farmersdelight')) {
        if (@($baconSandwich.'neoforge:conditions' | Where-Object { $_.type -eq 'neoforge:mod_loaded' -and $_.modid -eq $modId }).Count -ne 1) {
            throw "Bacon-sandwich integration no longer declares the required $modId-loaded condition."
        }
    }

    $pressingRecipeCount = @($sarArchive.Entries | Where-Object { $_.FullName -match '^data/someassemblyrequired/recipe/pressing/.+\.json$' }).Count
    $cuttingRecipeCount = @($sarArchive.Entries | Where-Object { $_.FullName -match '^data/someassemblyrequired/recipe/cutting/create/.+\.json$' }).Count
    Assert-Equal $pressingRecipeCount 4 'Some Assembly Required pressing fixture count changed.'
    Assert-Equal $cuttingRecipeCount 28 'Some Assembly Required Create-cutting fixture count changed.'

    foreach ($classEntry in @('com/possible_triangle/sliceanddice/RecipeInjection.class', 'com/possible_triangle/sliceanddice/compat/FarmersDelightCompat.class')) {
        if ($null -eq $sliceAndDiceArchive.GetEntry($classEntry)) {
            throw "Slice & Dice compatibility fixture is missing: $classEntry"
        }
    }
}
finally {
    $fdArchive.Dispose()
    $sarArchive.Dispose()
    $sliceAndDiceArchive.Dispose()
}

$farmersDelightConfig = Get-Content -Raw -LiteralPath $FarmersDelightConfigPath
$someAssemblyRequiredConfig = Get-Content -Raw -LiteralPath $SomeAssemblyRequiredConfigPath
$sliceAndDiceConfig = Get-Content -Raw -LiteralPath $SliceAndDiceConfigPath
foreach ($expectedSetting in @('richSoilBoostChance = 0.2', 'cuttingBoardFortuneBonus = 0.1')) {
    if ($farmersDelightConfig -notmatch [regex]::Escape($expectedSetting)) {
        throw "Farmer's Delight configuration no longer contains '$expectedSetting'."
    }
}
foreach ($expectedSetting in @('maximum_sandwich_height = 32', 'generate_chest_loot = true')) {
    if ($someAssemblyRequiredConfig -notmatch [regex]::Escape($expectedSetting)) {
        throw "Some Assembly Required configuration no longer contains '$expectedSetting'."
    }
}
foreach ($expectedSetting in @('consume_tool_durability = true', 'ignore_rotation = false', 'enabled = true', 'heat_condition = "HEATED"')) {
    if ($sliceAndDiceConfig -notmatch [regex]::Escape($expectedSetting)) {
        throw "Slice & Dice configuration no longer contains '$expectedSetting'."
    }
}

Write-Output 'PASS: Merchant supply-chain JAR fixtures, tag contract, and observed local configuration verified.'
