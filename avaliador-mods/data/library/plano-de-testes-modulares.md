# Plano de testes modulares do Equilibrium

**Estado:** plano operacional de avaliação  
**Data de referência:** 13 de setembro de 2026  
**Fontes:** catálogo exportado do Avaliador de Mods e candidatos ainda na mesa  
**Importante:** estar em um grupo de teste não significa estar selecionado para o modpack final.

## Objetivo

Manter uma base de teste estável e ativar conjuntos pequenos de mods relacionados. Cada rodada deve responder perguntas específicas sobre função, progressão, desempenho, multiplayer e combinações perigosas.

O teste deve separar três tipos de conjunto:

1. **Base fixa:** interface, qualidade de vida, scripting já adotado e otimizações já qualificadas.
2. **Ferramentas de laboratório:** diagnóstico, pré-geração e inspeção úteis durante o desenvolvimento, mas não necessariamente destinadas ao pack final.
3. **Grupos ativáveis:** conteúdo e otimizações experimentais que entram e saem conforme o objetivo da rodada.

## Regras do laboratório

- Congelar a mesma versão de Minecraft, loader, Java, base fixa e configurações durante comparações.
- Testar primeiro cada grupo isolado. Combinar grupos somente depois de entender o comportamento individual.
- Criar mundos descartáveis próprios para grupos que alteram worldgen, dimensões, estruturas ou biomas.
- Não remover mods de conteúdo de um mundo que se pretende preservar.
- Anotar dependências carregadas automaticamente, mas avaliar a experiência do mod principal.
- Não usar simultaneamente duas otimizações que atacam o mesmo subsistema antes de qualificá-las separadamente.
- Repetir os testes relevantes em servidor dedicado com pelo menos dois jogadores.
- Registrar versão exata, configuração usada, duração, participantes e conclusão na ficha.
- Um teste sem objetivo e sem observação registrada não conta como evidência de seleção.

## BASE-FIXA — ambiente comparável

Esta base deve mudar pouco entre rodadas. A presença na base de laboratório não garante presença no pack publicado.

### BF-1 — scripting e integração

- KubeJS
- Rhino
- LootJS: KubeJS Addon
- MoreJS

**Objetivo:** manter disponíveis os meios de integração, alteração de receitas e instrumentação usados pelo projeto.

### BF-2 — consulta e interface

- AppleSkin
- EMI
- EMI Enchanting
- EMI Extra Integrations
- Jade
- Jade Addons
- Mouse Tweaks
- Better Advanced Tooltips
- Chat Heads
- Pick Up Notifier
- Ping Wheel

**Condicionais:**

- JEI deve permanecer somente quando algum grupo exigir compatibilidade de runtime ainda não atendida pelo EMI.
- EMI Loot pode ser mantido no laboratório para inspeção, mas sua presença no pack final precisa ser avaliada pelo efeito sobre descoberta e conhecimento.
- Aggro Indicator, Boss Checklist e mapas ajudam o teste, mas também alteram leitura de perigo e descoberta. Por isso pertencem preferencialmente às ferramentas de laboratório.

### BF-3 — otimizações já aceitas como ponto de partida

- FerriteCore
- Sodium
- ModernFix
- Entity Culling

**Regra:** se qualquer uma ainda não foi qualificada na versão exata do pack, ela começa em `OPT`, não na base fixa. A base deve ser menor do que o conjunto total de mods de otimização disponíveis.

## LAB — ferramentas de laboratório

- Better Compatibility Checker
- Boss Checklist
- Crash Utilities
- Observable
- Chunky
- Chunky Offline
- Structure Essentials
- Memory Settings
- Xaero's Minimap
- Xaero's World Map
- Xaero's Minimap & World Map — Waystones Compatibility, somente quando Waystones estiver ativo
- EMI Loot
- Aggro Indicator

FancyMenu, Simple Discord Rich Presence, Cinematic Respawn e Not Enough Animations não são necessários para medir conteúdo. Podem formar posteriormente um grupo de apresentação e acabamento do cliente.

## DEP — bibliotecas condicionais

Estas bibliotecas acompanham os mods que realmente as exigem. Não devem ficar sempre ativas apenas para “completar a base”.

- Architectury API
- Balm
- Cloth Config API
- Cupboard
- FDLib
- Fragmentum
- Fzzy Config
- GeckoLib
- GuideME
- Konkrete
- Kotlin for Forge
- MCG Core
- Melody
- Puzzles Lib
- Silent Lib
- Sophisticated Core

Quando uma biblioteca aparece como ficha independente, seu teste deve se limitar a compatibilidade, manutenção, licença, desempenho e necessidade real.

