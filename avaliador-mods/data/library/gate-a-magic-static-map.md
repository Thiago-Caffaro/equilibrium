# Gate A — mapa estático de Magia: Ars Nouveau e Occultism

> Data da leitura: 14/09/2026.
> Método: metadados dos JARs e scripts/configs locais de Enigmatica 10 (Minecraft 1.21.1 / NeoForge). Nenhum valor, receita ou configuração é reaproveitado pelo Equilibrium.

## Resultado em uma frase

Ars Nouveau é um candidato de plataforma para pesquisar como **sistema-base de magia**, mas o ambiente de referência o amplia com muitos addons; Occultism demonstra poder ritual e mineração virtual suficientes para ficar **bloqueado por política de recursos** até que o projeto decida o que Magia pode renovar.

## Evidência de plataforma e escopo

| Sistema | Fato do JAR/referência | Leitura segura |
| --- | --- | --- |
| **Ars Nouveau 5.13.0** | O JAR 1.21.1 declara NeoForge 21.0.86-beta+ e dependências Curios/GeckoLib; E10 também instala Ars Additions, Ars Controle, Ars Creo, Ars Elemental, Ars Ocultas, Ars Technica, Ars Delight e Ars Engineering. | Há base NeoForge na família de plataforma alvo, mas o conjunto de addons é um fator de confusão. A primeira comparação precisa avaliar Ars base antes de inferir qualquer função de seus complementos. |
| **Occultism 1.224.1** | O JAR 1.21.1 declara NeoForge 21.0.110-beta+ e entradas de integração/dependência com, entre outros, Modonomicon, Curios, GeckoLib, Create e Immersive Engineering. | A linha tem conexões amplas o bastante para ser tratada como sistema de ritual, invocação e recursos, não como apenas “magia de armazenamento”. |

As faixas de NeoForge declaradas são compatíveis em princípio com o baseline 21.1.249, mas isso não substitui o teste do conjunto exato de JARs quando houver uma shortlist.

## Funções observadas e riscos

| Candidato | Evidência estática | Risco de design | Próxima decisão antes de teste |
| --- | --- | --- | --- |
| **Ars Nouveau** | E10 cria conversão por brotamento para material de AE2 e usa imbuement para transformar blocos/materiais de origem em essências. Também mantém tags de controle para golems e uma blacklist de Drygmy baseada na blacklist geral de spawners. | Magia pode atravessar materiais, encantamento, automação de mobs e integração de rede. Addons podem sobrepor Tecnologia ou Comerciantes antes de a identidade de Magia estar definida. | Definir a proposta mínima de Ars base: uma contribuição material/ritual que nenhuma outra divisão produza, mais uma fronteira explícita para automação e mobilidade. |
| **Occultism** | O script de mineradores da referência cria saídas ponderadas para vários minérios e materiais; rituais cruzam itens de outros sistemas. Há também listas de negação para soul gems e entidades especiais. | Mineração virtual é uma rota direta para quebrar escassez e tornar exploração/tecnologia secundárias. Listas de negação demonstram que a segurança de fontes de mobs precisa ser intencional. | Fechar a política de recursos renováveis e de captura de mobs. Até isso existir, não avaliar mineradores, soul gems ou qualquer output de recurso como candidato de gameplay. |

## O que a referência ensina, sem copiar sua solução

1. **Integração em dados é auditável:** conversões e rituais podem expressar uma relação entre sistemas de forma rastreável em KubeJS/datapack. Isso serve para planejamento; não cria uma dependência de KubeJS para o Core.
2. **Addons não devem ser pressupostos:** nove componentes de Ars no mesmo perfil não demonstram que todos sejam necessários. O Gate A deve tratar cada addon como candidato separado e só depois de escolher a função do mod-base.
3. **Recurso virtual é uma decisão de política:** uma blacklist de entidade e um minerador com tabelas ponderadas são evidência de superfície de exploit, não uma razão para ajustar números prematuramente.

## Encaminhamento da divisão Magia

| Linha | Estado Gate A | Critério para avançar |
| --- | --- | --- |
| Ars Nouveau base | **Pesquisa delimitada** | Papel próprio, janela de entrada, dependências externas e limite de automação/mobilidade documentados. |
| Addons de Ars | **Adiado** | Só comparar um addon quando resolver uma lacuna que Ars base não cobre. |
| Occultism ritual/invocação sem recurso virtual | **Pesquisa delimitada** | Provar uma contribuição ritual distinta de storage técnico e de Ars. |
| Occultism mineradores/soul gems de recursos | **Bloqueado por política** | Política de recursos renováveis, de captura de entidades e de recompensa de Aventura fechada. |

Nenhum teste manual é necessário para esta etapa: os arquivos já revelam a presença de conversões, mineradores e guardrails. A primeira sessão só será justificada quando houver uma hipótese específica sobre comportamento multiplayer, custo de servidor ou uma automação que os dados não descrevam.
