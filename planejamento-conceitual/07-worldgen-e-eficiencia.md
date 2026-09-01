# Worldgen e eficiência

> Parte da **Baseline Conceitual v0.2**.

## 1. Lição do pack anterior

O usuário identificou o worldgen como um erro importante do pack anterior. Vários sistemas de terreno, biomas, estruturas e dimensões foram combinados porque individualmente pareciam interessantes, mas o conjunto aumentou custo e complexidade.

Entre os exemplos observados na lista antiga e citados durante a análise estão:

- Lithosphere;
- Tectonic;
- Oh The Biomes We've Gone;
- Oh The Trees You'll Grow;
- Towns and Towers;
- Create Structures Arise;
- Luki's Grand Capitals;
- Incendium;
- Nullscape;
- Twilight Forest;
- The Undergarden.

A presença na lista não significa que todos causaram problemas isoladamente. O problema é acumular transformações e conteúdos de geração sem uma função clara e sem avaliar o custo combinado.

## 2. Decisão conceitual

Worldgen será seletivo. Terreno, biomas, estruturas e dimensões precisam justificar sua existência na progressão, na identidade ou na experiência de exploração.

O servidor local robusto permite conteúdo ambicioso, mas não elimina:

- picos ao gerar chunks;
- custo de seis jogadores explorando em direções diferentes;
- aumento permanente do tamanho do mundo;
- interações e conflitos entre geradores;
- estruturas redundantes;
- dificuldade de encontrar conteúdo específico em um mundo excessivamente diluído;
- manutenção de configurações e atualizações.

Eficiência é uma escolha de design, não apenas uma reação à falta de hardware.

## 3. Meta de composição

Foi proposta uma composição aproximada:

```text
1 sistema principal de terreno
+
0–1 sistema grande de biomas
+
alguns sistemas de estruturas escolhidos deliberadamente
+
dimensões com função concreta na progressão
```

O item que pedia confirmação explícita da filosofia minimalista não foi respondido. Ainda assim, a preocupação original do usuário e toda a análise posterior estabelecem que o worldgen deve ser muito mais conservador.

O número acima deve ser tratado como **alvo de trabalho**, não limite fechado.

## 4. Critérios para terreno e biomas

Antes de incluir um modificador de terreno ou grande pacote de biomas, é necessário responder:

- Qual identidade visual ele cria?
- Ele substitui ou entra em conflito com outro sistema?
- Melhora a navegação e a exploração ou apenas aumenta variedade?
- Dilui estruturas e recursos importantes?
- Seu custo aparece somente na geração ou também durante o jogo?
- A experiência continua coerente no Nether, End e demais dimensões?
- A versão escolhida possui estabilidade suficiente?

Beleza visual, sozinha, não fecha a decisão.

## 5. Critérios para estruturas

Estruturas devem ter função reconhecível, por exemplo:

- marcos de Aventura;
- locais de bosses;
- fontes controladas de materiais que não podem ser fabricados cedo;
- etapas de maestria;
- assentamentos relevantes para Comerciantes;
- ambientes usados por eventos de ruptura;
- elementos de lore.

Vários mods que adicionam cidades, torres ou dungeons semelhantes podem competir pelo mesmo espaço de design. O pack deve preferir um conjunto pequeno e deliberado a uma densidade sem hierarquia.

## 6. Critérios para dimensões

Uma dimensão deve responder:

- O que a campanha aprende ou conquista ali?
- Quem é responsável por sua progressão?
- Que materiais ou bosses únicos oferece?
- Como as outras divisões dependem desse conteúdo?
- Ela continua relevante depois da primeira visita?
- Seu custo de geração é proporcional ao valor entregue?

Dimensões com progressão clara, como a função imaginada para Twilight Forest, podem justificar custo alto. Dimensões adicionadas apenas por variedade têm prioridade menor.

## 7. Eficiência além do worldgen

O custo do pack não depende somente do número de mods. Sistemas que executam muitas operações, carregam chunks, criam entidades, mantêm redes ou automatizam milhares de itens também precisam ser avaliados.

A matriz futura de mods deverá incluir pelo menos:

- impacto em geração;
- impacto contínuo no servidor;
- quantidade esperada de entidades e máquinas;
- necessidade de chunks carregados;
- sobreposição com outras redes e automações;
- valor real entregue à progressão.

Não foram definidos limites, métricas ou ferramentas de benchmark.

## 8. Relação com Aventura e Equilíbrio

Worldgen seletivo não significa exploração pequena. Pelo contrário, menos sistemas podem receber mais função.

Estruturas, dimensões e bosses escolhidos podem servir simultaneamente como:

- conteúdo da divisão de Aventura;
- gates de outras divisões;
- fontes de materiais de maestria;
- palcos de eventos de ruptura;
- elementos da lore;
- marcos do World Progress.

Essa reutilização aumenta densidade de significado sem exigir densidade descontrolada de geração.

### Proposta de dimensão de prova

Foi proposta para a ascensão avançada de Aventura uma dimensão própria, deliberadamente vazia ou controlada, na qual o grupo enfrentaria rodadas de bosses já vencidos, agora fortalecidos. Ela poderia funcionar como uma prova coletiva — possivelmente em uma transição avançada de maestria — sem depender de uma nova dimensão aberta e repleta de geração permanente.

A natureza coletiva da prova de Aventura está confirmada. A dimensão, a sequência de bosses, o tier em que aparece e suas regras continuam como proposta não confirmada. Caso seja adotada, deverá ser avaliada como conteúdo funcional de progressão, e não como exceção à filosofia seletiva de worldgen.

## 9. Pré-geração

A pré-geração de uma região antes da abertura do servidor foi sugerida como forma de deslocar parte do custo de exploração para uma etapa controlada. Trata-se de uma opção operacional futura, não de uma decisão conceitual e não substitui a necessidade de worldgen seletivo.

## 10. Pontos em aberto

- sistema principal de terreno;
- presença e quantidade de mods de biomas;
- lista de estruturas;
- lista de dimensões;
- adoção ou não da dimensão de prova coletiva de Aventura;
- densidade e distribuição de conteúdo;
- orçamento de geração;
- critérios quantitativos de desempenho;
- política de chunks carregados;
- tamanho de eventual região pré-gerada;
- relação exata entre estruturas, maestria e rupturas;
- requisitos mínimos de servidor e cliente;
- processo de benchmark e teste de exploração multiplayer.
