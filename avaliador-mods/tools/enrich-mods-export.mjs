#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  throw new Error("Uso: node tools/enrich-mods-export.mjs <entrada.json> <saida.json>");
}

const input = JSON.parse(await readFile(resolve(inputPath), "utf8"));
if (input?.collection !== "mods" || !Array.isArray(input?.records)) {
  throw new Error("A entrada precisa ser uma exportação JSON da coleção Mods.");
}

const automaticNote = "Preenchimento documental de 2026-09-16: campos preenchidos a partir da Baseline, da matriz Gate A, dos planos locais e de metadados oficiais. Não substitui evidência humana, testes ou decisão de modlist.";
const noContentFields = [
  "divisions",
  "uniqueSystems",
  "humanEvidence",
  "overlaps",
  "dangerousCombinations",
  "scarcityNotes",
  "automationImpact",
  "masteryGate",
  "progressionWindow",
  "worldgenNotes",
  "multiplayerNotes",
  "performanceNotes",
  "rupturePotential",
  "requiredChanges",
  "testNeeds",
  "verdictReason",
  "openQuestions"
];

const clientNames = new Set([
  "AAA Particles",
  "Aggro Indicator",
  "Ambient Environment",
  "AmbientSounds 6",
  "AppleSkin",
  "Armor Quick Swap",
  "Better Advanced Tooltips",
  "Borderless Window",
  "Chat Heads",
  "Cinematic Respawn",
  "DarkZoom - RPG Simplest Zoom",
  "FancyMenu",
  "GUI Scaler",
  "Iris Shaders",
  "Iris/Oculus Shader Folder",
  "Longer Chat History [Forge/NeoForge/Fabric]",
  "Mouse Tweaks",
  "Not Enough Animations",
  "Particular ✨ Reforged",
  "Pick Up Notifier",
  "Ping Wheel",
  "Reese's Sodium Options",
  "Simple Discord Rich Presence (Forge /  Fabric)",
  "Skin Layers 3D",
  "Sound Physics Remastered",
  "Sound​s",
  "Xaero's Minimap",
  "Xaero's World Map",
  "Xaero's Minimap & World Map - Waystones Compatibility [Forge & NeoForge]"
]);

const libraryNames = new Set([
  "Architectury API",
  "Balm",
  "Cloth Config API (Fabric/Forge/NeoForge)",
  "CreativeCore",
  "Cupboard",
  "FDLib",
  "Fragmentum [NeoForge Edition]",
  "Fzzy Config",
  "GeckoLib",
  "Konkrete",
  "Kotlin for Forge",
  "MCG Core [API]",
  "Melody",
  "MRU",
  "Puzzles Lib",
  "Rhino",
  "Silent Lib (silentlib)",
  "Sophisticated Core",
  "YetAnotherConfigLib"
]);

const informationNames = new Set([
  "Boss Checklist",
  "EMI",
  "EMI Enchanting",
  "EMI Extra Integrations",
  "EMI Loot",
  "GuideME",
  "Jade 🔍",
  "Jade Addons (Neo/Forge)",
  "Just Enough Items (JEI)",
  "Just Enough Resources (JER)",
  "MCG's Guidebook: Aquamirae"
]);

const performanceNames = new Set([
  "BadOptimizations",
  "Better Compatibility Checker",
  "Chunky",
  "Chunky Offline",
  "Concurrent Chunk Management Engine",
  "Crash Utilities",
  "Entity Culling",
  "Fast Async World Save[Forge/Neo/Fabric]",
  "FerriteCore",
  "Ixeris",
  "Lithium",
  "Memory Settings",
  "ModernFix",
  "Noisiumed",
  "Observable",
  "Packet Fixer",
  "ScalableLux",
  "Server Performance - Smooth Chunk Save",
  "ServerCore",
  "Sodium",
  "spark",
  "VulkanMod Reforged"
]);

