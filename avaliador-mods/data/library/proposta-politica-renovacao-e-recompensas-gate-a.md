# Proposta de política para renovação, entidades e recompensas — Gate A

> **Estado:** proposta para revisão humana. Não é uma decisão da Baseline, não seleciona mods e não autoriza receitas, configs, datapacks, KubeJS ou alterações no Equilibrium Core.
>
> **Objetivo:** permitir que o Gate A compare candidatos que escalam recursos, capturam entidades ou repetem encontros sem reabrir a mesma discussão para cada mod.
>
> **Escopo de planejamento:** este texto prepara decisões para AB-060, AB-061, AB-062 e AB-063. Ele também limita a avaliação de fronteiras e outputs de Comerciantes (AB-025 e AB-026), futuros tiers (AB-030 e AB-031), matriz de papéis (AB-133) e sistemas únicos de mods redundantes (AB-135). AB-130, a modlist final, continua aberto.

## 1. Premissas já fechadas que a proposta respeita

Esta proposta não altera as decisões conceituais já confirmadas:

- **Automation Follows Mastery:** a automação completa vem depois de o grupo demonstrar domínio convencional do conteúdo correspondente.
- O primeiro nível de maestria é independente; nos níveis altos, a rota normal reúne contribuições das três outras divisões.
- Pontos de controle são a regra geral de gating. Uso direto de insígnia em receita ordinária é exceção justificada, não ferramenta de rotina.
- Quests orientam e registram; elas não são hoje a autoridade automática de um desbloqueio.
- Produção extrema é recompensa possível de endgame, acompanhada por desafios igualmente relevantes.
- Shards são compensação consumível para autoridade ausente. Não concedem maestria permanente.

A política deve impedir que uma rota de volume substitua antecipadamente uma dessas provas. Ela não deve impedir que o endgame tenha produção ampla depois de a campanha merecê-la.

## 2. Princípio proposto: autoridade não é volume

Toda saída avaliável deve receber **duas classificações independentes**:

1. **Autoridade:** ela prova descoberta, risco, vitória, acesso, maestria ou a presença de uma divisão?
2. **Volume:** depois da prova, o grupo precisa dela em quantidade para construir, consumir ou escalar?

Uma mesma família de itens pode conter os dois papéis. Por exemplo, um material comum de uma dimensão pode ganhar rota renovável tardia, enquanto o troféu, a chave ou o componente que demonstra a primeira vitória continua ligado ao feito original.

```text
feito ou descoberta convencional
          ↓
prova de domínio / ponto de controle
          ↓
autoridade permanece escassa e rastreável
          ↓
volume elegível recebe automação na janela adequada
```

O teste decisivo não é “o mod consegue produzir?”. É: **qual limitação esta rota remove, qual feito ela pode apagar e em que momento isso deixa de ser um problema?**

## 3. Classes propostas de saída

| Classe | Descrição | Política proposta | Exemplos conceituais, não itens aprovados |
| --- | --- | --- | --- |
| **A — autoridade de progresso** | Item, drop, acesso ou estado que prova uma primeira conquista, descoberta ou maestria. | Nunca se torna produção passiva, simulação ou troca repetível equivalente. Pode continuar vindo de um desafio convencional repetível, se o desafio conservar risco e significado. | Troféu de boss, chave de portal, primeiro artefato de estrutura, prova de ascensão, autoridade de insígnia. |
| **B — recurso escasso com prova prévia** | Material que precisa existir em massa mais tarde, mas cuja obtenção inicial sustenta exploração ou um marco de divisão. | Renovação somente depois da prova vinculada à divisão responsável e de um ponto de controle que registre a janela. Para tiers altos, o gate normal deve aceitar contribuições cruzadas. | Material dimensional após a primeira expedição válida; minério especial após o marco técnico/aventura correspondente. |
| **C — commodity de produção** | Insumo rotineiro de construção, alimento, cadeia urbana ou processamento que não carrega autoridade por si só. | Pode receber automação depois do domínio de sua atividade original, com taxa, custo, energia, espaço e desempenho avaliados no protótipo. | Culturas, alimentos processados, materiais de construção, insumos industriais comuns. |
| **D — recompensa de evento e compensação** | Recompensa ligada a ruptura, evento, ausência de divisão ou repetição excepcional. | Não pode equivaler a maestria nem servir como fonte passiva de autoridade. Shards seguem consumíveis; frequência, quantidade, anti-farm e gates aceitos continuam decisões futuras. | Fragmentos e shards; recompensas de eventos de ruptura. |

Classificar uma saída como B ou C não a libera imediatamente. Ela apenas diz que uma rota de volume poderá ser considerada quando houver uma prova e uma janela de progressão explícitas.