## OPT — qualificação de otimizações

### OPT-1 — tick, entidades e lógica geral

- Lithium
- ServerCore
- BadOptimizations

### OPT-2 — chunks e worldgen assíncrono

- Concurrent Chunk Management Engine
- Noisiumed

### OPT-3 — salvamento

- Fast Async World Save
- Server Performance — Smooth Chunk Save

### OPT-4 — rede e memória

- Packet Fixer
- Memory Settings

**Procedimento:** testar cada candidato individualmente sobre a mesma base e o mesmo mundo descartável; depois testar apenas as combinações aprovadas. Fast Async World Save e Smooth Chunk Save devem ser comparados antes de serem combinados. C2ME deve receber uma rodada própria por alterar um subsistema amplo.

**Observar:** tempo de inicialização, geração de chunks, salvamento, TPS/MSPT, memória, picos durante exploração, corrupção, deadlocks e comportamento ao desligar o servidor.

## MER-1 — ecossistema Create e produção comercial

- Create
- Create Crafts & Additions
- Create Hypertube
- Some Assembly Required
- Engineer's Decor

**Hipótese em avaliação:** Create pertence primariamente aos Comerciantes por representar produção, logística e infraestrutura mecânica. Addons continuam sujeitos à avaliação funcional.

**Observar:** capacidade de automatizar cedo demais, consumo real de materiais, logística, energia, desempenho de contraptions, integração multiplayer e diferença entre produção comercial e Tecnologia avançada.

## MER-2 — alimentação, pesca e comércio

- Farmer's Delight
- Aquaculture 2
- Cooking for Blockheads
- Farming for Blockheads
- Nomadic Tents

**Hipótese em avaliação:** Farming for Blockheads será controlado pelos Comerciantes e terá receitas profundamente alteradas.

**Observar:** economia de alimentos, facilidade de obter sementes e recursos, valor da pesca, comércio, armazenamento de comida e possibilidade de automatizar etapas antes do domínio manual.

## MER-3 — colônia e defesa territorial

- MineColonies
- Structurize

**Primeira rodada:** testar sem Create para medir MineColonies e suas raids isoladamente.  
**Segunda rodada:** combinar com `MER-1` e depois com `MER-2`.

**Observar:** ritmo da colônia, requisitos, automação por trabalhadores, demanda por outras divisões, raids, carga de servidor, multiplayer, território e risco de a colônia substituir atividades dos jogadores.

## TEC-1 — energia e processamento avançado

- Mekanism
- Oritech
- Powah
- Industrial Foregoing
- Industrial Foregoing: Agriculture & Husbandry — confirmar nome e projeto exatos
- Iron Furnaces
- Charging Station — confirmar projeto exato

Não iniciar com todos simultaneamente. Criar perfis `TEC-1A` a `TEC-1D`, cada um com um mod central, e só depois comparar pares.

**Observar:** curvas de energia, multiplicação de minérios, farms, processamento, recursos exclusivos, máquinas redundantes, atalhos de progressão e custo de rebalanceamento. O nerf extremo de Powah é uma intenção, não evidência de que a combinação já esteja equilibrada.

## TEC-2 — redes, armazenamento e logística avançada

- Applied Energistics 2
- Applied Mekanistics — testar somente com AE2 e Mekanism
- AE Infinity Boost
- XNet
- Modular Routers
- Compact Machines 5

**Hipótese em avaliação:** Compact Machines 5 será controlado por Tecnologia.

**Observar:** momento em que armazenamento digital aparece, alcance remoto, transporte sem infraestrutura, farms escondidas, carregamento de chunks, automação entre dimensões e perda de relevância da logística dos Comerciantes.

## TEC-3 — automação biológica e de mobs

- Genetics Resequenced
- Industrial Foregoing e seu conteúdo de mobs/agricultura, quando aplicável
- Shrink, se for requisito funcional do fluxo escolhido

**Observar:** duplicação de drops, geração virtual de criaturas, acesso a materiais de bosses, bypass de Aventura e aderência a `Automation Follows Mastery`.

## MAG-1 — ecossistema Ars Nouveau

- Ars Nouveau
- addon de glyphs — confirmar projeto exato
- Ars Elemental
- Ars Nouveau Flavors & Delight

**Procedimento:** testar Ars Nouveau sozinho; adicionar um addon por vez; por fim testar o ecossistema completo.

**Observar:** progressão de glyphs, automação, geração de recursos, combate, redundância entre addons, integração com comida e pontos adequados para maestria e contribuições externas.

## MAG-2 — magia ritual e recursos arcanos

