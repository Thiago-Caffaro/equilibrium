# Questões e decisões em aberto

> Parte da **Baseline Conceitual v0.2**. Este é o inventário ativo de incertezas do projeto.

## 1. Como usar este documento

Uma questão aparece aqui somente quando ainda existe uma escolha real a fazer. Decisões já fechadas ficam nos documentos temáticos; ideias antigas substituídas permanecem no [registro de decisões](10-registro-de-decisoes.md).

Cada pendência possui:

- **ponto aberto:** o que ainda não foi decidido;
- **estado e observação:** tudo que já limita a decisão, para evitar reabrir premissas fechadas;
- **motivo:** por que não é seguro decidir agora;
- **necessário para fechar:** informação, análise ou escolha que permitirá concluir o ponto.

Os IDs são estáveis. Quando uma decisão for fechada, seu ID deve ser citado no registro histórico e removido da lista ativa.

## 2. Identidade, escopo e apresentação

| ID | Ponto aberto | Estado e observação | Por que permanece aberto | Necessário para fechar |
|---|---|---|---|---|
| AB-001 | Nome definitivo do modpack | “Equilibrium” funciona como nome de trabalho e expressa a mecânica central, mas não foi formalizado como título final. | A lore, a identidade visual e a disponibilidade do nome ainda não foram avaliadas. | Definir lore-base, pesquisar colisões de nome e escolher o título público. |
| AB-002 | Subtítulo e descrição curta | O propósito social e a frase central estão fechados. | Falta saber o tom público do projeto. | Definir público, forma de distribuição e linguagem de apresentação. |
| AB-003 | Lore do Equilíbrio, das divisões e das rupturas | Os sistemas possuem funções claras, mas nomes como “pilar”, “ruptura” e “shard” ainda são funcionais. | A narrativa não foi planejada. | Escrever e aprovar a premissa de mundo antes de nomear elementos. |
| AB-004 | Terminologia final | “Insígnia”, “maestria”, “Equilíbrio”, “World Progress”, “ruptura”, “fragmento” e “shard” são termos vigentes de projeto. | Ainda podem mudar por coerência de lore e tradução. | Aprovar o glossário depois da lore-base. |
| AB-005 | Identidade visual das quatro divisões | Quatro cores/identidades são obrigatórias no World Progress. | Paleta, símbolos e acessibilidade não foram desenhados. | Produzir propostas visuais e testar legibilidade, inclusive para daltonismo. |

## 3. Plataforma e escopo técnico futuro

| ID | Ponto aberto | Estado e observação | Por que permanece aberto | Necessário para fechar |
|---|---|---|---|---|
| AB-010 | Versão do Minecraft | E9E/E6E e packs modernos são referências, não bases. 1.19.2 e 1.21.1 foram exemplos. | A escolha depende da interseção da modlist. | Selecionar os mods centrais e comparar versões suportadas. |
| AB-011 | Loader | Nenhum loader foi escolhido. | Depende dos mods centrais e da versão. | Fechar candidatos indispensáveis e avaliar compatibilidade. |
| AB-012 | Forma de distribuição | Servidor privado, pack distribuível e publicação pública têm exigências diferentes. | O destino público não foi decidido. | Definir intenção de lançamento, atualização e suporte. |
| AB-013 | Licenças e atribuições | As referências deverão ser citadas no repositório. | A lista de materiais realmente reutilizados ainda não existe. | Auditar licenças quando scripts, configurações ou assets forem selecionados. |
| AB-014 | Escopo das integrações próprias | Há disposição para receitas, configurações e sistemas customizados. | A quantidade de trabalho depende da modlist e do protótipo. | Mapear lacunas que não podem ser resolvidas por configuração existente. |

## 4. Divisões e respecialização