const patches = {
  "Create": {
    divisions: ["Tecnologia"],
    tags: ["candidato Gate A", "processamento", "logística", "automação"],
    primaryFunction: "Processamento mecânico, logística física e automação inicial; pode processar insumos de Comerciantes sem assumir a autoridade da divisão.",
    uniqueSystems: "Contraptions e cadeias cinéticas físicas que dão escala material depois do domínio manual.",
    overlaps: "Immersive Engineering, Mekanism e outras rotas de processamento, energia e transporte.",
    dangerousCombinations: "Pode antecipar automação de colheita e alimento, ou repetir processamento de sistemas tecnológicos mais avançados.",
    scarcityImpact: "Controlável",
    integrationEffort: "Grande",
    scarcityNotes: "A escala deve vir depois da atividade manual que substitui e de um ponto de controle da divisão responsável.",
    automationImpact: "Automatiza processamento, transporte e partes de cadeias produtivas físicas.",
    masteryGate: "Domínio de processamento manual e gate que separe escala mecânica de autoridade dos Comerciantes.",
    progressionWindow: "Início a intermediário, sem antecipar automação completa de recursos ou alimentos.",
    worldgenImpact: "Desconhecido",
    requiredChanges: "Nenhuma receita deve ser aprovada nesta ficha; futuras alterações de balanceamento permanecem em KubeJS/dados locais.",
    testNeeds: "Comparar uma primeira máquina de escala com a rota manual e medir o que ela torna trivial.",
    verdict: "Manter na mesa",
    verdictReason: "Candidato central do Gate A, com função material clara, mas precisa de fronteira contra sobreposição tecnológica."
  },
  "Create Crafts & Additions": {
    divisions: ["Tecnologia"],
    tags: ["addon Create", "energia", "ponte industrial"],
    primaryFunction: "Ponte entre energia elétrica e cinética do Create; candidato de infraestrutura, não um pilar autônomo.",
    overlaps: "Immersive Engineering e outras soluções elétricas; pode diluir a separação entre produção mecânica e Tecnologia avançada.",
    dangerousCombinations: "A ponte elétrica pode liberar máquinas ou energia de outra janela tecnológica cedo demais.",
    scarcityImpact: "Risco alto",
    integrationEffort: "Médio",
    scarcityNotes: "A fronteira entre produção comercial rudimentar e energia tecnológica precisa de gate explícito.",
    automationImpact: "Amplia as rotas de energia e automação já oferecidas por Create.",
    masteryGate: "Prova técnica que venha depois do domínio mecânico de base.",
    progressionWindow: "Intermediário, caso uma comparação funcional prove que não é redundante.",
    worldgenImpact: "Nenhum",
    testNeeds: "Rodada MER-1B: comparar transporte, infraestrutura e custo contra as alternativas elétricas.",
    verdict: "Precisa de teste",
    verdictReason: "O papel de ponte é claro, mas a divisão entre Create e Tecnologia avançada ainda não foi comprovada."
  },
  "Create Slice & Dice": {
    divisions: ["Comerciantes", "Tecnologia"],
    tags: ["addon Create", "Farmer's Delight", "alimentação", "automação"],
    primaryFunction: "Ponte de automação entre receitas de Farmer's Delight e máquinas do Create; apoio à fronteira Comerciantes ↔ Tecnologia.",
    overlaps: "Automação alimentar direta do Create e outros mods de cozinha/processamento.",
    dangerousCombinations: "Pode liberar corte e cozinha automáticos antes que o loop comercial/manual tenha valor próprio.",
    scarcityImpact: "Controlável",
    integrationEffort: "Médio",
    scarcityNotes: "A comida pode ganhar escala somente depois da demonstração do loop alimentar original.",
    automationImpact: "Converte parte de corte e cozinha de Farmer's Delight para aparelhos do Create.",
    masteryGate: "Domínio comercial de alimentação e o primeiro gate tecnológico que autorize escala mecânica.",
    progressionWindow: "Intermediário; dependente da janela definida para automação alimentar.",
    worldgenImpact: "Nenhum",
    testNeeds: "MER-2A: comparar cozinha manual, corte automático, bacia aquecida e itens intermediários.",
    verdict: "Precisa de teste",
    verdictReason: "Integração factual já observada, mas o valor comercial antes da automação ainda não foi isolado."
  },
  "Create: Some Assembly Required": {
    divisions: ["Comerciantes"],
    tags: ["alimentação", "montagem", "sanduíches"],
    primaryFunction: "Montagem de sanduíches e consumo de ingredientes; extensão potencial da cadeia alimentar comercial.",
    uniqueSystems: "Estação de montagem e componentes de sanduíche, distintos de apenas adicionar refeições prontas.",
    overlaps: "Farmer's Delight e outros sistemas de culinária; não substitui por si só cidade, pesca ou comércio.",
    scarcityImpact: "Controlável",
    integrationEffort: "Pequeno",
    scarcityNotes: "Deve sustentar demanda recorrente de ingredientes antes de receber automação ampla.",
    automationImpact: "Pode receber apoio de prensas e logística do Create, mas não deve definir a janela de automação sozinho.",
    masteryGate: "Domínio do ciclo comercial/alimentar que consome seus ingredientes.",
    progressionWindow: "Início a intermediário, como complemento opcional da cadeia de alimentos.",
    worldgenImpact: "Nenhum",
    testNeeds: "MER-2A: verificar se a montagem cria decisões de grupo ou apenas poluição de receitas.",
    verdict: "Manter na mesa",
    verdictReason: "Há uma função alimentar delimitada, mas ainda não há evidência de output comercial exclusivo."
  },
  "Create: Enchantment Industry": {
    divisions: ["Tecnologia"],
    tags: ["addon Create", "experiência", "encantamento", "automação"],
    primaryFunction: "Automação de experiência e encantamentos com Create; candidato de alto impacto, não apenas addon cosmético.",
    overlaps: "Sistemas mágicos, farms de mobs, equipamentos e outras formas de armazenar ou processar experiência.",
    dangerousCombinations: "Pode industrializar encantamentos, recompensas de exploração e drops de mobs antes de seus marcos de domínio.",
    scarcityImpact: "Risco alto",
    integrationEffort: "Grande",
    scarcityNotes: "Experiência e encantamentos precisam manter relação com combate, exploração e magia antes de qualquer escala industrial.",
    automationImpact: "Automatiza obtenção, movimento e processamento de experiência/encantamentos.",
    masteryGate: "Gate tardio que preserve as fontes convencionais de experiência e as recompensas de exploração.",
    progressionWindow: "Intermediário a avançado, se uma rodada isolada mostrar uma função não redundante.",
    worldgenImpact: "Nenhum",
    testNeeds: "MER-1C isolado: medir geração, armazenamento, fluídos de XP e concorrência com magia/equipamentos.",
    verdict: "Precisa de teste",
    verdictReason: "O impacto transversal é alto demais para ser aceito como addon comum."
  },
  "Create: Hypertubes": {
    divisions: ["Tecnologia"],
    tags: ["addon Create", "transporte", "mobilidade"],
    primaryFunction: "Transporte rápido por tubos como infraestrutura física ligada ao Create.",
    overlaps: "Waystones, outras rotas de teleporte e transporte por trilhos/contraptions.",
    dangerousCombinations: "Mobilidade precoce pode reduzir custo de exploração e tornar rotas de viagem redundantes.",
    scarcityImpact: "Controlável",
    integrationEffort: "Médio",
    scarcityNotes: "O custo e a infraestrutura devem manter a viagem como conquista, não como teleporte inicial.",
    automationImpact: "Não gera recursos; reduz atrito de deslocamento entre infraestrutura construída.",
    masteryGate: "Infraestrutura mecânica estabelecida e decisão sobre mobilidade versus exploração.",
    progressionWindow: "Intermediário, depois de o grupo ter experimentado deslocamento e exploração convencionais.",
    worldgenImpact: "Nenhum",
    testNeeds: "MER-1B: medir custo, alcance, contraptions e redundância com outras soluções de viagem.",
    verdict: "Precisa de teste",
    verdictReason: "Tem função legível, mas sua janela depende da política de mobilidade e exploração."
  },
  "Create: Dragons Plus": {
    divisions: ["Tecnologia"],
    tags: ["addon Create", "processamento", "integração"],
    primaryFunction: "Extensões de processamento e utilitários para Create; deve ser avaliado por cada ponte que adiciona, não como pacote obrigatório.",
    overlaps: "Outros addons de Create e receitas de processamento de mods integrados.",
    dangerousCombinations: "Integrações de processamento podem criar atalhos entre Create, magia, dimensões ou recursos de Aventura.",
    scarcityImpact: "Controlável",
    integrationEffort: "Médio",
    scarcityNotes: "Cada integração precisa respeitar a janela do recurso ou sistema que ela processa.",
    automationImpact: "Acrescenta opções de processamento a cadeias do Create.",
    masteryGate: "O gate do conteúdo externo processado, além do domínio mecânico de Create.",
    progressionWindow: "Sem janela própria; dependente da integração específica aprovada.",
    worldgenImpact: "Nenhum",
    testNeeds: "MER-1B: inventariar somente recursos habilitados e identificar qualquer atalho de progressão.",
    verdict: "Precisa de teste",
    verdictReason: "É compatível com o alvo técnico, mas sua amplitude exige avaliação por integração."
  },
  "Farmer's Delight": {
    divisions: ["Comerciantes"],
    tags: ["agricultura", "culinária", "alimentação", "candidato Gate A"],
    primaryFunction: "Agricultura e culinária com cadeia de transformação; base alimentar possível para Comerciantes, não economia completa.",
    uniqueSystems: "Ingredientes, preparo e refeições que permitem uma cadeia de produção mais rica que comida instantânea.",
    overlaps: "Outros mods de comida, pesca, criação e automação do Create.",
    dangerousCombinations: "Automação tecnológica pode trivializar cultivo e preparo antes de a cadeia comercial ganhar valor.",
    scarcityImpact: "Controlável",
    integrationEffort: "Médio",
    scarcityNotes: "Alimento processado é commodity; a escala deve seguir o domínio do loop manual e não substituir toda a divisão.",
    automationImpact: "O mod não autoriza automação por si; integrações como Slice & Dice definem a fronteira posterior.",
    masteryGate: "Domínio da produção alimentar/agrícola e ponto de controle antes da automação mecânica.",
    progressionWindow: "Início a intermediário, com automação adiada.",
    worldgenImpact: "Leve",
    testNeeds: "Manter a cadeia de arroz como evidência e comparar primeiro output comercial com rotas de outras divisões.",
    verdict: "Manter na mesa",
    verdictReason: "Há evidência manual e de bancada, mas não define sozinho pesca, cidades, comércio ou outputs exclusivos."
  },
  "Immersive Engineering": {
    divisions: ["Tecnologia"],
    tags: ["indústria", "energia", "multibloco", "candidato Gate A"],
    primaryFunction: "Indústria visual/física, energia e máquinas multibloco; candidato de camada intermediária a avançada de Tecnologia.",
    overlaps: "Create, Create Crafts & Additions, Mekanism e outras rotas industriais/energéticas.",
    dangerousCombinations: "Pode duplicar processamento e energia ou abrir infraestrutura avançada sem uma identidade própria.",
    scarcityImpact: "Risco alto",
    integrationEffort: "Grande",
    scarcityNotes: "A primeira cadeia industrial precisa demonstrar por que não é apenas uma cópia mais pesada de Create.",
    automationImpact: "Escala processamento, energia, transporte e máquinas industriais.",
    masteryGate: "Domínio mecânico de base e componentes cruzados das demais divisões nos estágios altos.",
    progressionWindow: "Intermediário a avançado, apenas se a comparação por slot de Tecnologia justificar sua presença.",
    worldgenImpact: "Desconhecido",
    testNeeds: "TEC-0A isolado: energia, multiblocos, recursos, custo e sobreposição com Create/alternativas.",
    verdict: "Precisa de teste",
    verdictReason: "Candidato recorrente em referências, mas com sobreposição alta e função final ainda não demonstrada."
  },
  "Engineer's Decor: Community NeoForge Port": {
    tags: ["decoração", "infraestrutura industrial", "suporte"],
    primaryFunction: "Blocos industriais decorativos e possivelmente funcionais; apoio visual a Create/Immersive Engineering, não pilar autônomo.",
    overlaps: "Create, Immersive Engineering e outros mods de construção/decoração.",
    scarcityImpact: "Preserva",
    integrationEffort: "Pequeno",
    worldgenImpact: "Nenhum",
    testNeeds: "BLD-1A: verificar função além da decoração, receitas, redundância e uso real na base.",
    verdict: "Precisa de teste",
    verdictReason: "O artefato local estava desabilitado; a função precisa ser medida em construção deliberada."
  },
  "Aquaculture 2": {
    divisions: ["Comerciantes"],
    tags: ["pesca", "alimentação", "biomas", "candidato secundário"],
    primaryFunction: "Pesca com peixes de bioma, receitas e equipamentos; possível complemento de Comerciantes, não economia completa.",
    overlaps: "Farmer's Delight, outros mods de comida e qualquer sistema de pesca automatizada.",
    dangerousCombinations: "Farms ou conversões automáticas podem retirar o valor de pesca/exploração de biomas antes do domínio manual.",
    scarcityImpact: "Controlável",
    integrationEffort: "Médio",
    scarcityNotes: "Produtos de pesca podem ser commodities após a atividade manual e a descoberta dos biomas correspondentes.",
    automationImpact: "Amplia fontes de alimento e recursos de pesca; a automação precisa ser avaliada separadamente.",
    masteryGate: "Domínio de pesca e descoberta convencional dos recursos de bioma.",
    progressionWindow: "Início a intermediário, como ramo complementar de Comerciantes.",
    worldgenImpact: "Nenhum",
    testNeeds: "MER-2: verificar valor da pesca, sementes/recursos, comida e compatibilidade com a automação alimentar.",
    verdict: "Manter na mesa",
    verdictReason: "A função de pesca complementa a lacuna de Comerciantes, mas a relevância de grupo ainda não foi demonstrada."
  },
  "Mahou Tsukai": {
    divisions: ["Magia"],
    tags: ["magia", "feitiços", "candidato modular"],
    primaryFunction: "Sistema de magia focado em feitiços e efeitos; candidato a papel mágico que precisa ser comparado isoladamente.",
    overlaps: "Ars Nouveau, Occultism e outros sistemas de magia, rituais, recursos e combate.",
    dangerousCombinations: "Magia, rituais ou automação podem sobrepor recursos, dano extremo e equipamentos de outras divisões.",
    scarcityImpact: "A avaliar",
    integrationEffort: "Grande",
    automationImpact: "A confirmar em rodada isolada; não presumir geração de recursos ou automação segura.",
    masteryGate: "Domínio mágico convencional e limites contra substituição de autoridade de outras divisões.",
    progressionWindow: "Indefinido até a comparação MAG-2.",
    worldgenImpact: "Nenhum",
    testNeeds: "MAG-2: testar individualmente antes de combinar com outros sistemas mágicos.",
    verdict: "Precisa de teste",
    verdictReason: "A divisão é compatível, mas ainda não há função exclusiva ou limite de sobreposição documentado."
  },
  "Silent Gear": {
    divisions: ["Aventura"],
    tags: ["equipamentos", "ferramentas", "armas", "datapack"],
    primaryFunction: "Ferramentas, armas e armaduras modulares configuráveis por datapack; candidato de equipamento, não prova automática de progressão.",
    overlaps: "Outros sistemas de armas, atributos, relíquias, encantamentos e melhoria de equipamento.",
    dangerousCombinations: "Materiais, upgrades e receitas podem trivializar bosses, magia ou recompensas de exploração.",
    scarcityImpact: "Risco alto",
    integrationEffort: "Grande",
    scarcityNotes: "A progressão de materiais e upgrades deve conservar a relevância de exploração e de troféus.",
    automationImpact: "Não gera recursos diretamente, mas pode converter materiais renováveis em poder de combate.",
    masteryGate: "Provas de Aventura e limites de materiais conforme a cadeia de equipamento.",
    progressionWindow: "Indefinido até a rodada PWR isolada.",
    worldgenImpact: "Nenhum",
    testNeeds: "PWR: testar isoladamente contra outros sistemas de equipamento e medir dano, defesa, raridade e reparo.",
    verdict: "Precisa de teste",
    verdictReason: "A configuração por datapack cria flexibilidade e risco; não há motivo para decidir antes do comparativo."
  },
  "Building Gadgets": {
    tags: ["construção", "qualidade de vida", "mobilidade"],
    primaryFunction: "Ferramentas para construção em escala; a divisão proprietária permanece aberta entre apoio a Comerciantes e Tecnologia.",
    overlaps: "Construction Wand, ferramentas de construção e automação de blocos.",
    dangerousCombinations: "Pode reduzir trabalho de construção, consumo percebido de materiais e obstáculos espaciais cedo demais.",
    scarcityImpact: "Risco alto",
    integrationEffort: "Médio",
    scarcityNotes: "O custo real de blocos e alcance devem permanecer relevantes; não usar para criar recursos ou ignorar gates.",
    automationImpact: "Acelera colocação/remoção de blocos, sem ser uma fonte de materiais.",
    masteryGate: "Decidir primeiro a autoridade de construção e os requisitos materiais de cada ferramenta.",
    progressionWindow: "Indefinida até BLD-2; não assumir divisão final.",
    worldgenImpact: "Nenhum",
    testNeeds: "BLD-2: medir alcance, consumo, bypass de obstáculos e papel de mobilidade.",
    verdict: "Precisa de teste",
    verdictReason: "A utilidade é factual, mas a redução de trabalho tem impacto de progressão que depende do perfil do grupo."
  },
  "Waystones": {
    tags: ["teleporte", "mobilidade", "qualidade de vida"],
    primaryFunction: "Rede de marcos e pergaminhos de teleporte; suporte de mobilidade, sem divisão proprietária definida.",
    overlaps: "Create: Hypertubes e outras rotas de viagem/teleporte.",
    dangerousCombinations: "Teleporte cedo pode reduzir exploração, custo de viagem e risco de recuperação após morte.",
    scarcityImpact: "Risco alto",
    integrationEffort: "Médio",
    scarcityNotes: "Acesso, custo e disponibilidade precisam respeitar a descoberta do mundo e os gates de mobilidade.",
    automationImpact: "Não gera recursos; altera a distância e o custo logístico entre atividades.",
    masteryGate: "Decidir a política de viagem e autoridade entre Comerciantes/Tecnologia/Aventura antes de liberar rede ampla.",
    progressionWindow: "Indefinida até BLD-2; não assumir divisão final.",
    worldgenImpact: "Nenhum",
    testNeeds: "BLD-2: comparar custo, teleporte, recuperação de morte e redundância com transporte físico.",
    verdict: "Precisa de teste",
    verdictReason: "A funcionalidade é clara, porém tem impacto direto no valor da exploração."
  },
  "Nomadic Tents": {
    tags: ["dimensão de bolso", "acampamento", "mobilidade"],
    primaryFunction: "Tendas que dão acesso a uma dimensão de bolso portátil; apoio de logística/exploração, não pilar confirmado.",
    overlaps: "Compact Machines, transporte, armazenamento portátil e abrigos de exploração.",
    dangerousCombinations: "Armazenamento e abrigo portáteis podem reduzir o custo de viagem, risco de expedição ou espaço de base.",
    scarcityImpact: "Risco alto",
    integrationEffort: "Médio",
    scarcityNotes: "A dimensão de bolso não deve se tornar atalho de infraestrutura ou autoridade de exploração.",
    automationImpact: "Não cria recursos diretamente; pode concentrar armazenamento e segurança longe da base.",
    masteryGate: "Decisão de mobilidade/expedição e custo que preserve o valor de explorar convencionalmente.",
    progressionWindow: "Indefinida; avaliar somente na rodada MER-2 com pergunta de logística concreta.",
    worldgenImpact: "Nenhum",
    testNeeds: "MER-2: verificar armazenamento, viagem, segurança e possíveis atalhos de exploração.",
    verdict: "Precisa de teste",
    verdictReason: "A versão NeoForge 1.21.1 existe, mas o papel no Equilibrium continua secundário e de alto impacto logístico."
  },
  "Archaion: Echoes of the Fallen": {
    divisions: ["Aventura"],
    tags: ["estrutura", "trial spawner", "boss", "exploração"],
    primaryFunction: "Expedição à Ancient Keep com Trial Spawners e encontro final; candidato de estrutura/boss para Aventura.",
    uniqueSystems: "Estrutura de desafio com Trial Spawners e uma conclusão de combate, conforme a página oficial.",
    overlaps: "Outros mods de estruturas, bosses e conteúdo de Aventura.",
    dangerousCombinations: "Loot ou repetição do encontro podem tornar materiais de Aventura renováveis sem regra de crédito/recompensa.",
    scarcityImpact: "A avaliar",
    integrationEffort: "Médio",
    automationImpact: "Não presumir automação; primeiro mapear loot, repetibilidade e autoridade de conclusão.",
    masteryGate: "Descoberta e vitória convencional da estrutura antes de qualquer rota de volume ligada a seus drops.",
    progressionWindow: "Intermediário, se sua estrutura, boss e loot tiverem papel distinto.",
    worldgenImpact: "Leve",
    worldgenNotes: "Adiciona a estrutura Ancient Keep; densidade e loot ainda precisam de leitura do artefato alvo.",
    rupturePotential: "Trial Spawners, estrutura e encontro final podem ser matéria-prima para eventos, se a licença/compatibilidade permitir.",
    testNeeds: "Auditar estrutura, loot, repetibilidade e comportamento em grupo antes de promoção.",
    verdict: "Manter na mesa",
    verdictReason: "Há artefato NeoForge 1.21.1 local e função de Aventura legível, mas não há matriz comparativa de loot/bosses."
  },
  "Legendary Shrines": {
    divisions: ["Aventura"],
    tags: ["estrutura", "respawn", "exploração", "mobilidade"],
    primaryFunction: "Santuários de Overworld para escolher o ponto de renascimento; apoio à recuperação em expedições.",
    overlaps: "Waystones, camas e outras soluções de recuperação/mobilidade.",
    dangerousCombinations: "Pode retirar custo de morte e deslocamento em exploração se aparecer cedo ou com densidade alta.",
    scarcityImpact: "Controlável",
    integrationEffort: "Médio",
    scarcityNotes: "O ponto de respawn deve respeitar a descoberta e não substituir toda a logística de aventura.",
    automationImpact: "Não gera recursos; altera recuperação e risco de morte.",
    masteryGate: "Decisão sobre segurança de expedições e o momento aceitável para respawn alternativo.",
    progressionWindow: "Indefinida até verificar compatibilidade de plataforma e densidade de estruturas.",
    worldgenImpact: "Leve",
    worldgenNotes: "Santuários gerados no Overworld; a página atual não demonstra suporte alvo 1.21.1 NeoForge, apesar do JAR local informado.",
    testNeeds: "Resolver discrepância entre o JAR local e a página oficial; depois medir densidade, respawn e efeito na exploração.",
    verdict: "Precisa de teste",
    verdictReason: "A função é clara, mas a evidência oficial consultada aponta outra linha de versão/loader e não pode ser tratada como compatibilidade do perfil."
  },
  "Towers of the Wild Modded": {
    divisions: ["Aventura"],
    tags: ["estruturas", "worldgen", "exploração"],
    primaryFunction: "Torres distribuídas por dimensões como pontos de exploração e possível suporte a mobilidade.",
    overlaps: "Outros mods de estruturas, Waystones e objetivos de exploração do Overworld.",
    dangerousCombinations: "Excesso de estruturas, loot e pontos de mobilidade pode reduzir a distância e a descoberta orgânica.",
    scarcityImpact: "A avaliar",
    integrationEffort: "Médio",
    masteryGate: "Descoberta e exploração convencional; não transformar estruturas em teleporte ou loot automático.",
    progressionWindow: "Início a intermediário, somente após comparar densidade e recompensas com outros candidatos de estrutura.",
    worldgenImpact: "Moderado",
    worldgenNotes: "Adiciona torres a várias dimensões; densidade, compatibilidade e loot precisam de perfil próprio.",
    rupturePotential: "Estruturas podem servir como locais de eventos somente depois de revisar loot e permissões.",
    testNeeds: "ADV-7: medir densidade, poluição visual, loot, distância de viagem e compatibilidade.",
    verdict: "Precisa de teste",
    verdictReason: "O papel de exploração é plausível, mas o custo de worldgen e a sobreposição ainda são desconhecidos."
  },
  "Upgrader items": {
    divisions: ["Comerciantes"],
    tags: ["laboratório", "conversão probabilística", "risco crítico", "autoridade de servidor"],
    primaryFunction: "Conversão probabilística de valores; candidato experimental para uma mecânica comercial, inadequado como integração controlada no estado inspecionado.",
    uniqueSystems: "Interface de conversão probabilística com valores, house edge e limites de tentativa configuráveis.",
    overlaps: "Qualquer mercado, roleta, conversão de itens ou recompensa controlada pelos Comerciantes.",
    dangerousCombinations: "O catálogo percorre itens registrados e a blacklist bloqueia entrada e saída ao mesmo tempo; isso expõe itens arbitrários e não permite catálogo positivo seguro.",
    scarcityImpact: "Crítico",
    integrationEffort: "Muito grande",
    scarcityNotes: "Pode converter mercadorias em alvos arbitrários; receita cara ou restrição de crafting não corrige a falta de whitelist e validação por jogador.",
    automationImpact: "Não é automação de recursos tradicional, mas pode criar acesso econômico imprevisível a itens de qualquer mod.",
    masteryGate: "Exige catálogo positivo, entradas/saídas separadas e validação de divisão/maestria no servidor antes de ser elegível.",
    progressionWindow: "Nenhuma janela segura na implementação atual.",
    worldgenImpact: "Nenhum",
    requiredChanges: "Solicitar whitelist/API ao autor; avaliar addon somente com permissão e ponto estável; caso contrário, implementar mecânica original do Equilibrium.",
    testNeeds: "Não balancear blacklist em massa. Testar somente a sensação no laboratório até existir controle positivo de catálogo e autoridade.",
    verdict: "Rejeitar",
    verdictReason: "Rejeitado como integração direta: a auditoria local confirma que o catálogo é negativo por blacklist e não oferece separação segura de entradas, saídas ou autoridade."
  },
  "Equilibrium Core": {
    tags: ["mod próprio", "autoridade de servidor", "infraestrutura"],
    primaryFunction: "Infraestrutura original do Equilibrium para dados de ofertas, validação de servidor, auditoria e transações experimentais de Comerciantes.",
    scarcityImpact: "Preserva",
    integrationEffort: "Grande",
    worldgenImpact: "Nenhum",
    requiredChanges: "Não absorver receitas, custos, chances ou configs de mods; essas decisões pertencem a KubeJS/dados locais.",
    testNeeds: "Manter GameTests e smoke de servidor para qualquer mudança de contrato ou transação.",
    verdict: "Manter na mesa",
    verdictReason: "É infraestrutura própria ativa; sistemas finais de maestria, economia e estações continuam fora de escopo."
  },
  "KubeJS": {
    tags: ["infraestrutura", "scripting", "balanceamento", "opcional ao Core"],
    primaryFunction: "Camada de scripts para receitas, tags, pacing e compatibilidade de modpack; não é autoridade de transação do Core.",
    scarcityImpact: "Controlável",
    integrationEffort: "Médio",
    worldgenImpact: "Nenhum",
    requiredChanges: "Usar server_scripts para dados recarregáveis e manter o Core funcional sem KubeJS.",
    testNeeds: "Cada experimento precisa de hipótese, versão de mod, reload/restart, rollback e verificação focal.",
    verdict: "Manter na mesa",
    verdictReason: "A bancada 1.21.1 já demonstrou uso para receita isolada; continua fora do contrato obrigatório do Core."
  },
  "MoreJS": {
    tags: ["addon KubeJS", "scripting", "infraestrutura"],
    primaryFunction: "Extensão de eventos e dados para KubeJS; só deve entrar se uma integração concreta exigir sua API.",
    scarcityImpact: "Preserva",
    integrationEffort: "Médio",
    worldgenImpact: "Nenhum",
    testNeeds: "Confirmar API e versão somente quando uma hipótese de balanceamento não for atendida pelo KubeJS base."
  },
  "LootJS: KubeJS Addon": {
    tags: ["addon KubeJS", "loot", "infraestrutura"],
    primaryFunction: "Extensão de KubeJS para alterações de loot; não deve substituir autoridade de eventos ou recompensas do Core.",
    scarcityImpact: "Risco alto",
    integrationEffort: "Médio",
    worldgenImpact: "Nenhum",
    requiredChanges: "Usar somente para dados de loot deliberados e auditáveis; nunca para transformar recompensas de autoridade em farm passiva.",
    testNeeds: "Avaliar apenas quando uma tabela de loot concreta estiver aprovada."
  },
  "Sophisticated Backpacks": {
    tags: ["inventário", "armazenamento", "qualidade de vida"],
    scarcityImpact: "Controlável",
    integrationEffort: "Médio",
    worldgenImpact: "Nenhum",
    automationImpact: "Amplia armazenamento portátil; tanques e upgrades precisam ser comparados com fluidos/XP de outros mods.",
    testNeeds: "Repetir teste de tanque e fluidos de experiência quando Create, Mekanism ou equivalentes entrarem no perfil."
  },
  "Structure Essentials": {
    tags: ["estruturas", "utilitário", "exploração"],
    primaryFunction: "Ferramentas para localizar estruturas, ajustar distância e consultar estruturas próximas; apoio de administração/exploração, não conteúdo próprio de divisão.",
    overlaps: "Comandos, mapas, guias de exploração e outros utilitários de localização.",
    dangerousCombinations: "Localização e distância alteradas podem remover descoberta, viagem e busca convencional por estruturas.",
    scarcityImpact: "Risco alto",
    integrationEffort: "Pequeno",
    scarcityNotes: "Localização deve respeitar o valor de estruturas como prova de Aventura e não substituir sua descoberta.",
    automationImpact: "Não gera recursos; reduz o atrito para encontrar conteúdo de exploração.",
    masteryGate: "Definir se localizar estruturas é conforto de grupo ou uma recompensa posterior de Aventura.",
    progressionWindow: "Indefinida até a política de exploração e mobilidade estar fechada.",
    worldgenImpact: "Nenhum",
    testNeeds: "Verificar alcance, comandos e como a localização interage com objetivos/estruturas de Aventura.",
    verdict: "Precisa de teste",
    verdictReason: "A função utilitária é clara, mas o impacto sobre descoberta e viagem precisa de uma decisão de exploração."
  }
};

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