- Forbidden and Arcanus
- Occultism
- EvilCraft
- Mahou Tsukai
- Luminax — confirmar projeto exato

Estes mods devem ser testados individualmente antes da combinação. O objetivo é descobrir a função exclusiva de cada um, não apenas verificar se iniciam juntos.

**Observar:** geração de recursos, armazenamento, summons, rituais, automação, equipamentos, dano extremo e sobreposição de materiais ou sistemas.

## MAG-3 — combate mágico

- Iron's Spells 'n Spellbooks

Testar primeiro isolado e depois com `MAG-1`, `MAG-2` e `PWR` em rodadas diferentes.

**Observar:** curva de dano, mana, loot, dependência de exploração, variedade efetivamente usada, desempenho multiplayer e competição com armas, relíquias e encantamentos.

## ADV-1 — Aquamirae e oceano congelado

- Aquamirae
- MCG's Guidebook: Aquamirae
- Fragmentum e demais dependências exigidas

**Observar:** Ice Maze, acesso ao Maelstrom, dimensão, tempestade, Shipbreaker, progressão, loot, multiplayer e potencial para eventos. O guia deve ser avaliado separadamente pelo quanto revela e orienta.

## ADV-2 — dimensões individuais

Cada dimensão recebe um perfil e um mundo próprios:

- `ADV-2A` — The Aether
- `ADV-2B` — The Twilight Forest
- `ADV-2C` — The Bumblezone

**Observar:** duração, materiais exclusivos, bosses, repetibilidade, necessidade de outras divisões, impacto de worldgen e função concreta no Equilibrium.

## ADV-3 — Deep Dark e profundezas

- Deeper and Darker
- Darker Depths

Testar primeiro separadamente e depois juntos para detectar sobreposição de cavernas, progressão, dimensões, recursos e ambientação.

## ADV-4 — expansão do End

- The Unusual End
- Endless Biomes

Testar primeiro separadamente e depois juntos.

**Observar:** compatibilidade de geração, densidade, estruturas, materiais, progressão pós-dragão e se ambos possuem função suficiente para coexistir.

## ADV-5 — criaturas e perigo ambiental

- Alex's Mobs
- Mowzie's Mobs
- Sons of Sins
- Whisperwoods
- Creeper Overhaul

Adicionar um por vez na primeira rodada. Depois combinar os aprovados.

**Observar:** densidade, biomas, drops, dificuldade inicial, animações, IA, desempenho, duplicação de funções e valor real no multiplayer.

## ADV-6 — bosses, arenas e invasões

- Meet Your Fight
- Bosses of Mass Destruction
- Cataclysm
- Gateways to Eternity

**Observar:** invocação, acesso, dificuldade em grupo, escalonamento, loot, repetibilidade, destruição de terreno e interação com equipamentos de `PWR`. A Staff of Suppression deve receber teste específico como item crítico.

## ADV-7 — estruturas e exploração do Overworld

- Towers of the Wild Modded
- Quark
- Supplementaries

Quark e Supplementaries possuem conteúdo além de worldgen. Nesta rodada, habilitar apenas os recursos relacionados ao objetivo ou registrar claramente tudo que estiver ativo.

**Observar:** densidade de estruturas, poluição visual, loot, distância de viagem, compatibilidade e preservação do valor da exploração.

## PWR — equipamentos, atributos e mobilidade de combate

- Apotheosis
- Upgraded Netherite
- Enigmatic Legacy e addons
- Relics
- Simply Swords
- Simply Tools — confirmar projeto exato
- Silent Gear
- Majrusz's Enchantments
- Majrusz's Accessories
- Combat Roll

Este conjunto não deve ser ativado integralmente na primeira rodada.

### Sequência

1. Testar Silent Gear e Simply Swords separadamente como sistemas de equipamento.
2. Testar Apotheosis isoladamente como sistema de atributos, affixes, gems e encantamentos.
3. Testar Enigmatic Legacy, Relics e Majrusz's Accessories como camada de acessórios.
4. Testar Upgraded Netherite e Majrusz's Enchantments como camada de melhoria.
5. Testar Combat Roll como mudança do combate base.
6. Combinar apenas os candidatos que mantiverem funções distintas.

**Observar:** dano, defesa, slots, raridade, sockets, encantamentos, mobilidade, obtenção, reparo, recompensas obsoletas e capacidade de trivializar bosses ou magia.

## STO — armazenamento inicial e inventário

- Sophisticated Backpacks
- Sophisticated Core
- Storage Drawers
- Iron Chests

