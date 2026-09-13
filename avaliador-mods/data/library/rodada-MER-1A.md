# Rodada MER-1A — Base fixa + Create isolado

**Estado:** primeira execução concluída; base aprovada provisoriamente para continuidade

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

## Resultado observado — 13/09/2026

O primeiro teste jogável foi concluído com sucesso na máquina principal do projeto.

### Desempenho

- Referência anterior, sem o conjunto atual de otimização: aproximadamente **110 FPS**, com muito stuttering.
- Resultado com a base atualmente habilitada: aproximadamente **400 FPS**.
- A captura registrada durante o teste mostra **441 FPS** naquele instante.
- Ganho bruto relatado: cerca de **3,6 vezes** em relação à referência de 110 FPS.
- Até esta execução, nenhum mod de otimização apresentou impacto negativo perceptível que justificasse sua remoção.

Esses números são evidência da máquina de teste, e não um benchmark universal. Comparações futuras deverão anotar distância de renderização, resolução, limite de FPS, local do mundo, tempo de aquecimento, shaders e atividade de geração de chunks para tornar os resultados comparáveis.

### Compatibilidade e experiência

- **EMI Loot:** funcionando normalmente com Create.
- **Aggro Indicator:** avaliação inicial positiva; foi considerado agradável durante o uso.
- **DarkZoom — RPG Simplest Zoom:** adicionado manualmente à base em teste.
- **Borderless:** adicionado manualmente para suporte a janela sem bordas.
- O mundo abriu, permitiu travessia entre Overworld e Nether e encerrou salvando todas as dimensões.
- Não foi observado crash de inicialização, hard-lock ou corrupção de save nesta execução.

### Estado ativo observado após o teste

No momento do inventário posterior à execução, a pasta continha **47 JARs ativos**. Além dos 30 mods do recorte preparado originalmente, estavam ativos:

1. Borderless
2. Cinematic Respawn
3. Cloth Config API
4. DarkZoom — RPG Simplest Zoom
5. EMI Loot
6. FancyMenu
7. Fast Async World Save
8. Fzzy Config
9. GuideME
10. Konkrete
11. Melody
12. Memory Settings
13. Not Enough Animations
14. Silent Lib
15. Simple Discord Rich Presence
16. Smooth Chunk Save
17. Towers of the Wild: Modded

Esta lista representa o estado efetivamente encontrado na pasta após as alterações manuais, não uma aprovação conceitual individual de todos esses mods.

### Pontos técnicos para acompanhar

- O log registrou uma exceção de interface do **FancyMenu** ao inicializar ou redimensionar uma tela. Ela não derrubou a sessão, mas deve ser reproduzida e identificada antes de considerar o mod tecnicamente aprovado.
- **Fast Async World Save** e **Smooth Chunk Save** estavam simultaneamente ativos. A execução terminou salvando corretamente, mas um teste curto em singleplayer não basta para concluir que a combinação é benéfica ou livre de concorrência em servidor.
- O ModernFix registrou que suprimiu eventos de montagem de Strider que poderiam causar deadlock. Isso aparece como atuação defensiva do mod, não como falha observável da sessão.
- Houve timeouts de serviços Mojang, Realms e verificações externas. Eles são falhas de conectividade e não foram atribuídos ao conjunto de mods.

## Decisões provisórias produzidas pelo teste

- Manter o conjunto atual de otimização na base de testes enquanto não surgir regressão concreta.
- Manter EMI Loot habilitado para as próximas avaliações com Create.
- Manter Aggro Indicator na base candidata de qualidade de vida.
- Incorporar DarkZoom e Borderless ao grupo de utilidades candidatas, ainda sujeitos a testes de atalhos, interface e compatibilidade.
- Não considerar os demais mods ativos automaticamente aprovados apenas por terem participado desta execução.
