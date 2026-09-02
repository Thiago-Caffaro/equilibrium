# Seleção de mods e uso de modpacks de referência

> Parte da **Baseline Conceitual v0.2**.

## 1. Decisão vigente sobre a base

A conversa percorreu duas direções.

### Direção inicial — substituída

O Enigmatica 9: Expert foi inicialmente recomendado como base direta por já possuir integração entre magia, tecnologia, exploração, quests, configurações e progressão. A avaliação chegou a favorecer o uso real do E9E 1.19.2.

### Direção final — decisão fechada

Depois que divisões, insígnias e maestria se tornaram o núcleo do projeto, essa escolha foi revista. O modpack será construído com identidade própria. E9E, E6E, packs modernos e o pack anterior serão usados somente como fontes de análise e inspiração.

O GitHub do projeto deverá mencionar essas referências e outras que venham a ser estudadas.

## 2. Como usar referências

Uma referência não fornece automaticamente uma decisão. Para cada solução encontrada em outro pack, o processo conceitual é:

```text
observar
→ identificar a função
→ entender por que funciona
→ comparar com nosso design
→ adaptar a ideia, se fizer sentido
```

Não se deve presumir que a existência de um repositório público autoriza copiar scripts, configurações, quests, lore ou assets. Permissões e licenças devem ser verificadas caso qualquer material seja incorporado ou o pack seja distribuído.

## 3. Papel de cada referência discutida

### Seleção inicial de fontes para a primeira rodada

Esta é uma decisão de pesquisa, não uma seleção de mods, versão ou loader. A primeira rodada terá sete fontes, cada uma estudada por um papel diferente:

| Referência | Papel na rodada |
|---|---|
| Enigmatica 9: Expert | Referência principal para integração expert, gates e pacing. |
| Enigmatica 6: Expert | Contraste histórico de integração expert clássica. |
| Enigmatica 10 | Catálogo contemporâneo e ecossistema moderno em NeoForge. |
| FTB Evolution | Comparação com uma composição moderna e ampla de sistemas. |
| All the Mods 10 | Anti-referência para amplitude, redundâncias e rotas sobrepostas. |
| Cisco's Fantasy Medieval RPG [Ultimate] | Referência especializada para aventura, bosses, dimensões e cooperação de combate. |
| Modpack anterior do grupo | Evidência prática de rotas que escalaram cedo, redundâncias e conteúdo realmente usado. |

O avaliador de mods contém uma ficha de referência para cada uma delas. Nenhum mod presente nesses packs passa a integrar o Equilibrium por constar nessa seleção.

### Enigmatica 9: Expert

Referência principal para:

- catálogo de candidatos;
- integração entre mods;
- classificação de gates e receitas;
- pacing de um expert pack curado;
- uso de bosses e recursos como etapas;
- observação de como sistemas diferentes parecem parte do mesmo jogo.

Ele não define nossa versão, progressão, tiers, quests, lore, worldgen ou receitas.

### Enigmatica 6: Expert

Referência para um desenho expert mais clássico e fortemente interligado. Pode ensinar integração e pacing, mas sua geração de Minecraft não é uma escolha implícita para o projeto.

### Enigmatica 10 e outros packs modernos

Referências para observar o ecossistema moderno, alternativas atuais e quais conceitos antigos receberam novas implementações. Não são bases automáticas.

### FTB Evolution

Foi considerado como possível base moderna antes da revisão. Continua útil para comparar uma seleção contemporânea de tecnologia, magia e exploração e para observar os custos de partir de um pack de natureza mais “kitchen sink”.

### ATM10

Foi descartado como base principal. Seu valor é comparativo: mostra a amplitude do ecossistema e os riscos de começar com centenas de mods e depois tentar remover redundâncias, resolver worldgen, receitas e exploits.

### Modpack anterior do grupo

É a evidência concreta do problema. Deve ser auditado para identificar:

- sistemas que escalaram cedo demais;
- redundâncias;
- mods realmente divertidos que merecem reavaliação;
- combinações que removeram escassez;
- custo de worldgen;
- conteúdos usados versus conteúdos instalados e ignorados.

### Referências futuras

Outros expert packs, packs modernos e projetos especializados poderão ser adicionados. A lista permanece aberta e deve ser documentada no repositório.

## 4. Quatro maneiras de estudar um pack

### 4.1 Catálogo de mods

Pergunta central:

> Qual função este mod desempenha nessa composição e existe essa função em nosso design?

### 4.2 Integração

Observar como magia, tecnologia, aventura e economia se conectam. O objetivo é aprender a fazer mods parecerem partes do mesmo jogo, sem copiar necessariamente a solução usada.

### 4.3 Pacing

Registrar quando sistemas aparecem, quando se tornam poderosos, quanto tempo existe entre patamares e quais gargalos mudam a fase da campanha.

### 4.4 Tipos de receita e gate

Classificar alterações encontradas como:

- gate de acesso;
- integração entre mods;
- consumo significativo de recursos;
- pacing;
- coerência temática;
- prevenção de exploit.

Essa classificação ajuda a separar design intencional de grind pelo grind.

## 5. Processo de seleção

Não existe modlist final. Cada candidato deve receber uma ficha que responda, no mínimo:

| Campo | Pergunta |
|---|---|
| Função | Que papel único cumpre? |
| Divisão | A qual especialização pertence principalmente? |
| Entrada | Em que parte da progressão começa? |
| Teto | Até onde participa? |
| Escala | Quanto multiplica recursos, energia ou poder? |
| Sobreposição | Quais outros mods resolvem o mesmo problema? |
| Dependência | Como exige contribuições externas? |
| Worldgen | O que gera e quanto isso custa? |
| Eventos | Pode fornecer conteúdo útil às rupturas? |
| Risco | Como pode quebrar a progressão? |
| Decisão | Manter, revisar, limitar ou remover? |

