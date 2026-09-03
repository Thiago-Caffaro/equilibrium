# Protocolo de análise de modpacks de referência

> Processo operacional de pesquisa. Não adiciona decisões de design à **Baseline Conceitual v0.2**.

## 1. Objetivo

Os modpacks selecionados serão estudados para encontrar candidatos, padrões de integração, riscos de sobreposição e lições de pacing. Não é necessário completar uma campanha, copiar receitas ou testar todos os mods.

O resultado desejado de cada referência é uma lista pequena e justificada de:

- mods que merecem ficha própria;
- sistemas ou gates que merecem investigação;
- riscos que o Equilibrium deve evitar;
- hipóteses que precisam de teste curto no jogo.

O processo termina em evidência para decisão, não em uma modlist herdada.

## 2. Regra de esforço

Use a sequência abaixo:

```text
arquivos do pack
→ mapa funcional
→ leitura dirigida de configs, scripts e quests
→ ficha de candidato
→ teste curto apenas quando necessário
```

Jogo ativo é a última etapa, não a primeira. Um teste no jogo só é aberto para responder uma pergunta concreta que os arquivos não resolvem, como comportamento multiplayer, desempenho, crédito de boss, sensação de combate ou uma interação aparentemente ambígua.

## 3. Preparação por referência

Para cada pack baixado, criar uma pasta de evidências fora da instalação original e registrar na ficha de **Referência**:

| Dado | Registrar |
|---|---|
| Identidade | nome do pack, versão do pack, Minecraft e loader |
| Origem | URL, release/commit e data de obtenção |
| Conteúdo | `mods/`, lista de mods e dependências relevantes |
| Customização | scripts KubeJS/CraftTweaker, datapacks, configs, quests e arquivos de documentação |
| Escopo | por que ele está sendo estudado e quais divisões/sistemas interessam |

Nunca editar a cópia original do pack. Arquivos de análise, planilhas exportadas e anotações pertencem ao repositório do Equilibrium, não à instalação de terceiros.

## 4. Fase A — inventário automático e leitura estrutural

Antes de abrir o Minecraft, levantar:

1. nomes e versões dos mods em `mods/`;
2. scripts, recipes customizadas, tags e datapacks;
3. arquivos de quests, capítulos e recompensas;
4. configs que alterem geração, drops, receitas, limites, performance ou progressão;
5. lista de dimensões, worldgen e estruturas quando declarada pelos próprios arquivos.

O inventário não deve virar uma ficha para cada mod. Ele serve para criar uma fila filtrada pelos quatro grupos abaixo:

| Grupo | Pergunta de triagem |
|---|---|
| Sistemas centrais | Ele sustenta uma divisão, uma economia ou uma etapa de progressão? |
| Gates | Ele controla acesso a recursos, máquinas, rituais, bosses, portais ou automação? |
| Escala e risco | Ele multiplica recursos, energia, mobilidade, loot, mobs ou logística? |
| Conteúdo de Aventura | Ele fornece bosses, dimensões, estruturas, troféus ou materiais exclusivos? |

Mods puramente cosméticos, bibliotecas e qualidade de vida ficam no inventário, mas não consomem uma ficha crítica a menos que afetem desempenho ou alguma regra do pack.

## 5. Fase B — mapa funcional do pack

Em vez de seguir a ordem do modlist, classificar os sistemas por função:

| Função | Evidência a procurar |
|---|---|
| Recursos | minérios, cultivo, quarry, mob drops, dimensões de recurso, processamento |
| Energia | geração inicial, escala intermediária, escala extrema, transporte |
| Logística | armazenamento, redes, autocrafting, roteamento, transporte de itens/fluidos |
| Magia | rituais, automação mágica, mobilidade, materiais de gate, combate |
| Aventura | estruturas, bosses, chaves, troféus, dimensões, artefatos |
| Comerciantes | agricultura, pesca, criação, vilas, comércio, cidades e decoração com progressão |
| Worldgen | terreno, biomas, estruturas, dimensões, densidade e impacto potencial |

Para cada função, responder primeiro: **quantas soluções concorrentes o pack oferece?** A comparação mais valiosa não é “qual mod existe”, mas “quantos mods removem a mesma limitação e em que momento”.

## 6. Fase C — leitura dirigida de progressão

Ler somente os arquivos que respondem às perguntas de progressão:

1. Quais componentes bloqueiam máquinas, rituais, automação, bosses e portais importantes?
2. Que recursos são exigidos de outros sistemas?
3. Existem fontes alternativas que contornam o gate?
4. Que etapa libera abundância, duplicação, geração virtual de mobs, quarry ou autocrafting?
5. Há recompensa de quest, loja ou loot que pule uma cadeia inteira?

Cada descoberta deve receber uma destas classificações, já adotadas para o planejamento:

- gate de acesso;
- integração entre mods;
- consumo significativo de recursos;
- pacing;
- coerência temática;
- prevenção de exploit;
- grind sem função identificada.

Não seguir todas as receitas em cadeia. Acompanhar apenas receitas de teto: a primeira máquina de escala, o componente mais alto de cada linha, a chave de portal, o summon de boss e o primeiro item que automatiza uma limitação antes manual.

## 7. Fase D — extração de candidatos

Um mod só recebe ficha no Avaliador quando passar por pelo menos uma destas condições:

- cumpre papel único ou aparentemente único;
- é uma alternativa forte a um candidato já existente;
- cria um gate ou uma dependência interessante;
- ameaça escassez, automação ou relevância de outra divisão;
- adiciona worldgen, dimensão, boss ou estrutura com função concreta;
- possui evidência prática do grupo que não pode ser substituída por pesquisa externa.

Na ficha, distinguir sempre:

| Tipo de afirmação | Como registrar |
|---|---|
| Fato observado em arquivo | versão do pack, receita, config, mod dependente, texto de quest |
| Evidência prática | teste do grupo, campanha anterior, comportamento multiplayer |
| Hipótese de integração | possível divisão, gate ou uso futuro no Equilibrium |
| Decisão | somente depois de comparação e revisão humana |

## 8. Fase E — testes curtos e deliberados

Criar uma instância ou mundo de teste separado apenas quando houver uma pergunta sem resposta. Cada teste deve começar com uma frase verificável, por exemplo:

```text
"Dois jogadores recebem crédito pela derrota deste boss?"
"Esta estrutura continua rara e legível junto do nosso candidato de worldgen?"
"Esta máquina consegue automatizar o recurso antes do domínio convencional?"
```

Tipos de teste prioritários:

- boss/dimensão em multiplayer, inclusive crédito, loot e retorno;
- automação que pode antecipar uma limitação;
- geração em três ou mais seeds representativas;
- desempenho com entidades, farms e chunks carregados;
- interação entre dois mods candidatos que pareça perigosa;
- configuração necessária para manter o sistema no estágio correto.

Um teste deve produzir um resultado registrado: **confirmado**, **rejeitado**, **depende de configuração** ou **exige investigação adicional**. Exploração livre sem pergunta pode ser divertida, mas não entra no orçamento de análise.

## 9. Ordem da primeira rodada

| Ordem | Referência | Produto esperado |
|---:|---|---|
| 1 | Modpack anterior do grupo | mapa de redundâncias e de rotas que destruíram escassez na prática |
| 2 | Enigmatica 9: Expert | mapa de gates e candidatos de integração expert |
| 3 | Enigmatica 6: Expert | comparação histórica de pacing e dependências |
| 4 | Enigmatica 10 | catálogo de candidatos modernos e disponibilidade de ecossistema |
| 5 | FTB Evolution | comparação de sistemas modernos e soluções concorrentes |
| 6 | ATM10 | lista de riscos por amplitude, escala e sobreposição |
| 7 | Cisco's Fantasy Medieval RPG | candidatos e padrões específicos de Aventura |

As rodadas 1 e 2 devem acontecer primeiro. Só depois de comparar seus resultados faz sentido investir tempo nos packs modernos.

## 10. Entregáveis mínimos por pack

Uma referência está suficientemente estudada para esta fase quando possuir:

- ficha de referência preenchida e revisada;
- inventário preservado ou linkado;
- até 10–20 mods encaminhados para ficha, não centenas;
- lista de sobreposições e exclusões candidatas;
- 3–10 gates ou padrões relevantes classificados;
- lista curta de testes que realmente precisam ser feitos no jogo;
- decisão de estado: **Analisada**, **Prioridade para aprofundamento** ou **Arquivada**.

## 11. O que não concluir nesta etapa

Esta auditoria não fecha:

- versão do Minecraft ou loader;
- presença de qualquer mod na modlist final;
- tiers, receitas ou custos;
- eventos, rupturas e shards específicos;
- design de maestria;
- quantidade de atos;
- regras quantitativas de desempenho.

Ela apenas reduz incerteza e produz uma matriz de candidatos com evidência suficiente para a próxima etapa: **mod × função × divisão × estágio × sobreposição × risco**.
