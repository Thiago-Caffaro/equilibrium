# Insígnias e maestria

> Parte da **Baseline Conceitual v0.2**.

## 1. Papel do sistema

As insígnias são a representação física da especialização e uma das duas grandes mecânicas próprias do projeto, ao lado do Equilíbrio do Mundo.

Ao escolher uma divisão, o jogador recebe uma insígnia correspondente. Ela representa e catalisa a autoridade conquistada por aquele personagem, participa de pontos importantes da progressão e acompanha a evolução de sua maestria individual.

O conceito separa duas coisas:

```text
MAESTRIA
conhecimento e progresso pessoal conquistados pelo jogador

INSÍGNIA
representação física e catalisadora dessa autoridade
```

A maestria pertence ao jogador. Perder temporariamente o acesso funcional à insígnia não apaga o conhecimento conquistado. Da mesma forma, usar a insígnia como catalisadora não consome sua propriedade nem os tiers de maestria nela representados.

Essa permanência não deve ser confundida com três estados diferentes:

- a insígnia pode sofrer **desgaste** por usos determinados;
- uma insígnia esgotada pode ficar **inativa**, embora continue existindo e vinculada ao proprietário;
- **shards** são substitutos consumíveis de autoridade e desaparecem conforme seu uso.

## 2. Regras de propriedade

### Decisões fechadas

- A insígnia fica vinculada ao jogador que a recebeu originalmente.
- A propriedade não pode ser transferida de forma permanente.
- A insígnia é indestrutível como registro de progresso: morte, perda ou duplicação não devem apagar a maestria conquistada.
- O jogador deve permanecer protegido contra a perda da insígnia ao morrer.
- Se a insígnia estiver no chão, jogadores sem divisão ou de outra divisão não conseguem pegá-la.
- Jogadores da mesma divisão podem pegá-la, permitindo o empréstimo pretendido.
- Duas insígnias legítimas da mesma divisão e nível podem existir se pertencerem a jogadores diferentes.
- Uma duplicata da mesma insígnia vinculada deve ser eliminada, preservando uma única instância válida.
- Se a insígnia original for perdida, o sistema deve ser capaz de devolvê-la ou reemiti-la ao proprietário sem criar uma segunda progressão.

O método de validação, devolução e recuperação pertence ao futuro planejamento técnico e não é definido nesta baseline.

## 3. Maestria individual

Cada jogador possui um nível próprio dentro de sua divisão.

```text
Ana — Magia III
Bruno — Magia I
Carlos — Tecnologia II
```

Jogadores da mesma divisão podem estar em níveis diferentes. Essa diferença é relevante tanto para o empréstimo quanto para a coesão interna da divisão no Equilíbrio do Mundo.

### Decisões fechadas

- O primeiro nível de maestria é **independente**.
- O nível máximo não é fixo e só deve ser definido depois que a modlist revelar quantas etapas reais fazem sentido.
- Níveis como I–IV foram exemplos, não uma decisão numérica.
- Em níveis mais altos, a rota normal exige contribuições das **três outras divisões**.
- Se uma dessas divisões estiver ausente, shards obtidos pela rota de rupturas evitam hard-lock sem tornar a especialização ausente dispensável.
- A evolução deve provar domínio dos sistemas importantes da própria divisão, e não ser apenas uma compra de experiência.
- A evolução continua individual: especialistas da mesma divisão podem possuir tiers diferentes.
- A única prova coletiva de maestria atualmente confirmada pertence à divisão de Aventura; o formato exato dessa prova ainda está em aberto.

## 4. Ascensão de maestria

A evolução da insígnia acontece em uma **estrutura universal de ascensão**, com variações visuais associadas a cada divisão. A aparência, o nome final e a forma dessas variações ainda não foram definidos.

A ascensão combinará consumo de itens e verificação de feitos, com foco principal no **consumo de itens**. Altares como os de Mystical Agriculture foram citados como um ponto de partida para pensar essa experiência, não como confirmação do mod nem como receita final.

Uma ascensão conceitual pode reunir:

- a insígnia atual;
- itens importantes dos mods centrais da própria divisão;
- provas de domínio, conquistas ou registros pertinentes;
- contribuições produzidas pelas outras divisões nos tiers em que a interdependência já deve existir.

Exemplo ilustrativo, não uma receita aprovada:

```text
Insígnia de Magia I
  + itens de domínio mágico
  + feitos verificados
  + componentes das outras divisões
  = Maestria de Magia II
```

A questline ou sistemas de conquistas podem ajudar a orientar e registrar as verificações, mas não foi decidido que serão a origem obrigatória dos desbloqueios. Mods, itens, quantidades, proporção entre consumo e verificação e número de tiers permanecem em aberto.

## 5. A insígnia como catalisadora

### Regra geral confirmada

A autoridade deve ser concentrada em **pontos de controle**. Em vez de inserir a insígnia em toda receita pertencente a uma divisão, craftings, rituais, componentes e interações importantes funcionam como gates que liberam organicamente cadeias posteriores.

```text
Insígnia Tecnológica II
        ↓
componente-chave de Tecnologia II
        ↓
diversas máquinas e melhorias posteriores
```

