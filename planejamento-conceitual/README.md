# Planejamento conceitual do modpack

> **Baseline Conceitual v0.2**  
> Consolidação das decisões conceituais 10–30. A Baseline v0.1 permanece preservada em seu arquivo ZIP próprio.

Este diretório consolida o planejamento conceitual discutido desde a primeira mensagem sobre o novo modpack. Ele foi reconstruído a partir da conversa original, de seus ramos posteriores e da lista de mods do pack anterior usada como diagnóstico.

O conteúdo não é uma especificação de implementação. Não define APIs, formatos de dados, código, loaders, fórmulas finais, receitas exatas ou valores de balanceamento. Seu objetivo é preservar a intenção do projeto e impedir que sugestões provisórias sejam confundidas com decisões.

## Como ler o estado das ideias

Os documentos usam quatro classificações:

- **Decisão fechada:** foi afirmada ou confirmada pelo usuário e não foi substituída depois.
- **Diretriz vigente:** orientou toda a conversa e é compatível com as decisões fechadas, mas sua formulação exata pode não ter recebido uma confirmação isolada.
- **Proposta não confirmada:** foi sugerida durante a conversa, porém não recebeu decisão explícita.
- **Em aberto:** precisa de escolha futura ou depende da modlist, da lore ou do balanceamento.

Quando duas formulações entram em conflito, vale a mais recente que tenha sido confirmada. O histórico dessa evolução está em [10-registro-de-decisoes.md](10-registro-de-decisoes.md).

Esta baseline não encerra as questões ainda registradas como abertas. Alterações futuras deverão resultar de novas decisões conceituais e ser registradas sem apagar formulações históricas substituídas.

## Essência do projeto

O modpack nasceu para corrigir um problema observado em um grupo de aproximadamente seis jogadores: uma parcela pequena do grupo domina cedo sistemas como automação industrial, geração de recursos e processamento em massa, enquanto quem escolhe magia, exploração ou estilos mais tranquilos perde relevância ao longo da campanha.

A solução não é tornar todos os caminhos igualmente rápidos nem proibir automação poderosa. O projeto pretende fazer com que caminhos diferentes continuem **igualmente importantes**, criando especialização, dependência entre jogadores e progressão coletiva.

A formulação que melhor sintetiza essa intenção é:

> O jogador não deve ser obrigado a dominar todos os mods; o grupo deve ser obrigado a dominar o modpack coletivamente.

Essa frase está formalmente confirmada como princípio social central do projeto.

## Sistemas conceituais centrais

```text
DIVISÕES
   ↓
especialização individual
   ↓
INSÍGNIAS + MAESTRIA
   ↓
autoridade permanente e progressão pessoal
   ↓
INTERDEPENDÊNCIA
   ↓
o grupo avança por cooperação
   ↓
EQUILÍBRIO DO MUNDO ↔ PROGRESSO DO MUNDO
saúde geral                 estágio coletivo das quatro divisões

DIVISÃO AUSENTE OU DESEQUILÍBRIO SEVERO
   ↓
ruptura
   ↓
eventos → fragmentos → shards consumíveis em gates importantes
```

As quatro divisões atualmente estabelecidas são Tecnologia, Magia, Aventura e Comerciantes. Os nomes ainda são provisórios, mas a existência e o propósito geral dos quatro pilares já fazem parte do conceito vigente.

## Índice

1. [Visão do projeto](01-visao-do-projeto.md) — problema original, objetivos, identidade e limites conceituais.
2. [Divisões](02-divisoes.md) — os quatro caminhos, a escolha inicial e a função de cada especialização.
3. [Insígnias e maestria](03-insignias-e-maestria.md) — propriedade, evolução, empréstimo e pontos ainda não definidos.
4. [Equilíbrio do mundo](04-equilibrio-do-mundo.md) — roster ativo, coesão, rupturas, shards e World Progress.
5. [Progressão e automação](05-progressao-e-automacao.md) — interdependência, gates, automação e endgame.
6. [Seleção de mods e referências](06-selecao-de-mods-e-referencias.md) — uso de E9E e outros packs, critérios e candidatos.
7. [Worldgen e eficiência](07-worldgen-e-eficiencia.md) — propósito da geração, custo do mundo e lições do pack anterior.
8. [Experiência multiplayer](08-experiencia-multiplayer.md) — dinâmica social, catch-up, campanhas estáveis e caóticas.
9. [Decisões em aberto](09-decisoes-em-aberto.md) — lista canônica do que não deve ser presumido.
10. [Registro de decisões](10-registro-de-decisoes.md) — alterações, substituições, exceções e origem do estado atual.
11. [Protocolo de análise de modpacks](11-protocolo-de-analise-de-modpacks.md) — auditoria de referências sem exigir campanhas completas.

