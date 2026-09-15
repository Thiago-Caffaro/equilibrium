# Gate A — mapa funcional estático: E9E e pack anterior

> Data da leitura: 14/09/2026.
> Método: inventário de nomes de JAR e leitura dirigida de scripts locais. Nenhuma instância foi iniciada, modificada ou copiada para o Equilibrium.

## Pergunta da rodada

Quais sistemas concorrem para a mesma função, e quais exemplos de dependência entre domínios merecem informar a matriz Gate A? A resposta não escolhe mods, receitas, custos nem a plataforma pública do pack.

## Evidência preservada

| Referência | Observado | Leitura útil | Limite da conclusão |
| --- | --- | --- | --- |
| **Desempregagos** (Minecraft 1.21.1 / NeoForge) | JARs simultâneos para Create e addons, Mekanism, Applied Energistics 2, Refined Storage, Industrial Foregoing, RFTools Builder, Hostile Neural Networks, Mystical Agriculture, Powah, Ars Nouveau, Occultism, Twilight Forest, Cataclysm, Farmer's Delight e Slice & Dice. Não há diretório `kubejs`. | É uma boa fonte para localizar concorrência funcional e rotas paralelas; a ausência de KubeJS impede atribuir a progressão a scripts de receita locais. | JAR instalado não prova uso pelo grupo, ordem de acesso, equivalência de poder ou que o mod deva ser removido. |
| **Enigmatica 9: Expert** (Minecraft 1.19.2 / Forge) | Há scripts expert separados para AE2, Ars Nouveau, Create, Immersive Engineering, Mekanism, Occultism, Twilight Forest, Industrial Foregoing e muitos outros. A leitura encontrou dependências cruzadas em receitas e saídas. | É uma fonte para observar o padrão de gates rastreáveis por arquivos: um sistema pode exigir evidência de outro em vez de existir isoladamente. | É outra versão/loader e outro design. Nenhuma receita, script ou valor pode ser portado. |

### Sinal de plataforma, não de aprovação

O inventário do pack anterior contém variantes NeoForge 1.21.1 de Create 6.0.8, AE2 19.2.17, Mekanism 10.7.17.83, Ars Nouveau 5.11.1, Occultism 1.197.0, Twilight Forest 4.7.3196, Farmer's Delight 1.2.9 e Slice & Dice 4.2.2. Isso reduz a incerteza de que essas linhas já existiram juntas em uma referência na família de plataforma alvo; não prova compatibilidade com NeoForge 21.1.249, não substitui uma fonte oficial e não autoriza uma instalação no perfil do Equilibrium. Immersive Engineering não apareceu nesse inventário 1.21.1, portanto continua sem esse sinal local e deve ser verificado separadamente.

## Mapa de concorrência — pack anterior

| Função | Soluções observadas juntas | Risco a investigar antes de escolher | Consequência para Gate A |
| --- | --- | --- | --- |
| Processamento e automação física/industrial | Create, Mekanism, Industrial Foregoing, RFTools Builder e addons especializados. | Uma linha pode substituir as demais antes que cada uma mostre sua identidade. | Comparar um primeiro processo de escala e um teto por vez; não avaliar cinco mods isoladamente. |
| Armazenamento, pedido e autocrafting | Applied Energistics 2, Refined Storage, integrações de ambos e ferramentas de pedido. | Duas redes resolvendo o mesmo gargalo anulam custo, logística e especialização. | Decidir primeiro se existe um único slot de “rede de teto”; só depois comparar candidatos. |
| Recursos renováveis e produção virtual | Mystical Agriculture, Hostile Neural Networks, Industrial Foregoing e RFTools Builder. | Recursos, mobs ou minérios podem deixar agricultura, aventura e exploração sem função. | Tratar como eixo de alto risco; qualquer candidato precisa de janela, contrapartida e teste de atalho. |
| Energia | Mekanism, Powah, Create Addition e máquinas dependentes de energia. | Geração e transporte podem virar pré-requisito universal ou ter rotas redundantes demais. | Não escolher gerador antes de definir o papel de energia em Tecnologia e seus gates externos. |
| Magia e automação arcana | Ars Nouveau, vários addons de Ars e Occultism. | Addons aumentam o alcance de Ars; rituais/armazenamento podem competir com redes técnicas. | Comparar o papel base antes de contar addons como conteúdo necessário. |
| Aventura, dimensões e bosses | Twilight Forest, Cataclysm e integrações de aventura. | Loot, estruturas e dimensões podem concorrer por materiais de gate ou pesar no worldgen. | Montar matriz separada de boss → material → gate → recompensa; não resumir Aventura a “mais bosses”. |
| Produção alimentar | Farmer's Delight, Slice & Dice, Create Central Kitchen e Create. | Automação de comida pode ser liberada pela Tecnologia sem preservar uma janela para Comerciantes. | Conservar a cadeia observada como evidência, mas adiar custo/output exclusivo até o papel de Comerciantes ser fechado. |

## Amostra de padrões de gate — E9E

Os itens abaixo são descrições de fatos de arquivos locais. Identificadores, números e implementação não são copiados para este repositório.

