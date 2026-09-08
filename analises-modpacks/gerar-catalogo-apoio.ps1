<##
Gera um catálogo estático a partir das instâncias locais do CurseForge.
Não altera as instâncias: apenas lê os arquivos JAR e escreve os artefatos desta pasta.

Categorias são uma triagem inicial para análise humana, não decisões de modlist:
  - suporte: bibliotecas, APIs, correções, compatibilidade e infraestrutura;
  - qol: interface, inventário, mapa, informação e conveniência do jogador;
  - secundario: conteúdo complementar que não foi reconhecido como pilar principal.
##>

param(
    [string]$InstancesRoot = 'C:\Users\thiag\curseforge\minecraft\Instances',
    [string]$OutputDirectory = $PSScriptRoot
)

Set-StrictMode -Version Latest
Add-Type -AssemblyName System.IO.Compression.FileSystem

$packs = @(
    'Desempregagos',
    'Enigmatica 6 Expert - E6E',
    'Enigmatica 9 Expert - E9E',
    'Enigmatica 10 - E10',
    'FTB Evolution',
    "Cisco's Fantasy Medieval RPG [Ultimate]"
)

# Padrões transparentes e deliberadamente conservadores. Ajuste-os quando uma
# revisão humana reclassificar um mod; a origem do dado continua sendo o JAR.
$supportPattern = '(?i)(api|library|lib$|lib-|core$|core-|framework|architectury|balm|cloth.config|configuration|connector|mixin|registrate|moonlight|puzzleslib|resourcefullib|fusion|geckolib|citadel|curios|caelus|placebo|collective|kotlin|rhino|kubejs|poly|sophisticatedcore|bookshelf|ftblibrary|ftbchunks|ftbteams|ftbxmodcompat|athena|corgilib|cupboard|supermartijn642|commonnetwork|guideme|iceberg|kambrik|melody|prism|smartbrain|titanium|zerocore|gamediscs|badpackets|botarium|cloth|owo|yungsapi|blueprint|terrablender|glitchcore|resourcefulconfig|cristellib|lionfishapi|structure_gel|playeranimator|pandalib|l2library|hammerlib|cyclopscore|cucumber|rangedpumps|almostunified|emi_loot|justenoughresources)'
$qolPattern = '(?i)(jei|rei|emi$|jade|wthit|theoneprobe|top$|mouse.?tweaks|controlling|appleskin|tooltip|inventory|inv.?tweaks|sorter|search|clipboard|journeymap|xaeros|map.?atlas|waystones|corail.?tombstone|corpse|trash|carry.?on|light.?overlay|minihud|shulker.?box.?tooltip|chat.?heads|chunk.?loaders|configured|catalogue|catalog|mod.?menu|embeddium|oculus|rubidium|sodium|ferritecore|modernfix|memory.?leak|spark|observable|entity.?culling|dynamic.?fps|fast.?suite|clumps|smooth.?boot|alternate.?current|starlight|lazydfu|recipe.?essentials|polymorph|no.?chat.?reports|better.?f3|toast.?control|default.?options|amendments)'

# Sistemas que merecem análise própria como candidatos de pilar. Eles não são
# apresentados na tabela solicitada, exceto se também forem explicitamente QoL
# ou suporte; isso evita chamar todo o conteúdo do pack de "secundário".
$primaryPattern = '(?i)(^ae2$|appliedenergistics|refinedstorage|mekanism|create|immersiveengineering|thermal|pneumaticcraft|industrialforegoing|powah|rftools|enderio|actuallyadditions|mysticalagriculture|productivebees|hostileneural|mob_grinding|ars_nouveau|occultism|botania|bloodmagic|astralsorcery|naturesaura|hexerei|mahou|irons_spellbooks|forbidden_arcanus|eidolon|twilightforest|blue_skies|aquamirae|cataclysm|iceandfire|undergarden|aether|bumblezone|endrem|draconicevolution|ad_astra|mekanismgenerators|mekanismtools|allthemodium|avaritia|projecte|minecolonies|minefortress|createaddition|railways|tconstruct|silentgear|apotheosis|endermanoverhaul|alexsmobs|mowziesmobs|dungeons|repurposedstructures|when_dungeons_arise|biomeswevegone|byg|terralith|tectonic|incendium|nullscape|farmersdelight|croptopia|aquaculture|cookingforblockheads|supplementaries|quark|chipped|macaws|architects_palette)'

