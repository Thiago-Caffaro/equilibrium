# Gate A — triagem moderna de Comerciantes e Aventura

> Data da leitura: 14/09/2026.
> Método: nomes e metadados de JARs locais nas referências E10, FTB Evolution e Cisco's Fantasy Medieval RPG [Ultimate]. Esta triagem cria uma fila de investigação; não instala, aprova ou configura mods.

## Por que este recorte veio agora

O primeiro mapa Gate A confirmou que Tecnologia tem muitas rotas concorrentes e que Comerciantes estava reduzido a alimento. A próxima coleta precisa procurar funções ainda ausentes — cidade, comércio, criação e Aventura cooperativa — sem transformar qualquer mod de uma referência em seleção automática.

## Fatos de inventário

| Referência | Sinal observado | Leitura inicial | Limite |
| --- | --- | --- | --- |
| **E10** — 1.21.1 / NeoForge | Farmer's Delight, Cooking for Blockheads, Productive Trees, Right Click Harvest, Create e integrações de Ars/Occultism. | Confirma que uma referência moderna mantém alimentação, cozinha e cultivo como um ecossistema próprio. | Não apareceu, por nome de JAR, um sistema inequívoco de cidade/mercado que resolva a lacuna de Comerciantes. É uma constatação de inventário, não uma avaliação do conteúdo completo. |
| **FTB Evolution** — 1.21.1 / NeoForge | Farmer's Delight, Applied Cooking, Auto Chef's Delight, Beer, Productive Bees, Productive Trees, Create e muitas extensões; Cataclysm, Gateways, Dungeon Crawl e Dungeons Arise. | É útil como anti-referência para observar como automação e extensões de comida podem se multiplicar; também contém famílias de Aventura e worldgen. | A coexistência não revela prioridade, custo ou qualidade. O número de addons aconselha comparar funções antes de adicionar integração. |
| **Cisco** — 1.19.2 / Forge | MineColonies, Better With MineColonies, TownTalk, StyleColonies, Goblin Traders, Farmers Delight e addons de comida; Cataclysm, Twilight Forest, Gateways, Progressive Bosses e várias famílias de dungeons/estruturas. | É a fonte mais promissora para investigar cidade/comércio e o papel cooperativo de Aventura. | Não fornece evidência de disponibilidade NeoForge 1.21.1, custo de servidor ou adequação ao Equilibrium. |

## Fila de funções, não lista de mods

| Família a investigar | Fontes locais | Possível papel no Equilibrium | Risco principal | Próxima evidência mínima | Estado |
| --- | --- | --- | --- | --- | --- |
| **Assentamento/cidade** — MineColonies e integrações de cidade | Cisco | Candidata a representar desenvolvimento urbano e prosperidade para Comerciantes. | Uma cidade pode consumir desempenho, transformar o grupo em administração de NPCs ou invadir a identidade de Tecnologia. | Confirmar disponibilidade/licença 1.21.1 NeoForge; ler requisitos de servidor e uma cadeia de progressão de cidade. | Pesquisa |
| **Comércio e NPCs** — Goblin Traders / TownTalk | Cisco | Possível fonte para troca, reputação ou circulação de itens, sem concluir que será a economia do pack. | Trocas podem produzir ou duplicar recursos de gate; NPCs podem ter valor apenas decorativo. | Mapear o que cada sistema troca/autoriza e se há uma contribuição que o restante do grupo deseje. | Pesquisa |
| **Produção renovável** — Productive Bees e Productive Trees | E10 e FTB Evolution | Possíveis eixos de agricultura especializada ou materiais de comércio. | Risco alto de substituir mineração, exploração e agricultura manual por geração passiva. | Ler a primeira fonte de recurso renovável e o teto de automação; classificar a janela de abundância. | Pesquisa de alto risco |
| **Alimento e cozinha** — Farmer's Delight, Applied Cooking, Auto Chef's Delight, Beer e addons | E10, FTB Evolution e Cisco | Referência para cadeia alimentar e processamento; não para representar sozinha cidades/comércio. | Muitos addons podem oferecer várias saídas para a mesma cadeia ou automatizar produção cedo. | Limitar a comparação ao papel que alimento cumpre para o grupo e à fronteira com Create. | Pesquisa dependente |
| **Boss, dimensão e evento** — Twilight Forest, Cataclysm, Gateways e Progressive Bosses | FTB Evolution e Cisco | Fornecem exemplos de progressão de Aventura, prova coletiva e eventos de ruptura. | Estruturas/bosses redundantes, worldgen denso e loot que contorna gates. | Fazer mapa boss → acesso → material → recompensa → risco de worldgen antes de qualquer teste. | Pesquisa |
| **Estruturas e dungeons** — Dungeon Crawl, Dungeons Arise, Dungeons Enhanced, Towns and Towers e afins | FTB Evolution e Cisco | Podem sustentar descoberta e cidades no mundo. | Empilhamento de geradores de estrutura torna o mundo ruidoso, caro e pouco legível. | Contar famílias por função e selecionar apenas estruturas com gate, lore ou recompensa concreta. | Pesquisa de alto risco |

## Resultado que muda o planejamento

1. **Há uma pista concreta para a lacuna urbana:** MineColonies e seus complementos existem em uma referência de Aventura/medieval, enquanto E10/FTB Evolution oferecem principalmente evidência de comida e produção. A investigação de cidade deve começar pelo sistema urbano, não por adicionar outro addon culinário.
2. **Comércio é uma hipótese separada de cidade:** Goblin Traders/TownTalk podem orientar pesquisa de trocas e NPCs, mas não provam uma economia saudável. O primeiro filtro será “produz uma saída desejada e controlável sem criar fonte alternativa de recurso de gate?”.
3. **Produção renovável merece a mesma cautela de automação industrial:** Productive Bees/Trees têm função plausível de Comerciantes, mas podem quebrar escassez. Por isso entram em pesquisa de alto risco, não na shortlist.
4. **Aventura tem material demais, não de menos:** Cisco e FTB reúnem múltiplas famílias de boss/dungeon/estrutura. O trabalho não é procurar mais conteúdo; é escolher quais recompensas e mundos têm função única.

## Próxima sequência objetiva

1. Verificar nos dados oficiais e no JAR exato a variante 1.21.1 NeoForge de **um** sistema urbano e **um** sistema de comércio; registrar licença, dependências, worldgen e carga esperada.
2. Ler uma cadeia inicial e uma de teto de Productive Bees ou Trees para identificar a primeira fonte de abundância; não montar uma instância ainda.
3. Criar a tabela de Aventura com no máximo cinco famílias de conteúdo, uma linha por função de boss/dimensão/estrutura, antes de comparar mods individuais.
4. Só promover candidatos a fichas do Avaliador após essa triagem. Um teste manual será justificado apenas para multiplayer, desempenho ou comportamento que os arquivos não revelem.