| ID | Ponto aberto | Estado e observação | Por que permanece aberto | Necessário para fechar |
|---|---|---|---|---|
| AB-020 | Nomes finais das divisões | Magia, Tecnologia, Aventura e Comerciantes são nomes funcionais vigentes. | A lore e a identidade visual ainda não existem. | Fechar lore e glossário. |
| AB-021 | Processo excepcional de respecialização | A troca apaga/reinicia a maestria abandonada; não há progresso anterior utilizável. | Custo, espera, acesso e efeitos ainda não foram escolhidos. | Decidir frequência aceitável de troca e seu impacto social. |
| AB-022 | Tratamento da insígnia na respecialização | A propriedade antiga não pode preservar autoridade utilizável. | Falta definir transformação, retenção física e emissão da nova insígnia. | Projetar o processo de troca junto da lore e dos casos de recuperação. |
| AB-023 | Consequência da respecialização para o mundo | A mudança altera distribuição e coesão do roster. | Não há regra para transição ou carência. | Definir se a contribuição muda imediatamente ou após um período. |
| AB-024 | Habilidades ou passivas futuras | A divisão controla progressão e crafting; não é atualmente uma classe de atributos. | O projeto não proibiu para sempre efeitos temáticos não combativos. | Reavaliar somente após desenhar identidade e necessidades de cada divisão. |
| AB-025 | Fronteiras dos Comerciantes | Agricultura, pesca e vilas/cidades são eixos centrais; criação, culinária, comércio, prosperidade, decoração e construção são suporte. | Produção também pode pertencer à Tecnologia e estruturas à Aventura. | Distribuir mods e outputs concretos na matriz de funções. |
| AB-026 | Outputs exclusivos dos Comerciantes | A divisão progride por produção, crafting e desenvolvimento urbano. | Sem modlist, não se sabe quais resultados serão únicos e necessários. | Selecionar os sistemas comerciais e desenhar dependências cruzadas. |
| AB-027 | Subespecializações internas | Vários jogadores podem compartilhar uma divisão. | Não foi decidido se haverá papéis formais ou apenas divisão orgânica dos mods. | Avaliar tamanho real de cada divisão após a modlist. |
| AB-028 | Contas alternativas e divisões sem participação | A divisão passa a ser reconhecida ao ser escolhida. | Uma conta alternativa pode representar um pilar sem desenvolvê-lo. | Definir se o roster precisa de salvaguarda e qual evidência de atividade seria justa. |

## 5. Maestria, provas e ascensão

| ID | Ponto aberto | Estado e observação | Por que permanece aberto | Necessário para fechar |
|---|---|---|---|---|
| AB-030 | Quantidade de tiers de maestria | O primeiro tier é independente; I–IV foi apenas exemplo. | O tamanho depende das etapas reais dos mods. | Fechar a modlist e mapear suas transições naturais. |
| AB-031 | Critérios de cada tier | Ascensão exige domínio da própria divisão e, em tiers altos, contribuições das três outras. | Conteúdos e componentes ainda não foram escolhidos. | Construir a matriz mod × divisão × etapa × prova. |
| AB-032 | Forma e nome da estrutura universal de ascensão | Uma estrutura universal com variações visuais por divisão está confirmada. | Aparência e experiência ainda não foram desenhadas. | Fechar lore, identidade visual e limitações da plataforma. |
| AB-033 | Consumo e verificação na ascensão | Ambos serão combinados, com foco no consumo de itens; altares de Mystical Agriculture são somente referência. | Itens, proporções e verificações dependem dos mods. | Definir a modlist e prototipar uma ascensão por divisão. |
| AB-034 | Contribuições externas por tier | Tiers altos exigem as três outras divisões; o primeiro tier é independente. | Não se sabe em qual tier cada dependência começa nem sua intensidade. | Dividir a progressão e testar o ritmo multiplayer. |
| AB-035 | Formato da prova coletiva de Aventura | É a única prova de maestria confirmada como coletiva. Uma dimensão/arena de bosses fortalecidos é proposta. | Bosses, tiers e regras de crédito ainda não existem. | Selecionar conteúdo de Aventura e prototipar a prova. |
| AB-036 | Atribuição de crédito de bosses | Aventura progride predominantemente por feitos. | Cada mod registra participação de forma diferente. | Auditar os bosses escolhidos e decidir regra por categoria ou por mod. |
| AB-037 | Papel técnico-conceitual da questline nas verificações | Quests orientam e registram; não são hoje a fonte obrigatória de unlocks. | Ainda não se sabe o que cada mod expõe para verificação. | Selecionar ferramentas de quests/achievements e testar integração. |

