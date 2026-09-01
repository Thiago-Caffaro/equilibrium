# Experiência multiplayer

> Parte da **Baseline Conceitual v0.2**.

## 1. Público e cenário de uso

O projeto foi pensado a partir de um grupo de aproximadamente seis jogadores em um servidor local robusto. O tamanho exato do grupo pode variar, e o sistema precisa se adaptar à composição real da campanha.

O problema social original era a separação entre:

```text
poucos jogadores que dominam automação
→ controlam recursos e infraestrutura

demais jogadores
→ mantêm atividades mais lentas
→ deixam de ser necessários
```

O novo pack procura transformar especialização em colaboração e não em concentração permanente de poder.

O princípio social foi formalmente confirmado:

> O jogador não deve ser obrigado a dominar todos os mods; o grupo deve ser obrigado a dominar o modpack coletivamente.

## 2. Loop social desejado

```text
jogador escolhe uma divisão
→ desenvolve conhecimento próprio
→ produz resultados que os outros não substituem
→ recebe contribuições externas
→ sobe sua maestria
→ ajuda a divisão a permanecer coesa
→ contribui para o avanço do mundo
```

Uma interação saudável deve fazer o jogador procurar um especialista, negociar recursos, combinar uma expedição, organizar uma produção ou ajudar um colega atrasado.

## 3. Especialização sem isolamento

O jogador não deve precisar aprender todos os mods. Também não deve ficar confinado a uma ilha que não conversa com o restante da campanha.

O desenho busca uma rede recíproca:

```text
Tecnologia ↔ Magia
     ↕          ↕
Aventura  ↔ Comerciantes
```

Os vínculos exatos dependem da modlist. Nos patamares altos, cada divisão exigirá contribuições das três outras divisões pela rota normal. A exceção sistêmica são shards consumíveis quando uma autoridade necessária está ausente.

## 4. Vários jogadores na mesma divisão

Mais de um jogador pode escolher o mesmo caminho. Isso não aumenta artificialmente a dificuldade da progressão. Ao contrário, permite:

- dividir sistemas internos;
- produzir componentes em paralelo;
- emprestar insígnias;
- ajudar colegas atrasados;
- explorar diferentes mods da mesma identidade;
- sustentar maior demanda das outras divisões.

O custo aparece no Equilíbrio caso esses jogadores avancem de forma muito desigual. A equipe precisa administrar não apenas seu topo de progresso, mas sua coesão.

## 5. Novos jogadores e catch-up

Quando um novo jogador entra em uma divisão já avançada, sua maestria inicial reduz a coesão do grupo:

```text
antes: IV, IV, IV
depois: IV, IV, IV, I
```

Essa consequência foi aceita como parte do sistema. Ela cria incentivo para que os veteranos ajudem o novato a se aproximar.

O empréstimo de insígnias permite participação temporária em conteúdo avançado sem converter I em IV permanentemente. Especialistas avançados também podem produzir itens para o integrante atrasado.

Essa combinação foi considerada suficiente. Não haverá redução permanente de requisitos antigos, bônus automático baseado no World Progress ou aceleração dos tiers já dominados pelo servidor.

## 6. Evitar culpabilização

O efeito de um novato ou jogador atrasado sobre o Equilíbrio pode gerar comportamento social indesejado se a interface o apontar como culpado.

Foi recomendado comunicar estados coletivos:

> O pilar Arcano está fragmentado.

em vez de:

> O jogador X está destruindo a estabilidade.

Essa escolha de linguagem não foi formalmente confirmada, mas é coerente com o objetivo de incentivar ajuda em vez de exclusão.

## 7. Presença persistente, não presença instantânea

O mundo usa um roster de jogadores ativos baseado em histórico de login. Sair para jantar, passar uma noite offline ou não estar conectado durante um evento não remove imediatamente a contribuição do jogador.

Isso evita que a estabilidade oscile a cada login e preserva a identidade da campanha.

Ao mesmo tempo, jogadores que abandonaram o servidor devem eventualmente deixar o roster. O tempo e o processo ainda serão definidos.

## 8. Campanhas de composição diferente

O mesmo pack deve suportar campanhas muito diferentes.

### Grupo distribuído

```text
2 Tecnologia
1 Magia
1 Aventura
2 Comerciantes
```

Tende a possuir acesso sustentável aos quatro pilares, embora distribuição e coesão ainda influenciem a estabilidade.

### Grupo concentrado

```text
6 Magia
```

Continua jogável, mas acumula rupturas de Tecnologia, Aventura e Comerciantes porque essas divisões estão ausentes. O grupo aceita eventos, perigo e uso recorrente de shards consumíveis para compensar gates sem autoridade disponível.

### Grupo representado, porém fragmentado

```text
Magia: IV, IV, I
Tecnologia: III
Aventura: III
Comerciantes: III
```

Todas as divisões existem, mas a coesão de Magia prejudica o mundo. Se a disparidade atingir severidade suficiente, ela também poderá acionar eventos de ruptura. O limiar exato ainda não existe. A resposta social pretendida continua sendo ajudar o integrante atrasado.