## 4. Renovação e automação por tipo de sistema

### 4.1 Farms, seeds, abelhas, mineradores e quarries

Propõe-se o seguinte filtro comum para qualquer sistema que gere itens sem a atividade convencional original:

- uma rota é **inaceitável** se consegue entregar classe A, ou se entrega classe B antes da prova que a torna elegível;
- uma rota de classe B só é candidata depois de descoberta, obtenção convencional e ponto de controle; o primeiro acesso ao material não pode depender da rota renovável;
- uma rota de classe C pode ser antecipada em relação ao volume B, mas não antes de demonstrar o gameplay que ela substitui;
- custo de entrada, throughput, energia, espaço, requisitos de logística, configurações e impacto de desempenho devem ser comparados entre alternativas, não presumidos pelo nome do mod;
- endgame pode remover o teto quantitativo de B e C, mas não converte A em um subproduto automático.

Isso mantém abertas as escolhas de implementação. Uma seed, colmeia, minerador ritual, quarry ou máquina industrial não é proibido por sua forma; sua elegibilidade depende da classe da saída e de sua janela.

### 4.2 Captura, reprodução e simulação de entidades

Propõe-se separar entidades pelo que seu ciclo representa:

| Tipo de entidade | Política proposta |
| --- | --- |
| Boss, evento, invasão, prova coletiva ou encontro que concede autoridade | Não elegível para captura, clonagem, simulação ou farm passiva. A repetição só pode ocorrer pelo encontro desenhado para isso, preservando seus riscos e regras de recompensa. |
| Criatura cujo drop é classe B | Pode ser avaliada depois de a divisão responsável dominar o encontro e depois de uma decisão sobre seu throughput; nenhum método pode pular a descoberta ou a primeira vitória. |
| Criatura comum e seus materiais de classe C | Pode ser automatizada na janela de sua atividade original, desde que não crie rota lateral para autoridade, exploração ou materiais de gate. |
| Entidade com papel híbrido ou ambíguo | Fica bloqueada até que a ficha separe explicitamente drops de autoridade, recursos escassos e commodities. |

Capture não deve ser tratada como simples qualidade de vida. Ela pode apagar exploração, combate, risco de evento ou a necessidade de uma divisão inteira. A decisão deve analisar a entidade, os drops e a janela — não apenas a ferramenta de captura.

### 4.3 Comércio, cidades e trocas de NPC

Sistemas comerciais podem renovar **valor econômico**, mas não devem vender autoridade. A proposta é proibir em tabelas recorrentes:

- classe A;
- primeiro acesso a classe B;
- chave, troféu, item de prova, componente de ascensão ou equivalente de shard;
- item que contorne diretamente um gate de outra divisão.

Trocas podem servir para commodities, conversões com perda, especialidades comerciais e materiais B somente quando o gate já foi cumprido. Caso um mod permita configurar trades por datapack, a tabela passa a ser dado de balanceamento auditável, não uma autoridade paralela.

Para cidades, trabalhadores e cadeias urbanas, a pergunta é a mesma: a produção representa prosperidade e organização de Comerciantes ou substitui mineração, boss, magia ou tecnologia antes de seus marcos? O primeiro caso pode ser candidato; o segundo requer bloqueio, gate tardio ou descarte.

### 4.4 Encontros e recompensas repetíveis

Uma atividade pode ser repetível sem ser uma fonte infinita de progresso. Propõe-se separar três camadas:

| Camada | Regra proposta |
| --- | --- |
| **Crédito/prova** | Primeira conclusão registra a prova relevante; conclusões posteriores não duplicam a mesma autoridade. |
| **Loot de volume** | Pode repetir se pertencer a B ou C e se sua taxa estiver na janela da campanha. O loot não deve reabrir o primeiro gate. |
| **Recompensa excepcional** | Fragmentos, shards e equivalentes mantêm condição de evento, perigo e consumo; frequência, proteção anti-farm e escalonamento continuam pendentes de protótipo. |

Essa separação torna sistemas de encontros repetíveis avaliáveis sem decidir antecipadamente se um candidato será usado. Também evita usar uma quest como trava secreta: se houver crédito, ele precisa ser representado pelo ponto de controle ou pelo mecanismo de autoridade aprovado, e a quest apenas explica ou registra.

## 5. Consequências imediatas para a matriz do Gate A