## 6. Insígnias, desgaste e restauração

| ID | Ponto aberto | Estado e observação | Por que permanece aberto | Necessário para fechar |
|---|---|---|---|---|
| AB-040 | Nome do recurso de desgaste | Desgaste existe; “integridade”, “estabilidade” e “ressonância” foram exemplos. | Depende da lore e da linguagem visual. | Aprovar terminologia temática. |
| AB-041 | Fórmula de desgaste por empréstimo | Considera diferença de tier e importância da ação. Mesmo tier não adiciona desgaste de empréstimo. | Faltam escala, custos e ritmo de uso aceitável. | Catalogar gates e simular frequência real de empréstimos. |
| AB-042 | Craftings com desgaste intrínseco | Craftings-chave podem desgastar até a insígnia do dono. | A lista de craftings-chave ainda não existe. | Definir pontos de controle e classificar importância. |
| AB-043 | Acúmulo entre desgastes | Desgaste intrínseco e de empréstimo são causas distintas. | Não foi decidido como se somam, limitam ou escalam. | Prototipar casos de mesmo tier, grande diferença e ações de alta importância. |
| AB-044 | Nome do estado em zero | A insígnia permanece fisicamente presente, inativa e vinculada; “fraturada” é apenas candidato. | Falta lore. | Aprovar glossário. |
| AB-045 | Penalidade de Equilíbrio da insígnia inativa | A penalidade negativa à divisão está confirmada. | Valor, duração e possibilidade de acúmulo não foram balanceados. | Integrar a penalidade à futura fórmula do Equilíbrio. |
| AB-046 | Restauração temática de cada divisão | Cada divisão terá método próprio, difícil e potencialmente gradual. | Materiais, atividades e curvas dependem dos mods. | Selecionar sistemas de cada divisão e desenhar um loop de restauração. |
| AB-047 | Casos extremos de propriedade | Recuperação, containers, cópias simultâneas e devolução ao dono precisam preservar uma instância legítima. | São casos de especificação futura. | Criar uma matriz de estados antes da implementação. |
| AB-048 | Gates aceitos por autoridade emprestada | A autoridade pode alcançar crafting, portais, summons, equipamentos, blocos e interações pertinentes. | Nem todo gate deverá necessariamente aceitar empréstimo. | Catalogar gates da modlist e marcar políticas por gate. |

## 7. Progressão, automação, atos e endgame

| ID | Ponto aberto | Estado e observação | Por que permanece aberto | Necessário para fechar |
|---|---|---|---|---|
| AB-060 | Recursos que nunca serão automatizados | Automation Follows Mastery está confirmada. | Alguns recursos podem precisar permanecer ligados a feitos pessoais ou eventos. | Classificar recursos após a modlist. |
| AB-061 | Momento de quarries, farms virtuais e recursos cultiváveis | Devem vir após domínio correspondente. | O ponto exato depende de alternativas e sobreposição. | Mapear cada automação e a atividade que substitui. |
| AB-062 | Lista de pontos de controle | A filosofia de choke points está confirmada, com exceções justificadas. | Receitas e cadeias ainda não foram desenhadas. | Fechar modlist e criar grafo de dependências. |
| AB-063 | Regras das exceções aos pontos de controle | Insígnia pode aparecer diretamente em receitas ordinárias justificadas. | Falta um critério consistente para evitar repetição arbitrária. | Avaliar protótipos e formalizar critérios de uso direto. |
| AB-064 | Número e nomes dos atos | Atos existem e aparecem somente na questline; quatro não está confirmado. | Sem modlist não há etapas naturais suficientes para contar. | Dividir a progressão dos mods e identificar transições reais. |
| AB-065 | Duração e pacing | A estrutura social e o endgame estão definidos qualitativamente. | Não existem metas de duração. | Definir perfil do grupo e testar uma vertical slice. |
| AB-066 | Bosses como gates | Bosses e exploração devem manter Aventura relevante. | Bosses e drops ainda não foram selecionados. | Montar a matriz de conteúdo de Aventura. |
| AB-067 | Escala do endgame | Poder extremo e bosses extremos estão confirmados. | Valores, equipamentos e ameaças não foram escolhidos. | Selecionar candidatos e estabelecer metas de desafio. |
| AB-068 | Conteúdo pós-progressão | Chaos Dragon é referência, não confirmação de mod. | A lista de desafios sustentáveis ainda não existe. | Selecionar bosses e definir recompensas após a progressão principal. |
| AB-069 | Profundidade da questline | Haverá uma linha por divisão com interseções; sua função atual é orientação e registro. | Número de atos, mods e gates ainda são desconhecidos. | Fechar a estrutura de progressão e selecionar ferramenta de quests. |
| AB-070 | Possível ampliação futura do papel das quests | Hoje não são fonte obrigatória de unlocks. | O usuário respondeu “até então”, preservando possibilidade futura sem confirmá-la. | Reavaliar após protótipo de orientação e verificação. |