function isDefault(value, defaults) {
  return isBlank(value) || defaults.includes(String(value).trim());
}

function addValues(record, key, values, changed) {
  const current = Array.isArray(record[key]) ? record[key] : [];
  const merged = [...new Set([...current, ...values])];
  if (merged.length !== current.length) {
    record[key] = merged;
    changed.add(key);
  }
}

function setIfMissing(record, key, value, changed, defaults = [""]) {
  if (isDefault(record[key], defaults)) {
    record[key] = value;
    changed.add(key);
  }
}

function applyPatch(record, patch, changed) {
  if (patch.tags) addValues(record, "tags", patch.tags, changed);
  if (patch.divisions && (!Array.isArray(record.divisions) || record.divisions.length === 0)) {
    record.divisions = patch.divisions;
    changed.add("divisions");
  }

  for (const [key, value] of Object.entries(patch)) {
    if (key === "tags" || key === "divisions") continue;
    const defaults = key === "scarcityImpact"
      ? ["", "A avaliar"]
      : key === "integrationEffort"
        ? ["", "Desconhecido"]
        : key === "worldgenImpact"
          ? ["", "Desconhecido"]
          : key === "verdict"
            ? ["", "Sem parecer"]
            : [""];
    setIfMissing(record, key, value, changed, defaults);
  }
}