## 9. Cooperação não obrigatoriamente pacífica

O design reconhece uma forma de jogo menos cooperativa. Um jogador pode avançar sozinho, reduzir a estabilidade e, quando a disparidade interna se torna severa, provocar eventos de ruptura. Se o grupo também mantiver divisões ausentes, poderá explorar as rupturas dessas ausências para obter fragmentos e shards.

O jogo não bloqueia essa escolha. A consequência vem do mundo:

- ameaças crescentes;
- rupturas simultâneas das divisões ausentes;
- obtenção difícil e demorada de compensações;
- manutenção constante do caos.

Também foi confirmada a possibilidade de usar estruturas, rituais ou ações para piorar temporariamente os pontos da própria divisão ou de outra divisão e provocar caos deliberadamente. A mecânica, o custo, a duração e os limites ainda estão em aberto.

Não foram definidas regras de votação, consentimento do servidor ou proteção contra um jogador que imponha caos aos demais. Esse é um risco multiplayer ainda aberto.

## 10. Autoridade permanente e ajuda temporária

O sistema cria três formas de acesso:

| Forma | Natureza | Papel social |
|---|---|---|
| Maestria própria + insígnia ativa | Permanente; propriedade e progresso não são consumidos, embora craftings-chave possam causar desgaste intrínseco | Especialista real e infraestrutura sustentável |
| Insígnia emprestada | Autoridade temporária para gates compatíveis; pode sofrer desgaste adicional pela diferença de tier | Ajuda, emergência e catch-up |
| Shard | Consumível ao substituir autoridade em craftings e outros gates definidos | Compensação sem especialista permanente |

Essa distinção impede que ajuda elimine a importância da especialização.

## 11. Riscos sociais e de design identificados

### Monopólio de uma divisão

Um único especialista pode controlar um recurso essencial. O pack precisa incentivar troca sem tornar o grupo refém de disponibilidade pessoal. Shards resolvem ausência estrutural, mas não necessariamente conflitos internos.

### Contas alternativas

Como uma divisão passa a contar ao ser escolhida, contas alternativas podem registrar pilares sem participação real. O problema foi identificado, mas nenhuma contramedida foi decidida.

### Jogador inativo

O roster persistente precisa remover abandonos sem punir ausências comuns.

### Empréstimo abusivo

Se o desgaste for barato, uma insígnia avançada pode substituir permanentemente a progressão dos demais. Se for caro demais, o mecanismo deixa de ajudar. A fórmula é balanceamento futuro.

### Farming de rupturas

Se shards forem automatizáveis, a ausência de uma divisão pode virar uma fábrica superior à presença de um especialista. Salvaguardas foram propostas, mas ainda não confirmadas.

### Culpa sobre novatos

A coesão precisa incentivar assistência, não expulsão.

### Insígnia inativa

Uma insígnia esgotada bloqueia até mesmo a autoridade nativa do proprietário e penaliza os pontos da divisão. Isso transforma restauração em responsabilidade coletiva, mas o peso da penalidade e o risco de uso como sabotagem ainda precisam ser balanceados.

### Fragmentação de grupo

Quatro divisões em um grupo pequeno exigem que cada uma seja útil mesmo com um único integrante. A distribuição ideal não pode virar uma obrigação rígida.

## 12. Orientação ao jogador

Cada divisão terá uma linha de quests própria, com interseções nos momentos de colaboração. Os atos serão visíveis somente na questline; sua quantidade e seus nomes dependerão da modlist.

No estado atual, quests servem para **orientação e registro**. Elas não foram definidas como a fonte obrigatória de desbloqueios. Profundidade, estrutura detalhada e eventual ampliação futura desse papel permanecem em aberto.

Independentemente do formato, a comunicação futura precisará explicar claramente:

- o que a escolha de divisão significa;
- como a maestria evolui;
- o que uma insígnia emprestada faz;
- por que o Equilíbrio mudou;
- diferença entre Equilíbrio e World Progress;
- consequências de divisões ausentes;
- natureza consumível dos shards.

## 13. Resultado multiplayer esperado

O resultado pretendido é uma campanha em que:

- ninguém precisa dominar todos os mods;
- ninguém se torna irrelevante apenas porque outro automatizou cedo;
- a equipe decide entre estabilidade e caos;
- novos jogadores podem ser ajudados sem receber progresso gratuito;
- composições diferentes geram campanhas diferentes;
- avançar sozinho é possível, mas afeta o mundo e o grupo;
- recursos e conquistas circulam entre especializações.

As provas de maestria são pessoais, com uma exceção: a prova de Aventura será coletiva. Uma arena ou dimensão controlada com rodadas de bosses fortalecidos foi proposta para concretizar essa exceção, mas ainda não foi confirmada como formato final.

Os detalhes de interface, regras sociais e orientação permanecem parte do planejamento futuro.
