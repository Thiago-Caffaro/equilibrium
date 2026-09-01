# Equilíbrio do Mundo

> Parte da **Baseline Conceitual v0.2**.

## 1. Visão geral

O Equilíbrio é um estado persistente da campanha e a segunda grande mecânica própria do projeto. Ele representa quão saudável, representado e coeso está o conjunto dos quatro pilares do mundo.

Não é uma medição de quem está conectado naquele instante e não é sinônimo de progresso. O mundo possui memória, acompanha jogadores considerados ativos e reage à composição e à evolução do grupo ao longo do tempo.

O núcleo conceitual foi considerado fechado. O que permanece em aberto é principalmente fórmula, ritmo, conteúdo de eventos e balanceamento.

## 2. Roster persistente de jogadores ativos

### Decisões fechadas

- O Equilíbrio pertence ao mundo/servidor, não à sessão atual.
- Jogadores não precisam estar online naquele momento para contar.
- O servidor faz uma verificação periódica dos últimos logins.
- Um jogador que abandona a campanha não deve contar eternamente.
- O intervalo foi descrito apenas como “a cada X horas”; X não foi definido.
- O tempo necessário para um jogador ser classificado como inativo não foi definido.

Quando um jogador escolhe sua divisão, ela passa a ser reconhecida imediatamente. A proposta de exigir progresso inicial para estabilizar uma divisão foi rejeitada implicitamente pela resposta “ao ser escolhida”.

Isso significa que contas alternativas poderiam, em tese, registrar divisões sem desenvolvê-las. O risco foi levantado, mas nenhuma proteção adicional foi decidida. A escolha imediata continua sendo o estado vigente.

## 3. Distribuição populacional

O mundo calcula a proporção real dos jogadores ativos em cada divisão.

Exemplo:

```text
4 jogadores ativos

Magia        3 → 75%
Tecnologia   1 → 25%
Aventura     0 →  0%
Comerciantes 0 →  0%
```

A distribuição teórica mais simétrica é:

```text
25% / 25% / 25% / 25%
```

Ela não é uma exigência. Uma campanha com 50% em Magia e 16,7% em cada uma das outras divisões pode ser saudável e plenamente jogável, porém um pouco inclinada para Magia.

Essa decisão substituiu a sugestão anterior de que bastaria ter um representante de cada divisão e de que quantidade não deveria afetar o Equilíbrio.

## 4. Coesão interna das divisões

A coesão interna mede quão próximos estão os níveis dos jogadores que pertencem à mesma divisão. Ela deve ter impacto maior do que a simples diferença entre divisões.

```text
MAGIA
I, I, I
→ coesão excelente

MAGIA
IV, IV, IV
→ coesão excelente

MAGIA
IV, IV, IV, I
→ coesão péssima
```

Uma equipe coesa de nível I pode oferecer a mesma qualidade de estabilidade que uma equipe coesa de nível IV. Maestria alta não significa automaticamente mais estabilidade; proximidade interna é o fator central.

A contribuição de uma divisão pode percorrer estados conceituais como:

```text
muito positiva
positiva
neutra
insignificante
negativa
```

Foi confirmado que desigualdade interna elevada pode gerar pontos negativos e piorar ativamente o mundo.

O cálculo futuro deverá considerar:

- diferença entre os níveis dos integrantes;
- quantidade de jogadores na divisão;
- quantidade total de jogadores ativos;
- contribuição resultante da equipe para a estabilidade geral.

Não existe fórmula aprovada.

## 5. Diferença entre divisões

Divisões internamente coesas ainda podem estar em estágios muito diferentes:

```text
Magia        IV, IV
Tecnologia   II, II
Aventura      I, I
Comerciantes III, III
```

Essa discrepância também gera instabilidade, mas com peso mais moderado do que uma divisão internamente fragmentada.

```text
desigualdade dentro da divisão
→ impacto alto

desigualdade entre divisões
→ impacto moderado
```

O sistema não deve transformar isso em uma trava rígida que proíba alguém de avançar antes das quatro divisões. O mundo reage à disparidade; ele não impede o progresso.

## 6. Componentes conceituais do Equilíbrio

O estado geral reflete simultaneamente:

1. distribuição dos jogadores entre as quatro divisões;
2. coesão de progressão dentro de cada divisão;
3. diferença de progresso entre as divisões;
4. tempo durante o qual uma divisão permanece ausente;
5. deterioração acumulada e estado das rupturas;
6. penalidades de insígnias inativas pertencentes aos integrantes da divisão.

O Progresso do Mundo participa do escalonamento de eventos e shards, mas é exibido como eixo separado e não deve ser confundido com a saúde do mundo.

## 7. Desequilíbrio geral e origens de ruptura

**Desequilíbrio geral** é a redução da saúde do mundo por qualquer fator confirmado do Equilíbrio: distribuição populacional, baixa coesão interna, diferença entre divisões ou ausência prolongada.

**Ruptura** é uma manifestação agravada do desequilíbrio, capaz de alimentar eventos, fragmentos e shards. A ausência continua sendo uma origem própria e claramente reconhecível de ruptura, mas deixou de ser a única origem confirmada.