## 8. Equilíbrio, roster e caos deliberado

| ID | Ponto aberto | Estado e observação | Por que permanece aberto | Necessário para fechar |
|---|---|---|---|---|
| AB-080 | Intervalo de verificação dos últimos logins | O roster é persistente e atualizado periodicamente. | “A cada X horas” não recebeu valor. | Definir ritmo operacional e testar impacto. |
| AB-081 | Tempo até inatividade | Abandonos deixam de contar; ausências normais não devem punir. | Falta uma janela adequada ao grupo. | Escolher expectativa de frequência da campanha. |
| AB-082 | Administração manual do roster | Exceções serão inevitáveis. | Não há política para correções. | Definir autoridade administrativa e casos permitidos. |
| AB-083 | Peso da distribuição populacional | 25/25/25/25 é referência simétrica, não exigência. | Falta fórmula que funcione em grupos pequenos. | Simular composições de 4–8 jogadores. |
| AB-084 | Peso da coesão interna | É o fator de disparidade mais impactante. | Falta converter proximidade de tiers em pontos. | Simular equipes de tamanhos e tiers diferentes. |
| AB-085 | Peso da diferença entre divisões | Seu impacto é mais moderado que a desigualdade interna. | Falta proporção numérica. | Integrar à mesma simulação de Equilíbrio. |
| AB-086 | Contribuições negativas | Desigualdade alta e insígnias inativas podem gerar pontos negativos. | Não há pisos, tetos ou regra de acúmulo. | Definir fórmula completa e testar casos extremos. |
| AB-087 | Limiar de ruptura por disparidade | Disparidade severa pode gerar ruptura; IV+I não é necessariamente suficiente e IV+IV+I pode ser. | Os exemplos não formam uma regra geral. | Definir métrica sensível ao tamanho da equipe e validar cenários. |
| AB-088 | Diferenças entre ruptura por ausência e por disparidade | Ambas podem alimentar eventos, mas não são causas equivalentes. | Identidade, evolução e recompensas podem precisar divergir. | Definir taxonomia das rupturas e seus eventos. |
| AB-089 | Velocidade da deterioração por ausência | A ausência se agrava com o tempo. | Não existe ritmo aprovado. | Definir duração esperada de campanha e frequência de eventos. |
| AB-090 | Recuperação do Equilíbrio | Recuperação gradual foi proposta, não fechada. | Ritmo deve preservar memória sem punir indefinidamente. | Simular entrada de especialista e recomposição de equipe. |
| AB-091 | Faixas e nomes de estabilidade | A barra é percentual. | Categorias e efeitos ainda não foram nomeados. | Definir lore e curva de efeitos. |
| AB-092 | Mecânica de provocar caos | Estruturas, rituais ou ações podem piorar temporariamente os pontos da própria ou de outra divisão. | Forma, custo e disponibilidade ainda não foram escolhidos. | Definir propósito, momento de acesso e loops de risco/recompensa. |
| AB-093 | Consentimento e proteção contra abuso | Um jogador pode tentar impor caos ao grupo. | Não há regras sociais, votação ou limites de alvo. | Definir política do servidor e testar cenários de sabotagem. |
| AB-094 | Duração e reversão do caos provocado | A piora é temporária. | Não existe duração, cooldown ou forma de reparação. | Projetar o mecanismo de AB-092 e balancear consequências. |