O número total de mods não foi decidido. A conversa citou aproximadamente 25–40 mods principais apenas como ordem de grandeza para encontrar a interseção de versões, não como meta aprovada para a instância inteira.

## 6. Candidatos discutidos

Todos os nomes abaixo são candidatos ou exemplos. Nenhum integra a modlist final por decisão fechada.

### Tecnologia

- **Create:** automação mecânica inicial ou intermediária.
- **Mekanism:** indústria, processamento, química e tecnologia avançada.
- **Applied Energistics 2:** armazenamento, logística e autocrafting.
- **Industrial Foregoing:** candidato de alto risco por sobrepor automação geral; precisa justificar sistemas únicos.
- **Thermal, Immersive Engineering e PneumaticCraft:** citados como sistemas a comparar por sobreposição e função.

### Magia

- **Ars Nouveau:** magia geral, utilidade e automação mágica.
- **Occultism:** rituais, invocações, armazenamento e automação de natureza mágica.
- **Iron's Spells:** possibilidade, não seleção.
- **Forbidden & Arcanus:** possibilidade citada, não seleção.

### Aventura

- **Twilight Forest:** candidato forte por progressão de dimensão e bosses.
- **Cataclysm:** citado como exemplo de conteúdo de bosses, não seleção.
- Outros mods de estruturas, artefatos e dimensões ainda serão avaliados.

### Comerciantes

- **Farmer's Delight:** exemplo recorrente de conteúdo alimentar com progressão.
- Sistemas de pesca, criação, cidades, comércio e decoração ainda não foram selecionados.

### Automação de recursos e endgame

- **Mystical Agriculture:** candidato possível somente com rebalanceamento profundo e entrada posterior. Seus altares também foram citados como referência inicial para imaginar uma ascensão de maestria focada em consumo de itens; isso não confirma o mod nem a adoção literal de seu altar.
- **Hostile Neural Networks, Mob Grinding Utils e RFTools Builder:** exemplos de sistemas que precisam ser avaliados pelo momento em que removem limitações.
- **Draconic Evolution, Allthemodium e Re-Avaritia:** exemplos de escaladas extremas presentes no pack anterior; sua presença futura não foi aprovada. O Chaos Dragon foi citado apenas como referência para bosses de pós-progressão capazes de enfrentar jogadores extremamente poderosos.

### Questline, conquistas e registro

Ferramentas de quests ou achievements poderão orientar cada divisão, registrar feitos e tornar os atos visíveis. Elas são uma categoria funcional a selecionar, não uma escolha de mod já tomada. Na direção vigente, a questline participa de orientação e registro; ela não foi definida como origem obrigatória dos desbloqueios.

## 7. Exemplos não são seleções

Três referências recentes merecem proteção explícita contra interpretação indevida:

- altares de Mystical Agriculture são uma referência para a experiência de ascensão;
- Chaos Dragon é uma referência de escala para desafios extremos;
- ferramentas de quests e conquistas são candidatas para orientação e verificação.

Nenhuma dessas menções confirma o mod correspondente, sua versão, suas receitas ou sua posição na progressão. A seleção continua dependente da matriz de funções, sobreposições, worldgen e compatibilidade.

## 8. Diagnóstico do pack anterior

A lista antiga mostrou várias rotas fortes empilhadas:

- Mekanism;
- Industrial Foregoing;
- Mystical Agriculture;
- Hostile Neural Networks;
- Mob Grinding Utils;
- RFTools Builder;
- Modular Routers;
- Pipez;
- Powah;
- Flux Networks;
- Applied Energistics 2;
- Create e vários complementos;
- Draconic Evolution;
- Allthemodium;
- Re-Avaritia.

O diagnóstico não afirma que esses mods são ruins. Ele mostra que muitas soluções simultâneas para recursos, energia, transporte e automação reduzem cedo demais a importância da escassez e do restante do grupo.

## 9. Versão do Minecraft e loader

Nenhuma versão foi escolhida.

A ordem conceitual estabelecida é:

```text
definir o design
→ selecionar os mods centrais desejados
→ comparar a interseção de versões
→ escolher Minecraft e loader
```

1.19.2 com o ecossistema do E9E e 1.21.1 com um ecossistema moderno foram alternativas discutidas. A decisão posterior de usar E9E somente como referência removeu a principal razão para ficar preso ao 1.19.2, mas não escolheu automaticamente 1.21.1.

## 10. Critério obrigatório: função

Todo mod deve responder:

> Por que este mod existe neste pack?

Respostas insuficientes:

- porque é popular;
- porque estava no pack anterior;
- porque estava no E9E;
- porque o servidor consegue rodar;
- porque adiciona mais conteúdo.

Respostas úteis descrevem um papel, um estágio, uma relação com divisões e uma razão para não usar outra solução já presente.

## 11. Pontos em aberto

- lista final de referências;
- metodologia prática e profundidade da análise de pacing;
- versão e loader;
- modlist e dependências;
- quantidade de mods principais;
- matriz final de papéis;
- critérios quantitativos de escala e desempenho;
- decisões por candidato citado;
- ferramenta de quests, conquistas e registro;
- política de uso de código/configuração de referências;
- forma exata de atribuição no GitHub;
- intenção de publicação e exigências de licença.