function Get-JarMetadata {
    param([System.IO.FileInfo]$Jar)

    $result = [ordered]@{
        FileName = $Jar.Name
        ModId = $null
        DisplayName = $null
    }
    $zip = $null
    try {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($Jar.FullName)
        $entry = $zip.Entries | Where-Object { $_.FullName -match '(?i)^META-INF/(neoforge\.mods|mods)\.toml$' } | Select-Object -First 1
        if ($entry) {
            $reader = [System.IO.StreamReader]::new($entry.Open())
            $text = $reader.ReadToEnd()
            $reader.Dispose()
            $id = [regex]::Match($text, '(?m)^\s*modId\s*=\s*["'']([^"'']+)["'']')
            $name = [regex]::Match($text, '(?m)^\s*displayName\s*=\s*["'']([^"'']+)["'']')
            if ($id.Success) { $result.ModId = $id.Groups[1].Value }
            if ($name.Success) { $result.DisplayName = $name.Groups[1].Value }
        }
        elseif ($zip.Entries.FullName -contains 'fabric.mod.json') {
            $entry = $zip.Entries | Where-Object FullName -eq 'fabric.mod.json' | Select-Object -First 1
            $reader = [System.IO.StreamReader]::new($entry.Open())
            $json = $reader.ReadToEnd() | ConvertFrom-Json
            $reader.Dispose()
            $result.ModId = $json.id
            $result.DisplayName = $json.name
        }
    }
    catch {
        # Alguns JARs podem ser corrompidos ou conter formatos não padronizados.
        # O nome do arquivo continua sendo preservado como fallback.
    }
    finally {
        if ($zip) { $zip.Dispose() }
    }

    if ([string]::IsNullOrWhiteSpace($result.ModId)) {
        $result.ModId = ($Jar.BaseName -replace '[-_]?\d.*$', '').ToLowerInvariant()
    }
    if ([string]::IsNullOrWhiteSpace($result.DisplayName)) {
        $result.DisplayName = $result.ModId
    }
    [PSCustomObject]$result
}

function Get-Classification {
    param([string]$ModId, [string]$DisplayName, [string]$FileName)
    $source = "$ModId $DisplayName $FileName"
    if ($source -match $supportPattern) { return @{ Category = 'suporte'; Basis = 'padrão de biblioteca/API/infraestrutura' } }
    if ($source -match $qolPattern) { return @{ Category = 'qol'; Basis = 'padrão de interface, conveniência ou desempenho' } }
    if ($source -match $primaryPattern) { return $null }
    return @{ Category = 'secundario'; Basis = 'não reconhecido como pilar; requer revisão humana' }
}

$raw = foreach ($pack in $packs) {
    $modsPath = Join-Path (Join-Path $InstancesRoot $pack) 'mods'
    if (-not (Test-Path -LiteralPath $modsPath)) { continue }
    Get-ChildItem -LiteralPath $modsPath -File -Filter '*.jar' | ForEach-Object {
        $metadata = Get-JarMetadata $_
        $classification = Get-Classification -ModId $metadata.ModId -DisplayName $metadata.DisplayName -FileName $metadata.FileName
        if ($classification) {
            [PSCustomObject]@{
                key = $metadata.ModId.ToLowerInvariant()
                name = $metadata.DisplayName
                modId = $metadata.ModId
                category = $classification.Category
                basis = $classification.Basis
                pack = $pack
                file = $metadata.FileName
            }
        }
    }
}