## 9. Rupturas, eventos, fragmentos e shards

| ID | Ponto aberto | Estado e observação | Por que permanece aberto | Necessário para fechar |
|---|---|---|---|---|
| AB-100 | Nome e identidade de cada ruptura | Ausências diferentes produzem consequências diferentes; disparidade severa também pode romper. | Depende da lore e da taxonomia de AB-088. | Fechar lore e origens de ruptura. |
| AB-101 | Eventos de Magia | Corrupção, vazio e anomalias foram exemplos. | Modlist e inimigos não estão escolhidos. | Selecionar conteúdo mágico reutilizável e original necessário. |
| AB-102 | Eventos de Aventura | Invasões e ameaças que chegam aos jogadores foram exemplos. | Falta conteúdo escolhido. | Selecionar bosses, estruturas e inimigos. |
| AB-103 | Eventos de Tecnologia | Autômatos e instabilidade mecânica foram exemplos. | Falta conteúdo escolhido. | Selecionar sistemas tecnológicos e ameaças compatíveis. |
| AB-104 | Eventos de Comerciantes | Pragas, crises e bandidos foram exemplos. | A fronteira da divisão ainda depende da modlist. | Fechar a identidade concreta dos Comerciantes. |
| AB-105 | Reuso de conteúdo dos mods | É uma estratégia proposta para reduzir criação original. | Compatibilidade, drops e licenças variam. | Auditar cada candidato. |
| AB-106 | Thresholds, frequência e escalonamento | Eventos respondem a ruptura e World Progress. | Não há fórmula de nenhum dos eixos. | Prototipar os cálculos e definir categorias. |
| AB-107 | Drops normais de bosses de ruptura | Foi sugerido restringir alguns drops e dar chance de fragmentos. | Não foi aceita como regra universal. | Avaliar boss por boss e riscos de farm. |
| AB-108 | Chance e quantidade de fragmentos | Devem tornar shards difíceis e demorados. | Economia e frequência de eventos ainda não existem. | Simular custo por compensação. |
| AB-109 | Quantidade de fragmentos por shard | Não definida. | Depende das categorias e do pacing. | Fechar AB-106 e AB-108. |
| AB-110 | Anti-automação de shards | Participação real e bloqueio de farms foram propostas. | Ainda não foi confirmada regra universal. | Definir exploits aceitáveis e testar ferramentas da modlist. |
| AB-111 | Custo crescente de compensações repetidas | Foi proposto, não confirmado. | Pode punir campanhas legitimamente sem uma divisão. | Simular campanhas concentradas. |
| AB-112 | Categorias e nomes dos shards | Shards avançados podem acompanhar campanha avançada. | Quantidade de tiers e lore estão abertas. | Fechar maestria, World Progress e terminologia. |
| AB-113 | Gates aceitos por shards | Craftings e outros gates importantes estão confirmados conceitualmente. | Portais, summons e rituais concretos ainda não existem. | Catalogar gates e definir compatibilidade por categoria. |
| AB-114 | Consumo por gate | Shards são consumíveis. | Não foi decidido se cada uso consome uma unidade, carga ou quantidade variável. | Prototipar gates e economia de fragmentos. |
| AB-115 | Origem do shard em rupturas por disparidade | Essas rupturas podem acionar eventos; shards fazem parte da cadeia geral. | Não foi definida a correspondência entre divisão, causa da ruptura e autoridade produzida. | Fechar a taxonomia de AB-088 e os drops de cada evento. |