Portanto:

```text
baixa coesão ou grande disparidade
→ reduz o Equilíbrio
→ pode gerar contribuição negativa
→ quando severa, também pode acionar eventos de ruptura

divisão ausente
→ reduz o Equilíbrio
→ inicia e alimenta a ruptura daquela ausência
→ permite a cadeia de eventos, fragmentos e shards
```

A equivalência não é automática. Uma composição como IV e I não foi declarada necessariamente severa, enquanto um exemplo como IV, IV e I já pode atingir o grau necessário. Esses exemplos não constituem fórmula: o limiar, o peso do tamanho da equipe, a intensidade da ruptura e a categoria de eventos permanecem em aberto.

Portanto, a distinção vigente é:

- qualquer baixa coesão ou disparidade pertinente contribui para o **desequilíbrio geral**;
- somente desigualdade interna suficientemente severa aciona a rota de **ruptura por disparidade**;
- uma divisão não representada alimenta uma **ruptura por ausência**, com identidade ligada ao pilar ausente.

As duas origens podem compartilhar a linguagem geral de eventos e shards, mas não devem ser tratadas como causas idênticas. Seus cálculos e manifestações ainda podem ser diferentes.

## 8. Ausência e rupturas

Uma divisão ausente não provoca catástrofe imediata. A ruptura correspondente cresce com o tempo.

```text
ausência recente
→ deterioração pequena

ausência prolongada
→ ruptura moderada

ausência persistente
→ ruptura crítica
```

Várias rupturas podem existir e avançar simultaneamente. Uma campanha composta apenas por magos pode acumular rupturas de Tecnologia, Aventura e Comerciantes ao mesmo tempo.

A recuperação depois que um representante aparece foi sugerida como processo gradual, preservando a memória do mundo. O usuário confirmou a degradação progressiva durante a ausência, mas não decidiu explicitamente se a recuperação também será gradual ou qual será sua velocidade. Essa parte permanece em aberto.

## 9. Consequências distintas por divisão

Foi confirmado que ausências diferentes devem produzir consequências globalmente diferentes, e não apenas quatro variações de “aparece um boss”.

As manifestações abaixo são possibilidades temáticas, não conteúdo fechado.

### Magia ausente

- corrupção ou vazio arcano;
- anomalias mágicas;
- criaturas anti-mágicas;
- versões corrompidas de inimigos ou bosses de mods mágicos.

### Aventura ausente

- ameaças não enfrentadas crescem;
- raids, expedições inimigas e invasões;
- monstros e bosses chegam até os jogadores;
- perigos de estruturas ou dimensões transbordam para o mundo comum.

### Tecnologia ausente

- entropia ou instabilidade mecânica;
- construtos abandonados;
- máquinas antigas ou autômatos hostis;
- anomalias elétricas e estruturas tecnológicas.

### Comerciantes ausentes

- crise de prosperidade;
- escassez, pragas ou impacto em cultivos;
- animais, ecossistemas ou produção afetados;
- vilas, caravanas, cidades e comércio em crise;
- bandidos, saqueadores ou acontecimentos sociais.

As formas exatas, nomes e efeitos ainda dependem da lore e da modlist.

### Conteúdo dos próprios mods como matéria-prima

O usuário sugeriu que o projeto não precise criar do zero todos os modelos, animações, sons e inteligências de bosses. Eventos poderiam reutilizar criaturas e bosses dos mods selecionados, aplicando contexto de ruptura, fortalecimento e drops próprios. Um exemplo levantado foi uma versão corrompida de conteúdo de Ars Nouveau durante uma ruptura de Magia.

Essa direção também cria um critério de seleção de mods: além de sua progressão normal, um candidato pode ser avaliado pelo conteúdo que oferece ao sistema de eventos.

O reaproveitamento é uma estratégia conceitual proposta, não uma lista aprovada de criaturas. Permissões, compatibilidade, balanceamento, drops e forma de transformação permanecem em aberto. Também foi sugerido que determinados bosses de ruptura forneçam somente a chance de fragmentos, sem seus drops normais, mas isso ainda não foi fechado como regra universal.

## 10. Campanha estável e campanha caótica

Equilíbrio alto não é “jogar certo” e Equilíbrio baixo não é automaticamente fracasso.

```text
CAMPANHA COOPERATIVA
divisões coesas e representadas
→ maior estabilidade
→ progressão mais previsível

CAMPANHA CAÓTICA
ausências e disparidades deliberadas
→ Equilíbrio reduzido
→ ausências e disparidades severas podem alimentar rupturas
→ eventos, perigo crescente e oportunidades ligadas a essas rupturas
```

Um jogador ou grupo pode avançar agressivamente e aceitar a queda de estabilidade. Também foi confirmada a possibilidade de provocar caos temporariamente por estruturas, rituais ou ações que prejudiquem os pontos da própria divisão ou de outra divisão. Esse caminho pode ser usado para forçar condições de ruptura e buscar seus fragmentos.

A existência dessa estratégia está fechada; mecanismo, custo, duração, alvo, limites e proteções contra abuso permanecem em aberto.