| Domínio que recebe o gate | Dependência cruzada observada | Padrão que vale estudar | Uso seguro no Equilibrium |
| --- | --- | --- | --- |
| Create Addition | Componentes de Create aparecem junto de uma bobina de Immersive Engineering; outra receita de carregamento trabalha com material de AE2. | Uma extensão de energia pode depender tanto de infraestrutura mecânica quanto de material de rede. | Perguntar quais contribuições cruzadas fazem sentido para uma janela, sem adotar a receita. |
| Immersive Engineering | Máquinas simples de geração e bobinas exigem eixo de Create; transportadores usam correia de Create. | O gate pode ligar duas tecnologias por uma peça compreensível ao jogador. | Comparar se uma ligação é identidade complementar ou apenas bloqueio arbitrário. |
| Immersive Engineering | A máquina de engarrafamento produz/usa elementos de Create, AE2 e Mekanism em receitas expert. | Uma máquina específica pode servir de ponto de convergência em vez de cada receita carregar todas as divisões. | Avaliar pontos de controle, não repetir insígnias/itens de prova em toda receita. |
| Industrial Foregoing | Receitas expert referenciam componentes de IE, AE2, Mekanism, Create e Ars Nouveau; também há entradas vinculadas a biomas de Twilight Forest na geração de recursos. | Automação de recurso pode ser conectada à exploração e a múltiplos sistemas, mas cresce rapidamente em complexidade. | Usar como alerta: sistemas amplos exigem uma análise de rotas de contorno, não só um gate de entrada. |
| Farmer's Delight | Uma receita expert de alimentação faz uso de material de Ars Nouveau. | Alimentação pode receber uma dependência mágica, mas isso não determina que Comerciantes dependam de Magia no início. | Considerar apenas em estágio posterior e depois de definir outputs desejados. |
| Ars Nouveau / armazenamento | Fichas de receita de armazenamento funcional combinam elementos de Create e Ars Nouveau. | Um sistema de storage pode ser pressionado a não ser “gratuito” ao pedir uma contribuição de outro domínio. | Comparar com o papel de AE2/Occultism antes de decidir se há uma ou várias redes. |
| Twilight Forest | Há ajustes de portal, loot, estruturas e receita em scripts do pack; alguns materiais do mod aparecem em gates de outros sistemas. | Conteúdo de Aventura pode funcionar como autoridade de progresso, não só como recompensa estética. | Fazer uma futura matriz boss/estrutura/portal/matéria-prima, com risco de worldgen explícito. |

### Quatro leituras focais, sem reproduzir receita de terceiros

- **Entrada de Create:** o arquivo expert de itens moldados coloca uma peça de PneumaticCraft na receita de moinho e mistura materiais de IE, PneumaticCraft, Nature's Aura e Ars Nouveau em ferramentas e logística de Create. A lição é que gates podem ocorrer cedo demais se cada aparelho básico exigir outro sistema.
- **Entrada de AE2:** o arquivo expert de itens moldados associa blocos de infraestrutura de rede a materiais de Nature's Aura e de fonte arcana. Ele é um exemplo de dependência externa para storage, não uma proposta para tornar Magia obrigatória na primeira rede.
- **Ritual de Occultism:** o arquivo de rituais inclui uma rota para controlador de AE2 ativada por um componente de Create, além de combinações com outras tecnologias. É um sinal de convergência extrema que precisa ser reduzido a uma pergunta de design por vez.
- **Teto tecnológico:** a mesma família de rituais combina infraestrutura de AE2 e Mekanism para um componente de alta escala. O padrão é útil para o estágio avançado — contribuição cruzada deliberada — mas não para definir números, itens ou a forma de maestria.

## Resultado da leitura

1. **O problema a evitar está confirmado como estrutural:** o pack anterior possui múltiplas soluções para armazenamento, recursos, processamento e energia. A próxima decisão deve ser por *slot funcional*, não por popularidade de mod.
2. **O padrão técnico a estudar está confirmado:** E9E liga sistemas por gates observáveis em dados, especialmente entre tecnologia, magia e aventura. Isso valida a estratégia de investigar pontos de controle; não valida suas receitas nem sua quantidade de dependências.
3. **Comerciantes continua subamostrado:** a cadeia alimentar é comprovada, enquanto cidades, comércio, pesca e criação ainda não têm mapa equivalente. Não se deve aumentar a rodada Merchant antes de reduzir essa lacuna com leitura de referências.
4. **O primeiro filtro de alto risco está claro:** produção virtual de recursos/mobs, rede de storage, geração de energia e automação industrial devem ser comparados em pares ou famílias antes de qualquer instalação adicional.

## Próxima leitura, já delimitada

| Ordem | Produto | Pergunta concreta | Sem necessidade de jogo |
| ---: | --- | --- | --- |
| 1 | Mapa de rotas do pack anterior | Quais famílias resolviam armazenamento, recursos e energia; quais eram simultâneas? | Inventário de JARs e configs existentes. |
| 2 | Quatro gates E9E resumidos | Que dependência externa aparece na primeira máquina de escala ou no primeiro item de teto de Create, AE2, Ars e Occultism? | Leitura dirigida de quatro arquivos expert. |
| 3 | Fila de Aventura | Quais mods locais fornecem boss, dimensão, estrutura, material de gate e custo de worldgen? | JARs, quests/configs e dados de mundo. |
| 4 | Fila de Comerciantes | Que candidatos têm cidades, comércio, pesca ou criação com progressão real? | Pack anterior e referências 1.21.1; sem instalar nada. |

Um mundo de teste só será aberto se esta leitura deixar uma incógnita sobre crédito multiplayer, loot, atalho de automação ou desempenho. Essa regra preserva o tempo de jogo para decisões que dependam realmente dele.