$catalog = $raw | Group-Object key | ForEach-Object {
    $group = $_.Group
    $category = if ($group.category -contains 'suporte') { 'suporte' } elseif ($group.category -contains 'qol') { 'qol' } else { 'secundario' }
    [PSCustomObject]@{
        key = $_.Name
        name = ($group.name | Where-Object { $_ -and $_ -ne $group[0].modId } | Select-Object -First 1)
        modId = $group[0].modId
        category = $category
        basis = ($group | Where-Object category -eq $category | Select-Object -First 1).basis
        packs = @($group.pack | Sort-Object -Unique)
        files = @($group | Sort-Object pack,file | ForEach-Object { [PSCustomObject]@{ pack=$_.pack; file=$_.file } })
    }
} | ForEach-Object {
    if ([string]::IsNullOrWhiteSpace($_.name)) { $_.name = $_.modId }
    $_
} | Sort-Object category,name

$payload = [PSCustomObject]@{
    generatedAt = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ssK')
    packs = $packs
    method = 'Metadados META-INF dos JARs; classificação inicial por padrões revisáveis.'
    mods = @($catalog)
}

$json = $payload | ConvertTo-Json -Depth 8
$jsonPath = Join-Path $OutputDirectory 'catalogo-apoio-qol-secundarios.json'
[System.IO.File]::WriteAllText($jsonPath, $json, [System.Text.UTF8Encoding]::new($false))