## 10. World Progress e interface

| ID | Ponto aberto | Estado e observação | Por que permanece aberto | Necessário para fechar |
|---|---|---|---|---|
| AB-120 | Fórmula da média de cada divisão | Quatro divisões e progresso médio estão confirmados. | Número de tiers e ponderação não existem. | Fechar a progressão e simular equipes desiguais. |
| AB-121 | Tratamento visual de divisão ausente | As quatro identidades devem continuar representadas. | Não foi escolhida aparência para ausência. | Prototipar HUD e questline. |
| AB-122 | Percentual agregado | Pode existir além das quatro parcelas, mas não foi confirmado. | Pode confundir World Progress com Equilíbrio. | Testar compreensão de layouts. |
| AB-123 | Relação com categorias de eventos e shards | World Progress deve escalar conteúdo. | Falta fórmula e categorias. | Fechar AB-106 e AB-112. |
| AB-124 | Layout da interface | Quatro cores/identidades são obrigatórias. | Barra única segmentada, quatro barras ou outro formato não foram escolhidos. | Criar e comparar mockups. |
| AB-125 | Presença e ocultação da interface | Indicador persistente foi imaginado. | Pode gerar ruído visual. | Definir momentos de exibição e preferências do jogador. |
| AB-126 | Tooltips e explicações | Precisam diferenciar Equilíbrio e progresso. | Linguagem visual e lore estão abertas. | Prototipar comunicação com usuários. |

## 11. Modlist e referências

| ID | Ponto aberto | Estado e observação | Por que permanece aberto | Necessário para fechar |
|---|---|---|---|---|
| AB-130 | Modlist final | Nenhum mod citado foi confirmado. | O design conceitual precede a seleção. | Construir fichas de candidatos e a matriz de funções. |
| AB-131 | Quantidade de mods principais | 25–40 foi ordem de grandeza, não meta. | Funções e dependências não foram mapeadas. | Fechar os sistemas essenciais e remover redundâncias. |
| AB-132 | Lista final de referências | E9E, E6E, packs modernos e pack anterior estão confirmados como fontes. | Outras referências podem ser úteis. | Definir escopo de análise e registrar cada fonte. |
| AB-133 | Matriz de papéis e sobreposição | É o instrumento necessário para decidir candidatos. | Ainda não foi produzida. | Catalogar mods por função, divisão, estágio, worldgen e risco. |
| AB-134 | Conteúdo de mods para rupturas | Reuso é possível, não obrigatório. | Depende dos candidatos escolhidos. | Avaliar bosses, mobs, estruturas e permissões. |
| AB-135 | Política para sistemas únicos em mods redundantes | Um mod amplo pode possuir uma função valiosa. | Não há critério de custo-benefício formal. | Comparar dependências, configuração e sobreposição. |
| AB-136 | Ferramenta de quests e conquistas | Questline orienta, registra e exibe atos. | Nenhuma ferramenta foi selecionada. | Comparar suporte à versão, integração e experiência de autoria. |

## 12. Worldgen e eficiência

| ID | Ponto aberto | Estado e observação | Por que permanece aberto | Necessário para fechar |
|---|---|---|---|---|
| AB-140 | Sistema principal de terreno | Worldgen deve ser seletivo. | Versão e identidade visual estão abertas. | Selecionar plataforma e comparar candidatos. |
| AB-141 | Biomas e quantidade | Zero ou um grande sistema foi alvo de trabalho, não limite rígido. | Falta comparar ganho visual e custo. | Testar candidatos com estruturas e recursos. |
| AB-142 | Estruturas | Devem ter função concreta. | Progressão e eventos ainda não estão mapeados. | Relacionar cada estrutura a gates, lore ou divisões. |
| AB-143 | Dimensões | Somente dimensões com função concreta devem entrar. | Conteúdo de Aventura não foi selecionado. | Montar a matriz de dimensões, bosses e materiais. |
| AB-144 | Dimensão de prova de Aventura | Arena vazia/controlada com bosses fortalecidos é proposta. | O formato da prova coletiva ainda não foi fechado. | Prototipar depois de escolher bosses e tiers. |
| AB-145 | Densidade e distribuição | Deve evitar diluição e redundância. | Sem lista de estruturas não há parâmetros. | Testar seeds representativas. |
| AB-146 | Orçamento de desempenho | Servidor é robusto, mas eficiência segue prioritária. | Não há metas mensuráveis. | Definir hardware-alvo, carga de jogadores e métricas. |
| AB-147 | Política de chunks carregados | Automação extrema pode manter muita atividade. | Mods e escala final são desconhecidos. | Medir protótipos de endgame. |
| AB-148 | Pré-geração | É opção operacional, não decisão. | Tamanho do mundo e padrão de exploração são desconhecidos. | Definir campanha e medir geração. |