| Linha em pesquisa | Consequência desta proposta se for ratificada |
| --- | --- |
| Productive Bees | Continua bloqueado até mapear cada output como A, B, C ou D. Simulação de colmeia não torna automaticamente segura uma saída de classe A ou B precoce. |
| Occultism: mineradores e soul gems | Continua bloqueado até classificar saídas e entidades. Mineradores não podem fornecer autoridade nem primeira descoberta; captura precisa obedecer à seção 4.2. |
| Gateways To Eternity | Pode ser estudado pelo modelo crédito/prova + loot de volume + recompensa excepcional. Antes disso, uma tabela de recompensa repetível não é testável com critério. |
| MineColonies e Goblin Traders | Devem ser avaliados como prosperidade urbana e comércio controlado; não como fontes genéricas de materiais de gate. A auditoria de workers ou trades precisa listar exceções A/B. |
| Create, Ars Nouveau, IE, AE2 e Mekanism | Cada automação deve declarar a atividade substituída e a classe de suas saídas. Nenhuma rota recebe aval apenas por ser tecnológica ou mágica. |
| Farmer's Delight, Slice & Dice e Some Assembly Required | Alimento e processamento de classe C podem ter automação após a demonstração do loop original; isso não estabelece ainda a janela concreta nem outputs exclusivos de Comerciantes. |

## 6. Uso proposto de pontos de controle e exceções

O ponto de controle é a forma normal de tornar uma rota B ou C elegível. Ele deve documentar:

1. a atividade convencional que foi dominada;
2. a divisão responsável;
3. a classe de saída liberada;
4. a janela/tier e, se aplicável, as contribuições cruzadas;
5. qual rota de automação, trade, cidade ou encontro passa a ser válida.

Uso direto de insígnia numa receita só é uma exceção candidata quando todas as condições abaixo forem verdadeiras:

- a autoridade precisa ser visível no próprio objeto, e não apenas em seu acesso;
- um ponto de controle reutilizável permitiria burlar um limite relevante;
- a exigência não transforma receitas ordinárias em repetição burocrática;
- existe justificativa de progressão registrada na ficha do candidato.

Se uma dessas condições não for verdadeira, o design deve preferir o ponto de controle. Esta é uma regra de avaliação, não a lista final de exceções de AB-063.

## 7. Decisões que esta proposta pede para ratificar

Para fechar a política sem selecionar a modlist, a revisão humana precisa decidir apenas estas afirmações de alto nível:

1. **Autoridade de progresso não vira saída passiva, trade repetível equivalente ou simulação.**
2. **Recursos escassos só ficam renováveis depois de descoberta, obtenção convencional e ponto de controle da divisão responsável.**
3. **Sistemas de captura e encontro repetível separam prova única, loot de volume e recompensa excepcional.**
4. **Mods de cidade, comércio, magia e tecnologia não podem contornar a autoridade de outra divisão apenas por oferecerem a mesma saída.**

Uma ratificação dessas quatro frases permite tirar Productive Bees, mineradores rituais, trades especiais e Gateways da categoria “bloqueado por política” para investigação **delimitada**. Ela não aprova nenhum candidato, nenhum valor numérico, nenhum tier nem qualquer receita.

## 8. O que permanece deliberadamente em aberto

- lista concreta de itens e entidades em A, B, C ou D;
- qual mod ou rota realiza uma automação elegível;
- quantidade de tiers, nomes de atos, custo, taxa, energia, espaço e throughput;
- gates que aceitam shards, quantidade consumida e regras anti-farm;
- primeira comparação profunda entre famílias de Aventura, Tecnologia e Magia;
- modlist, ferramenta de quests, configurações e implementação no Core/KubeJS.

## 9. Próximo passo após ratificação

Atualizar a matriz Gate A com a classificação A/B/C/D e investigar somente as incógnitas que a classificação expõe:

1. uma saída de alto risco por Productive Bees ou minerador ritual;
2. uma entidade/ciclo de captura com drops híbridos;
3. uma tabela de trade especial;
4. uma tabela de recompensa de encontro repetível;
5. uma rota de automação de alimento ou recurso comum como controle de baixo risco.

Cada investigação deve registrar a saída, a atividade substituída, a prova necessária, a versão exata do candidato e a menor verificação que possa refutar a hipótese. Não se abre um mundo de teste só para confirmar que um mod “funciona”.

## Referências locais

- `planejamento-conceitual/05-progressao-e-automacao.md` — Automation Follows Mastery, interdependência, pontos de controle e escassez.
- `planejamento-conceitual/04-equilibrio-do-mundo.md` — rupturas, shards e eventos.
- `planejamento-conceitual/09-decisoes-em-aberto.md` — AB-025, AB-026, AB-030, AB-031, AB-060 a AB-063, AB-130, AB-133 e AB-135.
- `planejamento-conceitual/10-registro-de-decisoes.md` — decisões fechadas e propostas que ainda não são decisões.
- `matriz-candidatos-gate-a.md` — candidatos e riscos que motivam a política.