function clearNotApplicableValues(record, changed) {
  if (!Array.isArray(record.notApplicableFields)) return;
  const defaults = new Set(["", "A avaliar", "Desconhecido", "Sem parecer"]);
  const retained = record.notApplicableFields.filter((field) => {
    const value = record[field];
    if (Array.isArray(value)) return value.length === 0;
    return defaults.has(String(value ?? "").trim());
  });
  if (retained.length !== record.notApplicableFields.length) {
    record.notApplicableFields = retained;
    changed.add("notApplicableFields");
  }
}

function classifySupport(record, changed, { kind, tag, functionText, testNeeds }) {
  addValues(record, "tags", [tag], changed);
  setIfMissing(record, "primaryFunction", functionText, changed);
  setIfMissing(record, "scarcityImpact", "Preserva", changed, ["", "A avaliar"]);
  setIfMissing(record, "worldgenImpact", "Nenhum", changed, ["", "Desconhecido"]);
  const notApplicable = noContentFields.filter((field) => {
    const value = record[field];
    return Array.isArray(value) ? value.length === 0 : isBlank(value);
  });
  addValues(record, "notApplicableFields", notApplicable, changed);
  if (testNeeds) setIfMissing(record, "testNeeds", testNeeds, changed);
  if (kind === "performance") {
    record.notApplicableFields = record.notApplicableFields.filter((field) => !["performanceNotes", "testNeeds"].includes(field));
  }
}