## 13. Experiência multiplayer e governança

| ID | Ponto aberto | Estado e observação | Por que permanece aberto | Necessário para fechar |
|---|---|---|---|---|
| AB-150 | Regras sociais para caos deliberado | A estratégia existe e pode atingir outra divisão. | Pode virar sabotagem em vez de escolha compartilhada. | Definir consentimento, votação, permissões ou limites. |
| AB-151 | Único especialista temporariamente ausente | Roster persistente evita hard-lock imediato, mas a pessoa pode ficar dias fora. | Shards tratam ausência estrutural, não toda indisponibilidade social. | Definir expectativa da campanha e política de acesso. |
| AB-152 | Proteções contra exclusão de novatos | Catch-up não reduz requisitos e novatos afetam coesão. | A consequência pode incentivar culpabilização. | Testar comunicação, penalidades e ferramentas de ajuda. |
| AB-153 | Comunicação de responsabilidade | Linguagem coletiva foi recomendada, não formalizada. | Depende da interface e da lore. | Prototipar mensagens do Equilíbrio. |
| AB-154 | Política administrativa | Trocas, dados incorretos e abandonos exigirão correção. | Não há procedimentos ou autoridade definidos. | Criar política para servidor privado e eventual distribuição pública. |
| AB-155 | Escala fora de aproximadamente seis jogadores | O cálculo considera total de ativos. | Fórmulas ainda não foram testadas em grupos menores ou maiores. | Simular 1–12 jogadores e identificar limites. |
| AB-156 | Profundidade dos guias por divisão | Linhas de quests estão confirmadas. | Modlist e número de atos ainda não existem. | Fechar estrutura de progressão. |

## 14. Decisões recentes removidas da lista ativa

Os itens abaixo não devem voltar a ser apresentados como perguntas abertas sem uma nova revisão explícita:

- Automation Follows Mastery é lei central confirmada e o desbloqueio é da divisão responsável.
- Poder extremo e bosses extremos são aceitos no endgame/pós-progressão.
- Pontos de controle são a filosofia geral de gating, com exceções justificadas.
- Autoridade emprestada pode alcançar gates além de crafting.
- Mesmo tier não causa desgaste adicional de empréstimo; desgaste intrínseco ainda pode existir.
- Em zero desgaste, a insígnia fica inativa, bloqueia o próprio dono e penaliza sua divisão.
- Cada divisão terá restauração temática, difícil e potencialmente gradual.
- Aventura possui identidade própria e progressão predominantemente por feitos.
- Comerciantes têm agricultura, pesca e vilas/cidades como eixos centrais.
- Tiers altos exigem as três outras divisões pela rota normal.
- Provas de maestria são pessoais, exceto a prova coletiva de Aventura.
- Empréstimo e ajuda por itens são o catch-up previsto; não haverá aceleração permanente.
- Atos existem e são visíveis apenas na questline, mas seu número não foi definido.
- Quests servem atualmente a orientação e registro.
- Disparidade interna severa pode acionar eventos de ruptura.
- Caos pode ser provocado temporariamente contra a própria divisão ou outra.
- Shards podem autorizar craftings e outros gates importantes, sempre como recurso consumível.
- O princípio social do domínio coletivo do modpack foi formalmente confirmado.
