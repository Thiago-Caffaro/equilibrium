param(
    [string]$InstancesRoot = 'C:\Users\thiag\curseforge\minecraft\Instances',
    [string]$TargetInstanceName = 'Equilibrium - Test grounds',
    [string]$SourceInstanceName = 'Enigmatica 10 - E10'
)

$ErrorActionPreference = 'Stop'

function Resolve-ContainedPath {
    param([string]$Root, [string]$Child)
    $resolvedRoot = [System.IO.Path]::GetFullPath($Root).TrimEnd('\')
    $resolvedChild = [System.IO.Path]::GetFullPath($Child).TrimEnd('\')
    if (-not $resolvedChild.StartsWith("$resolvedRoot\", [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Caminho fora da pasta de instâncias: $resolvedChild"
    }
    return $resolvedChild
}

function Read-JsonFile {
    param([string]$Path)
    return Get-Content -Raw -Encoding utf8 -LiteralPath $Path | ConvertFrom-Json
}

function Clone-Object {
    param($Value)
    return $Value | ConvertTo-Json -Depth 100 | ConvertFrom-Json
}

$instancesPath = [System.IO.Path]::GetFullPath($InstancesRoot).TrimEnd('\')
$targetPath = Resolve-ContainedPath -Root $instancesPath -Child (Join-Path $instancesPath $TargetInstanceName)
$sourcePath = Resolve-ContainedPath -Root $instancesPath -Child (Join-Path $instancesPath $SourceInstanceName)
$targetModsPath = Join-Path $targetPath 'mods'
$sourceModsPath = Join-Path $sourcePath 'mods'
$targetManifestPath = Join-Path $targetPath 'minecraftinstance.json'
$sourceManifestPath = Join-Path $sourcePath 'minecraftinstance.json'

foreach ($requiredPath in @($targetPath, $sourcePath, $targetModsPath, $sourceModsPath, $targetManifestPath, $sourceManifestPath)) {
    if (-not (Test-Path -LiteralPath $requiredPath)) {
        throw "Caminho obrigatório ausente: $requiredPath"
    }
}

if (Get-Process -Name CurseForge -ErrorAction SilentlyContinue) {
    throw 'Feche o CurseForge antes de alterar a instância.'
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupPath = Join-Path $targetPath ".equilibrium-backups\before-MER-1A-$stamp"
$backupModsPath = Join-Path $backupPath 'mods'
New-Item -ItemType Directory -Path $backupModsPath -Force | Out-Null
Copy-Item -LiteralPath $targetManifestPath -Destination (Join-Path $backupPath 'minecraftinstance.json')
Get-ChildItem -LiteralPath $targetModsPath -File | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $backupModsPath $_.Name)
}

$targetManifest = Read-JsonFile -Path $targetManifestPath
$sourceManifest = Read-JsonFile -Path $sourceManifestPath
$targetAddons = [System.Collections.ArrayList]::new()
foreach ($addon in $targetManifest.installedAddons) {
    [void]$targetAddons.Add($addon)
}

function Import-AddonFromSource {
    param([string]$Name)

    $sourceAddon = $sourceManifest.installedAddons | Where-Object { $_.name -eq $Name } | Select-Object -First 1
    if (-not $sourceAddon) {
        throw "Mod não localizado na instância de origem: $Name"
    }

    $existing = $targetAddons | Where-Object { $_.addonID -eq $sourceAddon.addonID } | Select-Object -First 1
    if ($existing) {
        return $existing
    }

    $sourceFileName = [string]$sourceAddon.fileNameOnDisk
    $sourceFilePath = Join-Path $sourceModsPath $sourceFileName
    if (-not (Test-Path -LiteralPath $sourceFilePath)) {
        throw "JAR de origem ausente: $sourceFilePath"
    }

    $targetFilePath = Join-Path $targetModsPath $sourceFileName
    Copy-Item -LiteralPath $sourceFilePath -Destination $targetFilePath -Force

    $clone = Clone-Object -Value $sourceAddon
    $clone.instanceID = [guid]::NewGuid().ToString()
    $clone.gameInstanceID = $targetManifest.guid
    $clone.modFolderPath = $targetModsPath
    $clone.fileNameOnDisk = $sourceFileName
    $clone.filePaths = @($targetFilePath)
    $clone.isEnabled = $true
    $clone.dateInstalled = [DateTime]::UtcNow.ToString('o')
    $clone.dateUpdated = $clone.dateInstalled
    [void]$targetAddons.Add($clone)
    return $clone
}

foreach ($sourceMod in @('Create', 'FerriteCore ((Neo)Forge)', 'ModernFix')) {
    [void](Import-AddonFromSource -Name $sourceMod)
}

$selectedNames = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
@(
    'Aggro Indicator',
    'AppleSkin',
    'Better Advanced Tooltips',
    'Better Compatibility Checker',
    'Chat Heads',
    'Crash Utilities',
    'Create',
    'EMI',
    'EMI Enchanting',
    'EMI Extra Integrations',
    'FerriteCore ((Neo)Forge)',
    'Jade 🔍',
    'Jade Addons (Neo/Forge)',
    'KubeJS',
    'LootJS: KubeJS Addon',
    'ModernFix',
    'MoreJS',
    'Mouse Tweaks',
    'Observable',
    'Pick Up Notifier',
    'Ping Wheel',
    'Rhino',
    'Sodium',
    'Structure Essentials',
    "Xaero's Minimap",
    "Xaero's World Map"
) | ForEach-Object { [void]$selectedNames.Add($_) }

$changed = $true
while ($changed) {
    $changed = $false
    foreach ($addon in @($targetAddons)) {
        if (-not $selectedNames.Contains([string]$addon.name)) {
            continue
        }
        foreach ($dependency in @($addon.installedFile.dependencies | Where-Object { $_.type -eq 3 })) {
            $dependencyAddon = $targetAddons | Where-Object { $_.addonID -eq $dependency.addonId } | Select-Object -First 1
            if (-not $dependencyAddon) {
                throw "Dependência obrigatória $($dependency.addonId) de $($addon.name) não existe na instância."
            }
            if ($selectedNames.Add([string]$dependencyAddon.name)) {
                $changed = $true
            }
        }
    }
}

$enabledFiles = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($addon in @($targetAddons)) {
    $shouldEnable = $selectedNames.Contains([string]$addon.name)
    $recordedName = [string]$addon.fileNameOnDisk
    $baseName = if ($recordedName.EndsWith('.disabled', [System.StringComparison]::OrdinalIgnoreCase)) {
        $recordedName.Substring(0, $recordedName.Length - '.disabled'.Length)
    } else {
        $recordedName
    }
    $enabledPath = Join-Path $targetModsPath $baseName
    $disabledPath = "$enabledPath.disabled"

    if ($shouldEnable) {
        if (-not (Test-Path -LiteralPath $enabledPath) -and (Test-Path -LiteralPath $disabledPath)) {
            Move-Item -LiteralPath $disabledPath -Destination $enabledPath
        }
        if (-not (Test-Path -LiteralPath $enabledPath)) {
            throw "Arquivo necessário ausente: $enabledPath"
        }
        $addon.fileNameOnDisk = $baseName
        $addon.filePaths = @($enabledPath)
        $addon.isEnabled = $true
        [void]$enabledFiles.Add($baseName)
    } else {
        if ((Test-Path -LiteralPath $enabledPath) -and -not (Test-Path -LiteralPath $disabledPath)) {
            Move-Item -LiteralPath $enabledPath -Destination $disabledPath
        }
        if (Test-Path -LiteralPath $disabledPath) {
            $addon.fileNameOnDisk = "$baseName.disabled"
            $addon.filePaths = @($disabledPath)
        }
        $addon.isEnabled = $false
    }
}

Get-ChildItem -LiteralPath $targetModsPath -File -Filter '*.jar' | ForEach-Object {
    if (-not $enabledFiles.Contains($_.Name)) {
        $disabledPath = "$($_.FullName).disabled"
        if (-not (Test-Path -LiteralPath $disabledPath)) {
            Move-Item -LiteralPath $_.FullName -Destination $disabledPath
        }
    }
}

$targetManifest.installedAddons = @($targetAddons)
$manifestTemporaryPath = "$targetManifestPath.equilibrium.tmp"
$manifestText = $targetManifest | ConvertTo-Json -Depth 100 -Compress
[System.IO.File]::WriteAllText($manifestTemporaryPath, $manifestText, [System.Text.UTF8Encoding]::new($false))
Move-Item -LiteralPath $manifestTemporaryPath -Destination $targetManifestPath -Force

$profilePath = Join-Path $targetPath 'equilibrium-test-profile.json'
$profile = [ordered]@{
    profile = 'MER-1A'
    title = 'Base fixa + Create isolado'
    preparedAt = [DateTime]::UtcNow.ToString('o')
    minecraft = $targetManifest.gameVersion
    loader = $targetManifest.baseModLoader.name
    sourceInstance = $SourceInstanceName
    backup = $backupPath
    enabledMods = @($targetAddons | Where-Object { $_.isEnabled } | Sort-Object name | ForEach-Object { $_.name })
    excludedFromFirstRun = @('Aquamirae', 'Sophisticated Backpacks', 'Waystones', 'Towers of the Wild', 'VulkanMod', 'JEI/JER', 'save optimizers')
    purpose = 'Validar a base e o Create sem addons ou outros mods de conteúdo.'
}
$profileText = $profile | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($profilePath, $profileText, [System.Text.UTF8Encoding]::new($false))

Write-Output "PROFILE=$profilePath"
Write-Output "BACKUP=$backupPath"
Write-Output "ENABLED=$($profile.enabledMods.Count)"
$profile.enabledMods | ForEach-Object { Write-Output "  $_" }