**Observar:** capacidade disponível cedo, upgrades, automação, acesso remoto, filtros, portabilidade, desempenho e integração de fluidos de experiência. Repetir os testes de XP sempre que Create, Mekanism ou outro mod adicionar fluidos equivalentes.

## BLD-1 — decoração e variedade construtiva

- Fantasy Furniture
- Chisel
- Connected Glass
- Framed Blocks
- Many Ideas Doors — confirmar projeto exato
- Engineer's Decor, também observado em `MER-1`

**Observar:** redundância de blocos, tamanho de assets, tempo de carregamento, receitas, poluição no catálogo e valor estético realmente usado pelo grupo.

## BLD-2 — ferramentas de construção e mobilidade

- Building Gadgets
- Construction Wand
- Elevators
- Waystones
- Shrink

**Observar:** redução de trabalho, consumo real de materiais, alcance, bypass de obstáculos, mobilidade vertical, teleporte e possível autoridade de Comerciantes ou Tecnologia. A divisão definitiva ainda não está assumida por este plano.

## Acabamento de cliente

- FancyMenu
- Simple Discord Rich Presence
- Cinematic Respawn
- Not Enough Animations

Testar depois de estabilizar conteúdo e desempenho. Estes mods não devem interferir na comparação de progressão entre grupos.

## Testes de interação prioritários

Depois da aprovação isolada:

1. `MER-1 + MER-2` — Create, alimentos e cadeias comerciais.
2. `MER-1 + MER-3` — Create abastecendo MineColonies.
3. `TEC-1 + TEC-2` — geração, processamento, redes e armazenamento digital.
4. `TEC-3 + ADV-5/ADV-6` — risco de automatizar mobs e bosses.
5. `MAG-1 + MAG-3` — glyphs, feitiços e combate mágico.
6. `MAG-2 + STO/TEC-2` — armazenamento e automação ritual concorrentes.
7. `PWR + ADV-6` — equipamento contra bosses.
8. `PWR + MAG-3` — armas físicas, feitiços, atributos e acessórios.
9. `ADV-3 + ADV-4 + ADV-7`, apenas após testes separados — orçamento agregado de worldgen.
10. `STO + MER-1 + TEC-1` — fluidos de experiência, transporte e duplicação.
11. mapas e Boss Checklist com conteúdo de Aventura — medir o quanto ferramentas de teste alteram descoberta.

## Roteiro mínimo de cada rodada

### Fase 1 — inicialização

- Cliente e servidor iniciam sem erros relevantes.
- Dependências e versões correspondem ao perfil.
- Receitas e tags carregam.
- Entrar, sair e reiniciar o servidor preserva o mundo.

### Fase 2 — experiência focada

- Jogar o início do mod sem itens concedidos por comando.
- Registrar o primeiro objetivo compreensível.
- Medir quando surge a primeira automação ou aumento relevante de poder.
- Testar a principal atividade com dois ou mais jogadores.

### Fase 3 — limites

- Procurar duplicações, loops infinitos e bypasses.
- Testar morte, desconexão, mudança de dimensão e reinício.
- Avaliar carga durante worldgen, máquinas, entidades ou contraptions.
- Comparar recompensas com o equipamento disponível no mesmo perfil.

### Fase 4 — registro

Preencher na ficha:

- função única;
- evidência humana;
- sobreposições;
- combinações perigosas;
- impacto na escassez e automação;
- desempenho e multiplayer;
- testes restantes;
- parecer e justificativa.

## Critérios de saída do grupo

Um grupo só está pronto para testes cruzados quando:

- cada mod principal possui função compreensível;
- dependências e projetos ambíguos foram confirmados;
- não há crash ou corrupção reproduzível sem encaminhamento;
- o comportamento multiplayer básico foi observado;
- os principais atalhos de progressão foram registrados;
- existe uma conclusão individual: manter, testar novamente ou retirar;
- alterações necessárias foram distinguidas de problemas intrínsecos.

## Identidades ainda pendentes

Antes de baixar ou consolidar fichas, confirmar o projeto e a grafia exatos de:

- addon de glyphs para Ars Nouveau;
- Industrial Foregoing: Agriculture & Husbandry;
- Luminax;
- Charging Station;
- Simply Tools;
- Many Ideas Doors;
- addons pretendidos de Enigmatic Legacy;
- família exata de Upgraded Netherite;
- mod de traders que completará a proposta dos Comerciantes.

## Fora das rodadas ativas

- Just Enough Resources (JER) permanece arquivado. Só deve retornar a um perfil se surgir uma função que EMI, EMI Loot ou outra ferramenta aprovada não cubra adequadamente.