Essa escolha é uma característica de rejogabilidade: a mesma modlist pode produzir campanhas muito diferentes conforme a composição do grupo.

## 11. Shards temporários

Shards evitam hard-lock quando uma divisão necessária está ausente e fazem parte da recompensa excepcional das rupturas.

Eventos podem fornecer fragmentos raros ou difíceis. Esses fragmentos permitem criar um shard que substitui temporariamente a autoridade da insígnia correspondente em um ponto de controle.

```text
INSÍGNIA
especialista real
permanente
reutilizável

SHARD
compensação artificial
consumível
substitui autoridade em gates compatíveis
difícil e perigoso de obter
```

### Decisões fechadas

- O shard substitui a autoridade de uma insígnia em crafting quando a divisão necessária está ausente.
- O shard também pode autorizar outros gates importantes, como portais, invocações e rituais.
- O shard é consumível; sua autoridade não é permanente.
- Ele não concede maestria permanente.
- Ele foi concebido como solução excepcional para autoridade ausente e também pode integrar recompensas de rupturas por disparidade severa; a correspondência exata entre origem da ruptura e categoria do shard permanece em aberto.
- Shards avançados podem existir em campanhas avançadas.
- A ausência e outras rupturas podem ser exploradas deliberadamente para tentar obter shards.
- O custo esperado dessa estratégia é tempo, perigo e repetição dos eventos.

Ainda não foram definidos quais gates fora de crafting aceitarão shards, quanto será consumido em cada um deles ou se cada categoria de shard terá um alcance próprio.

### Salvaguardas propostas, ainda não confirmadas

Foi sugerido que shards não sejam automatizáveis, não venham de spawners ou sistemas virtuais de mobs e exijam participação real em eventos. Também foi sugerido aumentar progressivamente o custo de compensar uma ausência repetidas vezes.

Essas proteções são coerentes com o problema original, mas não receberam decisão explícita. Elas permanecem em aberto.

## 12. World Progress

O Progresso do Mundo responde a uma pergunta diferente:

> Até onde a campanha chegou coletivamente?

A opção escolhida foi representar as quatro divisões por quatro cores ou identidades, usando o progresso médio de cada uma.

```text
PROGRESSO DO MUNDO

Magia        ███████████████░
Tecnologia   ████████████░░░░
Aventura     █████████░░░░░░░
Comerciantes ███████████░░░░░
```

Isso evita que o jogador mais avançado sozinho eleve todo o mundo ao seu patamar.

World Progress é usado conceitualmente para escalar a categoria dos eventos e permitir shards adequados ao estágio da campanha. Uma divisão ausente em uma campanha avançada não precisa ficar eternamente limitada a shards iniciais.

Ainda não estão definidos a fórmula de cada média, o layout, um possível percentual agregado nem o tratamento visual de uma divisão ausente. A decisão conceitual exige que as quatro divisões estejam representadas; ela não determina como uma parcela ausente será desenhada.

## 13. Dois eixos independentes

Exemplos conceituais sem presumir um percentual agregado de World Progress:

```text
World Progress: quatro divisões em estágios iniciais
Equilíbrio: 96%
→ campanha inicial e coesa

World Progress: quatro divisões em estágios avançados
Equilíbrio: 91%
→ campanha avançada e coordenada

World Progress: divisões majoritariamente avançadas
Equilíbrio: 23%
→ campanha avançada e caótica
```

As barras devem comunicar estados diferentes. A ideia de um indicador permanente na interface foi apresentada pelo usuário; posição, formato, quantidade de elementos e linguagem visual ainda não foram planejados.

## 14. Incentivo social

Se uma divisão possui jogadores IV, IV, IV e I, a resposta ótima não é necessariamente avançar o primeiro grupo ao próximo nível. Ajudar o jogador I melhora a coesão de todos.

O sistema deve comunicar a responsabilidade como estado da divisão, não como culpa individual. Em vez de acusar um novato de “destruir o mundo”, a apresentação pode dizer que o pilar está fragmentado. Essa recomendação de linguagem não é uma regra confirmada, mas protege o objetivo multiplayer do projeto.

## 15. Pontos de balanceamento ainda em aberto

- peso da distribuição populacional;
- peso da coesão interna;
- peso da diferença entre divisões;
- fórmula da contribuição negativa;
- valor e comportamento da penalidade causada por insígnias inativas;
- intervalo da verificação de atividade;
- tempo até um jogador ser inativo;
- velocidade de deterioração;
- comportamento e velocidade de recuperação;
- limiar que transforma disparidade interna em ruptura e sua relação com o tamanho da divisão;
- diferenças entre rupturas por ausência e por disparidade severa;
- mecanismos, custos, duração e limites para provocar caos deliberadamente;
- thresholds e categorias de eventos;
- frequência dos eventos;
- eventos específicos de cada ruptura;
- chance e quantidade de fragmentos;
- quantidade necessária para cada shard;
- regras anti-automação e anti-farm;
- fórmula do World Progress;
- layout e possível percentual agregado do World Progress;
- tratamento visual de divisões ausentes;
- interface e posicionamento das barras.
