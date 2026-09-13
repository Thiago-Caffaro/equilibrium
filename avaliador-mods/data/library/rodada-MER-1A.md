# Rodada MER-1A — Base fixa + Create isolado

**Estado:** preparada para a primeira execução  
**Instância:** `Equilibrium - Test grounds`  
**Minecraft:** 1.21.1  
**Mod loader:** NeoForge 21.1.249  
**Objetivo:** validar a base operacional e o Create sem addons de Create nem outros mods de conteúdo interferindo na avaliação.

## Escopo desta rodada

Esta é uma rodada mínima de laboratório. Ela combina:

- ferramentas de interface e diagnóstico que permanecerão úteis entre testes;
- a infraestrutura de scripts já presente na instância;
- otimizações conservadoras selecionadas;
- somente o Create como mod de conteúdo sob avaliação.

O Create foi incluído por ser o primeiro candidato central à identidade da divisão dos Comerciantes. Esta rodada não decide sua aceitação definitiva nem a de qualquer addon.

## Mods ativos

1. Aggro Indicator
2. AppleSkin
3. Architectury API
4. Better Advanced Tooltips
5. Better Compatibility Checker
6. Chat Heads
7. Crash Utilities
8. Create
9. Cupboard
10. EMI
11. EMI Enchanting
12. EMI Extra Integrations
13. FerriteCore
14. Jade
15. Jade Addons
16. Kotlin for Forge
17. KubeJS
18. LootJS
19. ModernFix
20. MoreJS
21. Mouse Tweaks
22. Observable
23. Pick Up Notifier
24. Ping Wheel
25. Puzzles Lib
26. Rhino
27. Sodium
28. Structure Essentials
29. Xaero's Minimap
30. Xaero's World Map

## Exclusões deliberadas

Ficaram desativados nesta primeira rodada:

- addons de Create;
- outros mods de conteúdo, exploração, estruturas, armazenamento e transporte;
- Aquamirae, Waystones, Sophisticated Backpacks e Towers of the Wild;
- JEI e JER, preservando EMI como visualizador principal;
- Fast Async World Save e Smooth Chunk Save;
- VulkanMod.

VulkanMod foi retirado do conjunto ativo porque o último log da instância registrava conflito direto de mixins entre ele e Sodium. Isso é uma correção operacional do laboratório, não uma decisão conceitual definitiva sobre otimização.

## Roteiro da primeira execução

1. Confirmar que o cliente chega ao menu principal sem erro de carregamento.
2. Criar um mundo descartável novo; a instância não possuía saves no momento da preparação.
3. Confirmar que EMI, Jade e os mapas carregam normalmente.
4. Abrir o Ponder do Create e verificar a navegação básica.
5. Montar uma cadeia curta com geração cinética, eixo, engrenagens e Mechanical Press.
6. Montar e movimentar uma contraption simples.
7. Salvar, fechar o mundo e carregá-lo novamente.
8. Registrar crashes, erros repetitivos no log, travamentos, tempo de carregamento e comportamento anormal de chunks.

## Critério de saída

A rodada estará tecnicamente apta a avançar quando:

- não houver crash de inicialização;
- não houver dependência obrigatória ausente;
- criação, salvamento e recarregamento do mundo funcionarem;
- a cadeia básica e uma contraption do Create funcionarem;
- não surgirem erros recorrentes que contaminem avaliações posteriores.

Isso ainda não significa que Create foi aprovado conceitualmente. A avaliação de papel, integração, poder, progressão e necessidade de receitas próprias continua sendo feita na ficha do mod.

## Reprodutibilidade e recuperação

O script [`tools/prepare-equilibrium-first-run.ps1`](../../../tools/prepare-equilibrium-first-run.ps1) reproduz o recorte e cria um novo backup antes de alterar a instância.

O estado aplicado também está registrado dentro da instância em `equilibrium-test-profile.json`. O backup criado durante esta preparação está em:

`C:\Users\thiag\curseforge\minecraft\Instances\Equilibrium - Test grounds\.equilibrium-backups\before-MER-1A-20260912-231843`

Nenhum mod foi apagado: os mods fora do recorte foram renomeados com o sufixo `.disabled`, e o manifesto do CurseForge foi atualizado de forma correspondente.