let changedRecords = 0;
let changedFields = 0;

for (const record of input.records) {
  const changed = new Set();

  if (libraryNames.has(record.name)) {
    classifySupport(record, changed, {
      kind: "library",
      tag: "biblioteca",
      functionText: "Biblioteca ou API de suporte; só deve entrar como dependência explícita de um candidato aprovado."
    });
  } else if (clientNames.has(record.name)) {
    classifySupport(record, changed, {
      kind: "client",
      tag: "cliente",
      functionText: "Qualidade de vida, apresentação ou acessibilidade de cliente; não cria um pilar de progressão."
    });
  } else if (informationNames.has(record.name)) {
    classifySupport(record, changed, {
      kind: "information",
      tag: "interface",
      functionText: "Interface de consulta, receitas, loot ou orientação; reduz atrito de informação sem criar conteúdo de progressão."
    });
  } else if (performanceNames.has(record.name)) {
    classifySupport(record, changed, {
      kind: "performance",
      tag: "desempenho",
      functionText: "Otimização, diagnóstico ou estabilidade técnica; não cria conteúdo nem autoridade de progressão.",
      testNeeds: "Medir no perfil representativo antes de combinar: inicialização, TPS/MSPT, heap, geração de chunks, salvamento e desligamento."
    });
  }

  const patch = patches[record.name];
  if (patch) applyPatch(record, patch, changed);

  if (record.name === "Nomadic Tents" && String(record.primaryFunction || "").trim() === "Ser uma alternativa para os") {
    record.primaryFunction = patches[record.name].primaryFunction;
    changed.add("primaryFunction");
  }

  clearNotApplicableValues(record, changed);

  if (changed.size > 0) {
    const notes = String(record.notesMarkdown || "").trim();
    if (!notes.includes("Preenchimento documental de 2026-09-16")) {
      record.notesMarkdown = [notes, automaticNote].filter(Boolean).join("\n\n");
      changed.add("notesMarkdown");
    }
    changedRecords += 1;
    changedFields += changed.size;
  }
}

const output = {
  ...input,
  contextualizedAt: new Date().toISOString(),
  contextualization: {
    method: "Preenchimento documental conservador; não sobrescreve evidência humana, estados ou pareceres existentes.",
    changedRecords,
    changedFields
  }
};

await writeFile(resolve(outputPath), `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ input: resolve(inputPath), output: resolve(outputPath), records: output.records.length, changedRecords, changedFields }, null, 2));