$safeJson = $json.Replace('</script>', '<\/script>')
$packHeaders = (($packs | ForEach-Object { '<th>' + [System.Net.WebUtility]::HtmlEncode($_) + '</th>' }) -join '')
$html = @"
<!doctype html>
<html lang=""pt-BR""><head><meta charset=""utf-8""><meta name=""viewport"" content=""width=device-width,initial-scale=1""><title>Comparador de mods — apoio, QoL e secundários</title>
<style>
:root{color-scheme:dark;--bg:#101512;--panel:#18201b;--line:#324439;--txt:#e7eee8;--muted:#9eb0a3;--accent:#9ed369}*{box-sizing:border-box}body{margin:0;font:14px system-ui,sans-serif;background:var(--bg);color:var(--txt)}main{max-width:1480px;margin:auto;padding:28px}h1{margin:0 0 8px;font-size:26px}.notice{color:var(--muted);max-width:1000px}.controls{display:flex;gap:10px;flex-wrap:wrap;margin:22px 0}.controls input,.controls select{background:#0d120f;color:var(--txt);border:1px solid var(--line);border-radius:7px;padding:9px}.controls input{min-width:300px;flex:1}button{background:#253b2b;color:var(--txt);border:1px solid #4f7757;border-radius:7px;padding:9px 12px;cursor:pointer}.stats{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px}.stat{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:10px 14px}.table-wrap{overflow:auto;border:1px solid var(--line);border-radius:9px}table{width:100%;border-collapse:collapse;min-width:960px}th,td{padding:10px;border-bottom:1px solid #28372d;text-align:left;vertical-align:top}th{position:sticky;top:0;background:#1b251e}tr:hover td{background:#162019}.pill{display:inline-block;padding:3px 7px;border-radius:999px;font-size:12px;font-weight:700}.suporte{background:#274d69}.qol{background:#63512b}.secundario{background:#49375f}.yes{color:var(--accent);font-weight:700}.no{color:#65746a}.muted{color:var(--muted)}details{margin-top:18px;color:var(--muted)}code{color:#c6e7ae}.hidden{display:none}
</style></head><body><main>
<h1>Comparador — mods de suporte, QoL e secundários</h1>
<p class=""notice"">Inventário gerado dos metadados dos JARs das seis instâncias locais. “Secundário” é uma triagem de trabalho: significa que o mod não foi reconhecido como biblioteca, QoL ou pilar e deve ser revisado antes de qualquer conclusão de modlist.</p>
<div class=""controls""><input id=""search"" placeholder=""Buscar por nome, modId ou arquivo…"" autofocus><select id=""category""><option value=""all"">Todas as categorias</option><option value=""suporte"">Suporte</option><option value=""qol"">Quality of Life</option><option value=""secundario"">Secundários / revisar</option></select><select id=""presence""><option value=""all"">Qualquer presença</option><option value=""shared"">Em 2+ modpacks</option><option value=""unique"">Em apenas 1 modpack</option></select><button id=""copy"">Copiar tabela filtrada</button></div>
<div id=""stats"" class=""stats""></div><div class=""table-wrap""><table><thead><tr><th>Mod</th><th>Categoria</th><th>Base da triagem</th><th>Presente em</th>$packHeaders</tr></thead><tbody id=""rows""></tbody></table></div>
<details><summary>Como usar e limites</summary><p>Use busca, categoria e presença para encontrar recorrências. A coluna “Presente em” lista as instâncias; as colunas finais permitem comparação visual. O arquivo JSON ao lado desta página é legível e serve para revisão manual. Mods de pilar foram intencionalmente deixados fora desta tabela: terão análise própria.</p></details>
</main><script>const data=$safeJson;const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const packSet=m=>new Set(m.packs);const rows=document.querySelector('#rows'),search=document.querySelector('#search'),category=document.querySelector('#category'),presence=document.querySelector('#presence'),stats=document.querySelector('#stats');let shown=[];function render(){const q=search.value.trim().toLowerCase();shown=data.mods.filter(m=>{const hay=[m.name,m.modId,m.basis,...m.files.map(f=>f.file)].join(' ').toLowerCase();return(!q||hay.includes(q))&&(category.value==='all'||m.category===category.value)&&(presence.value==='all'||(presence.value==='shared'?m.packs.length>1:m.packs.length===1))});const counts=['suporte','qol','secundario'].map(c=>[c,shown.filter(m=>m.category===c).length]);stats.innerHTML='<span class="stat"><b>'+shown.length+'</b> mods exibidos</span>'+counts.map(([c,n])=>'<span class="stat"><span class="pill '+c+'">'+c+'</span> '+n+'</span>').join('');rows.innerHTML=shown.map(m=>{const present=packSet(m);return '<tr><td><b>'+esc(m.name)+'</b><br><code>'+esc(m.modId)+'</code><br><span class="muted">'+esc(m.files.map(f=>f.file).join(' · '))+'</span></td><td><span class="pill '+m.category+'">'+m.category+'</span></td><td class="muted">'+esc(m.basis)+'</td><td>'+m.packs.map(esc).join('<br>')+'</td>'+data.packs.map(p=>'<td class="'+(present.has(p)?'yes':'no')+'">'+(present.has(p)?'●':'—')+'</td>').join('')+'</tr>'}).join('')||'<tr><td colspan="20" class="muted">Nenhum mod encontrado com esses filtros.</td></tr>'}search.addEventListener('input',render);category.addEventListener('change',render);presence.addEventListener('change',render);document.querySelector('#copy').addEventListener('click',async()=>{const text=['Mod\tMod ID\tCategoria\tPresente em',...shown.map(m=>[m.name,m.modId,m.category,m.packs.join(', ')].join('\t'))].join('\n');await navigator.clipboard.writeText(text);document.querySelector('#copy').textContent='Copiado';setTimeout(()=>document.querySelector('#copy').textContent='Copiar tabela filtrada',1200)});render();</script></body></html>
"@

$html = $html.Replace('""', '"')
$htmlPath = Join-Path $OutputDirectory 'comparador-apoio-qol-secundarios.html'
[System.IO.File]::WriteAllText($htmlPath, $html, [System.Text.UTF8Encoding]::new($false))
Write-Host "Gerados: $htmlPath e $jsonPath"
Write-Host "Mods classificados: $($catalog.Count)"
