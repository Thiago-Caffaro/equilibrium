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

## Checagem oficial inicial — cidade e comércio

| Candidato | Plataforma e licença observadas | Limites técnicos e de design | Parecer desta etapa |
| --- | --- | --- | --- |
| **MineColonies** | A página oficial de distribuição lista uma variante NeoForge 1.21.1; o repositório oficial é GPL-3.0. A distribuição também lista Structurize, Multi-Piston, BlockUI e Domum Ornamentum como componentes do conjunto. | O escopo oficial inclui construção, trabalhadores, armazém e vários edifícios. Isso confirma que não é apenas decoração: pode alterar produção, logística, combate e carga de entidades. A existência do JAR 1.21.1 não prova compatibilidade com nosso NeoForge 21.1.249 nem comportamento aceitável para o servidor. | **Investigar, alta complexidade.** Não adicionar antes de um inventário do JAR alvo, uma política de limites de colônia/NPC e uma pergunta de desempenho definida. |
| **Goblin Traders** | A página oficial de arquivos tem release NeoForge para 1.21.1; o repositório atual e a página do projeto informam licença MIT. Para versões 1.20.1+, o projeto declara a dependência Framework. | O mod cria traders subterrâneos no Overworld e no Nether, com trocas especiais, e fornece suporte oficial para substituí-las por datapack. Isso torna o conteúdo ajustável, mas também permite que uma tabela mal escolhida contorne progressão e recompensas de Aventura. | **Investigar, alto risco de gate.** Primeiro auditar dados de trade no JAR 1.21.1; só depois decidir se uma troca limitada agrega valor além de villager trading e loot. |

Fontes primárias: [MineColonies no CurseForge](https://www.curseforge.com/minecraft/mc-mods/minecolonies), [repositório MineColonies](https://github.com/ldtteam/minecolonies), [downloads oficiais MineColonies](https://www.minecolonies.com/downloads/), [arquivos Goblin Traders 1.21.1](https://www.curseforge.com/minecraft/mc-mods/goblin-traders/files/all?page=1&pageSize=20&version=1.21.1) e [repositório Goblin Traders](https://github.com/MrCrayfish/GoblinTraders). Licenças ou conteúdo de JARs de referência antigos não são usados como substitutos para o artefato alvo.

## Productive Bees — revisão estática de risco

O FTB Evolution contém Productive Bees 13.13.5 para NeoForge 1.21.1, um script KubeJS curto para uma receita de upgrade e uma configuração local extensa. A leitura não foi usada para reaproveitar valores; ela apenas revela os eixos que uma avaliação do Equilibrium teria de controlar.

| Fato observado na referência | Implicação para Equilibrium |
| --- | --- |
| A configuração permite simular visitas de abelhas dentro da colmeia e também expõe upgrades de produtividade com multiplicadores crescentes. | A simulação pode reduzir entidades, mas não limita a escala econômica; custo de servidor e abundância são decisões distintas. |
| Há parâmetros para incubação, reprodução, centrífugas, geração por mel, atributos e worldgen de ninhos. | O sistema atravessa produção, energia, reprodução e geração de mundo — amplo demais para ser incluído apenas como “agricultura”. |
| Tags/scripts do FTB bloqueiam abelhas em spawners e duplicadores de mobs, e uma configuração de AE2 protege os ovos configuráveis contra correspondência simplista por item. | A própria referência reconhece rotas de duplicação/automação que exigem proteção. Essas barreiras devem ser tratadas como uma hipótese de segurança econômica, não como valores a copiar. |
| A questline contém recompensas que podem entregar gaiolas, ovos configuráveis, centrífugas e upgrades. | Recompensas ou lojas podem pular a curva inteira; o Equilibrium não pode avaliar o mod sem auditar também entradas alternativas. |

**Decisão de pesquisa:** Productive Bees não avança para shortlist. A primeira decisão necessária é uma política abstrata de recursos renováveis: quais categorias podem ser renováveis, em qual janela e quais materiais jamais podem ser obtidos por essa rota. Só depois vale inspecionar o JAR alvo, propor um experimento isolado ou discutir configurações.

## Aventura — mapa estático de famílias

| Família | Evidência local 1.21.1 | Padrão útil ou risco | Estado |
| --- | --- | --- | --- |
| **Dimensão com progressão** — Twilight Forest | O JAR de referência declara NeoForge 21.1.62+; E9E contém ajustes de portal, loot e materiais do mod cruzando outros sistemas. | Pode oferecer uma cadeia de descoberta e materiais de gate; o risco é adicionar uma dimensão antes de decidir a função de seus bosses e recompensas. | Pesquisa |
| **Bosses com materiais de gate** — L_Ender's Cataclysm | O JAR 1.21.1 local declara NeoForge 21.1.x; um script de FTB usa materiais do mod na entrada de um gate alto. | É uma demonstração de “Aventura fornece autoridade material”, não um modelo para copiar. Bosses e loot exigem uma matriz própria. | Pesquisa de alto impacto |
| **Encontros repetíveis** — Gateways To Eternity | O JAR exige NeoForge 21.1.187+; a questline mede uma quantidade de gates derrotados. | Pode apoiar objetivos coletivos/eventos, mas precisa de limite de repetição para não criar uma fonte infinita de loot. | Pesquisa de alto risco |
| **Estruturas direcionadas** — When Dungeons Arise | A questline usa estruturas específicas como objetivos de exploração. | A finalidade de uma estrutura pode ser legível sem torná-la um gerador de recursos. Porém o metadado do JAR local usa uma faixa de Minecraft com limite superior ambíguo para 1.21.1. | Bloqueado por plataforma |
| **Dungeons genéricas** — Dungeon Crawl e outras coleções | Dungeon Crawl possui JAR NeoForge 1.21.x; FTB/Cisco acumulam várias famílias de dungeon e estrutura. | Quantidade não é progresso: empilhar geradores reduz legibilidade e pode criar custo de worldgen sem função. | Pesquisa de alto risco |

### Limite de licença e distribuição

Os JARs locais declaram licenças diferentes: Twilight Forest LGPL-2.1, Gateways MIT, Dungeon Crawl GPL-3.0, Cataclysm com código LGPL-3.0 mas assets reservados, e When Dungeons Arise com todos os direitos reservados. Isso não impede avaliá-los ou distribuí-los conforme a licença do próprio modpack, mas proíbe usar esta auditoria como autorização para copiar código, scripts, assets, estruturas ou dados. Qualquer integração futura exige nova verificação da licença do artefato exato.

## Próxima sequência objetiva

1. Obter e inspecionar localmente os JARs-alvo, em instância descartável, de MineColonies e Goblin Traders; registrar ranges, dependências, configs e dados de trade sem ainda iniciar Minecraft.
2. Ler uma cadeia inicial e uma de teto de Productive Bees ou Trees para identificar a primeira fonte de abundância; não montar uma instância ainda.
3. Decidir por revisão humana quais duas famílias de Aventura justificam investigação de dados mais profunda; manter as demais como risco conhecido, não como backlog de instalação.
4. Só promover candidatos a fichas do Avaliador após essa triagem. Um teste manual será justificado apenas para multiplayer, desempenho ou comportamento que os arquivos não revelem.