## Decisões estruturais já estabelecidas

- O resultado será um modpack autoral, não um fork conceitual do E9E.
- E9E, E6E, packs modernos, o pack anterior e referências futuras serão estudados e reconhecidos no GitHub do projeto.
- O projeto aceita alterações profundas de configurações, valores, receitas e integrações quando isso for necessário ao balanceamento.
- A seleção de versão deve vir depois do design e da análise da interseção real entre os mods desejados.
- O jogador escolhe uma divisão no primeiro ingresso e pertence a uma divisão por vez.
- Há quatro divisões: Tecnologia, Magia, Aventura e Comerciantes.
- A divisão controla, por enquanto, progressão e crafting; passivas no estilo Origins não fazem parte do escopo estabelecido.
- Cada jogador possui maestria individual e uma insígnia vinculada à sua divisão e identidade.
- A insígnia usa pontos de controle como regra geral, admitindo exceções justificadas em receitas comuns.
- Craftings-chave podem causar desgaste intrínseco mesmo na insígnia do proprietário; empréstimos acima da maestria acrescentam desgaste conforme a diferença de níveis e a importância da ação.
- Uma insígnia em desgaste zero permanece presente, reconhece o proprietário, fica inativa, bloqueia a autoridade nativa e penaliza a contribuição da divisão até ser restaurada.
- Cada divisão terá restauração própria e desafiadora, que poderá ocorrer gradualmente.
- O primeiro nível de maestria é independente; a dependência entre divisões cresce nos níveis elevados.
- Nos níveis altos, a rota normal exige contribuições das três outras divisões.
- Uma divisão necessária ausente não cria hard-lock: sua ausência alimenta uma ruptura, cujos eventos podem fornecer fragmentos para shards consumíveis que substituem a autoridade da insígnia em craftings e outros gates importantes.
- Automation Follows Mastery é lei central: a divisão responsável precisa comprovar o domínio convencional antes de liberar a automação correspondente.
- Poder extremo é permitido no endgame, acompanhado por desafios pós-progressão igualmente extremos.
- Equilíbrio e Progresso do Mundo são eixos diferentes.
- World Progress representa as quatro divisões por quatro cores/identidades e usa o progresso médio de cada uma; fórmula, layout, percentual agregado e representação visual de divisões ausentes permanecem abertos.
- O Equilíbrio considera distribuição populacional, coesão interna, diferença moderada entre divisões e memória de ausências.
- A desigualdade interna pode gerar contribuição negativa para a estabilidade.
- Rupturas podem nascer de ausência prolongada ou de desequilíbrio interno severo; os thresholds ainda serão balanceados.
- Jogadores poderão forçar temporariamente o caos e piorar a contribuição da própria divisão ou de outra por estruturas, rituais ou mecanismos dedicados.
- Aventura progride predominantemente por conquistas e possui uma prova coletiva de maestria; as demais divisões usam provas pessoais.
- Comerciantes têm agricultura, pesca e cidades como eixos centrais, com progressão focada em produção, crafting e desenvolvimento urbano.
- A ascensão combina comprovação e consumo de itens, com foco no consumo, em uma estrutura universal com variações visuais por divisão.
- O empréstimo de insígnias e a ajuda material do grupo são o mecanismo suficiente de catch-up; não haverá aceleração permanente adicional.
- Os atos serão visíveis somente pela questline; sua quantidade e seus nomes dependerão da modlist.
- Haverá questlines por divisão que se cruzam, usadas para orientação e registro, não como fonte obrigatória dos desbloqueios neste estágio.
- Worldgen deve ser seletivo e cada mod precisa justificar a função que desempenha.

## O que este conjunto não fecha

Não estão definidos, entre outros pontos: nome do pack, lore, versão, loader, modlist, quantidade máxima de maestrias, fórmulas do Equilíbrio, thresholds de ruptura, eventos específicos, receitas e custos, aparência das interfaces, quantidade final de atos, conteúdo das questlines, métodos concretos de restauração e regras quantitativas dos shards.

A lista completa e sem inferências está em [09-decisoes-em-aberto.md](09-decisoes-em-aberto.md).

## Ferramenta operacional de avaliação

O repositório também contém o [Avaliador de Mods](../avaliador-mods/README.md), uma aplicação local para registrar fichas críticas de candidatos e análises de modpacks/listas de referência. Os registros ficam em JSON legível e versionável, com importação/exportação CSV e JSON e uma biblioteca lateral de notas Markdown.

A ferramenta organiza evidências e pareceres; ela não transforma uma ficha ou estado de shortlist em decisão conceitual automática.