Essa é uma filosofia geral, não uma proibição absoluta. Receitas comuns podem exigir diretamente a insígnia quando houver justificativa conceitual ou de progressão. Quais pontos serão gates e quais exceções serão válidas só poderão ser definidos após a modlist e o desenho das cadeias.

Ao catalisar uma ação, a insígnia não é consumida, não muda de proprietário e não perde tiers de maestria. Isso não significa que todos os usos sejam livres de desgaste: craftings-chave de progressão podem possuir desgaste intrínseco mesmo quando o próprio dono usa sua insígnia.

## 6. Empréstimo de autoridade

A propriedade da insígnia é intransferível, mas sua autoridade pode ser emprestada temporariamente a outro integrante da mesma divisão.

```text
Maestria nativa I
  + insígnia emprestada III
  = autoridade temporária III

Maestria nativa continua I
```

A autoridade emprestada pode valer não apenas para crafting, mas também para gates pertinentes como portais, invocações de bosses, equipamentos, blocos, rituais e interações. A lista concreta depende dos mods e dos pontos de controle escolhidos.

### Decisões fechadas

- O empréstimo não transfere propriedade.
- O empréstimo não aumenta permanentemente a maestria do receptor.
- Usar autoridade acima da maestria nativa causa desgaste adicional na insígnia emprestada.
- Esse desgaste considera simultaneamente a diferença de maestria e a importância da ação ou crafting.
- Se o receptor já possui o mesmo tier representado pela insígnia emprestada, não existe desgaste adicional causado pelo empréstimo.
- Mesmo nesse caso, continua valendo qualquer desgaste intrínseco daquele crafting-chave.
- O desgaste ocorre por usos determinados e pode ser gradual.
- Desgaste não consome a propriedade da insígnia nem os tiers de maestria conquistados.

Portanto, existem duas causas conceitualmente distintas:

```text
DESGASTE INTRÍNSECO
aplicado a craftings-chave definidos,
inclusive quando o dono usa a própria insígnia

DESGASTE DE EMPRÉSTIMO
adicional, aplicado quando o receptor usa
autoridade acima da própria maestria
```

A fórmula, os valores, os craftings com desgaste intrínseco e o nome temático do recurso — estabilidade, integridade, ressonância ou outro — continuam em aberto.

## 7. Insígnia esgotada e restauração

Quando o desgaste chega a zero:

- a insígnia continua fisicamente presente e vinculada ao proprietário;
- ela fica inativa e continua reconhecendo somente o proprietário legítimo;
- o proprietário também perde temporariamente o acesso à autoridade de sua própria maestria;
- a maestria conquistada não é apagada;
- a insígnia inativa aplica uma contribuição negativa aos pontos da equipe/divisão no Equilíbrio do Mundo;
- é necessária restauração para recuperar a autoridade funcional.

“Fraturada” continua sendo apenas um nome possível para esse estado, não a terminologia definitiva.

Cada divisão terá uma restauração temática própria, difícil e coerente com sua identidade. Uma insígnia tecnológica, por exemplo, poderá exigir uma recalibração ou grande recarga energética; os exemplos não definem o método final. A restauração poderá ocorrer gradualmente, em vez de exigir obrigatoriamente uma única ação instantânea.

Continuam em aberto os métodos concretos, recursos, custos, duração, curvas de restauração e quantidade exata de pontos negativos aplicada pela inatividade.

## 8. Relação com catch-up

O empréstimo é o mecanismo principal de recuperação para jogadores novos ou atrasados. Além dele, especialistas avançados podem produzir itens para ajudar quem ainda está nos tiers iniciais.

```text
grupo em nível avançado
        ↓
empresta autoridade ou fornece itens
        ↓
novato participa do conteúdo atual
        ↓
conquista sua própria maestria sem desconto permanente
```

Não haverá, no estado vigente, redução permanente de requisitos ou aceleração automática baseada no progresso do servidor. A ajuda social não substitui a conquista pessoal dos tiers.

## 9. Relação com shards

Se uma divisão inteira estiver ausente, não existe insígnia legítima daquela especialização para ser emprestada. Rupturas e eventos podem então gerar fragmentos que levam a shards consumíveis.

```text
especialista presente
→ insígnia permanente, restaurável e vinculada

especialista ausente
→ shard raro, temporário e consumido ao substituir autoridade
```

O shard pode substituir a autoridade de uma insígnia em craftings e também em outros gates importantes, como portais, invocações ou rituais, quando forem definidos como compatíveis. A lista de gates, a forma e a quantidade consumida por uso continuam em aberto.

## 10. Pontos que não devem ser presumidos

- nome definitivo da insígnia e dos estados de desgaste;
- quantidade máxima de tiers;
- aparência e funcionamento detalhado da estrutura universal de ascensão e de suas variações;
- itens, feitos e proporções de cada ascensão;
- lista de pontos de controle e exceções que usam a insígnia diretamente;
- fórmula e valores de desgaste;
- lista de craftings-chave com desgaste intrínseco;
- método, custo, duração e curva de restauração de cada divisão;
- valor do impacto negativo de uma insígnia inativa no Equilíbrio;
- gates exatos autorizados por insígnias emprestadas e por shards;
- tratamento detalhado da insígnia durante uma respecialização;
- formato final da prova coletiva de Aventura e atribuição de crédito por boss ou mod.
