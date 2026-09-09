# Auditoria canônica — Guia Básico Ansy 15.10.25

Este arquivo é a evidência de cobertura do aplicativo. Um grupo só pode ser marcado como concluído depois de transcrição, implementação e teste.

## Estados

- `CONFIRMADO`: o manual fornece regra operacional suficiente.
- `INCOMPLETO NO MANUAL`: nome ou conceito existe, mas faltam campos necessários.
- `NÃO IMPLEMENTAR`: trecho incompatível com o núcleo 2d6 ou claramente importado de outro sistema.
- `EM AUDITORIA`: ainda não passou por conferência integral.

## Cobertura

| Grupo | Fonte | Transcrição | Motor | Testes | Estado |
|---|---:|---:|---:|---:|---|
| Atributos básicos e secundários | 27–31, 154 | sim | sim, inclusive idade | sim | CONFIRMADO |
| Raças comuns | 13–25, 141, 148–149 | 12 raças jogáveis publicadas | atributos, capacidades, fontes e exceções confirmadas; efeitos contextuais/passivos separados | cobertura das 12 e casos críticos | CONFIRMADO |
| Ordens | 33–55 | sim | sim; incompletas bloqueadas | vínculo de Ordem, requisitos e bloqueios estruturais | CONFIRMADO COM LACUNAS BLOQUEADAS |
| Perícias | 56–67 | 35 itens canônicos, especializações e descrições | custos, NH, limites, requisitos e progressões publicadas | cobertura integral do catálogo e casos críticos | CONFIRMADO |
| Antecedentes e traços | 68–74 | sim | custos, variantes, requisitos e efeitos derivados confirmados | sim | CONFIRMADO |
| Equipamentos | 76–80 | sim; inclusive serviços sem preço | catálogo, pesos publicados e carga; lacunas bloqueadas | sim | CONFIRMADO |
| Grimorium | 81–113 | 106 entradas | 9 fichas operacionais selecionáveis; 97 lacunas/contradições bloqueadas | cobertura estrutural de cada entrada | CONFIRMADO COM LACUNAS BLOQUEADAS |
| Itens mágicos | 114–121 | 18 artefatos nomeados e 10 encantamentos | 7 artefatos com regras publicadas selecionáveis; 11 itens/partes sem regra ficam bloqueados | cobertura de catálogo e descrições auditadas | CONFIRMADO COM LACUNAS BLOQUEADAS |
| Poderes e Dons | 122–133 | 56 Limites: 27 confirmados, 29 incompletos/corrompidos | custos, variantes e detalhes obrigatórios; auditoria visual integral das p. 123–133 | cobertura estrutural de cada Limite | CONFIRMADO COM LACUNAS BLOQUEADAS |
| Antagonistas | 134–141 | conferido como referência de PdN | não entra como raça selecionável: a p. 134 afirma que PdNs não precisam seguir todas as regras de construção | conferência visual p. 134 | CONFIRMADO COMO FORA DO CRIADOR DE PdJ |
| Divina Justiça e sociedades | 142–151 | cenário, sociedades, facções e ganchos conferidos | sem nova compra/raça/Ordem jogável; regras de Changelin já integradas | conferência visual integral | CONFIRMADO COMO CENÁRIO |
| Tempo, testes e combate | 152–171 | morte, carga, 2d6 e p. 163–168 transcritas | idade, carga, 2d6, morte, dano localizado, nocaute, rajada e Esquadrinhar | casos base e cálculos de combate confirmados | CONFIRMADO |
| Trecho d20/5e | 172–175 | identificado | não | n/a | NÃO IMPLEMENTAR |
| Planos, objetos e apêndices | 176–182 | p. 176 e anexos visuais conferidos | cópia física de simulacros implementada; tabelas d20 isoladas | mapeamento de simulacro | CONFIRMADO COM MATERIAL EXTERNO ISOLADO |

## Decisões confirmadas

- Testes do núcleo usam 2d6; duplo 6 é sucesso crítico e duplo 1 é falha crítica.
- As dificuldades-base confirmadas são Fácil 9, Média 12, Desafiadora 15, Difícil 18, Monumental 21 e Épica 25. Empates resistidos usam 1d6 sem modificador e repetem se empatarem; Coragem pode reduzir uma Falha Crítica a falha comum por 10 FID, sob o limite de sessão do Narrador.
- A habilidade Defensivo de Agente usa o requisito padrão de armas 12/15/18; Experiente de Agente usa 15/18/21. Esses requisitos foram separados no motor e cobertos por teste.
- A média de atributo é 10; cada ponto comprado acima custa 10 XP e cada ponto abaixo devolve 10 XP.
- Bônus raciais são separados do valor comprado e não cobram XP.
- Perícias especializadas são instâncias independentes; é possível possuir mais de um Saber, Idioma ou tipo de Arma.
- Armas Simples, Médias e Complexas custam respectivamente 1, 2 e 3 XP por graduação, conforme confirmação do autor.
- O custo de um Aprendizado é o nível da magia: 1, 2 ou 3 pontos de capacidade.
- A primeira e a segunda Ordem custam 5 XP cada; da terceira em diante a aquisição custa 10, 15, 20 XP sucessivamente.
- A capacidade de Aprendizados de Tarian e de Dons de Nephalim é `Porte + Inteligência/2`, com arredondamento para cima aplicado à metade.
- Opções com campos essenciais em branco continuam visíveis para consulta, mas carregam o estado `INCOMPLETO NO MANUAL`.
- Campo vazio não significa `Padrão`: custo, tempo, duração ou alcance só recebem o padrão quando a ficha o declara expressamente.
- Materializar Energia permanece bloqueada porque o cabeçalho diz `Instantânea` e a descrição exige uma ação simples.
- Modificadores de Poder não alteram o orçamento: `Inato` é chamado de vantagem, mas aparece com `-3`, e `Dependência` não possui custo nem regra.
- Habilidades naturais de Uh-Nura não são compras do Grimório: Modo Invisível, Conexão Mental e Toque Espectral são expostos como automáticas; os campos ausentes do ritual não são presumidos.
- `Protegido` foi conferido visualmente na p. 73: custa +2 XP e impõe −2 em todos os testes enquanto a pessoa especificada estiver em perigo. `Cego` reduz a Percepção efetiva a 2/3.
- Um Nephalim que também seja Mago Invocador pode usar magias fora da lista de Dons por Esferas; a seleção de Esfera separa essa compra do orçamento de Dons/Aprendizados raciais.
- O criador não impõe mais teto ou piso global de atributos: o manual deixa esse limite a cargo do Narrador conforme a pontuação inicial/campanha.
- A tabela humana de idade da p. 154 termina na faixa de 91–100 anos. Acima disso, o criador não prolonga automaticamente o último redutor e sinaliza que a definição é do Narrador.
- As regras d20, Proficiência, CA, SAB, Dados de Cura, círculos e descansos das páginas 172–175 não pertencem ao motor Ansy 2d6.
- O capítulo de Antagonistas inicia na p. 134 afirmando que personagens do Narrador não precisam seguir todas as regras de construção. Frosts, demônios, zumbis e demais condições daquele capítulo não são oferecidos como raças de PdJ sem uma regra de autorização específica do manual.
- A auditoria visual dos Limites de Hunter confirmou as progressões de Criocinese, Hidrocinese, Fumocinese, Eletrocinese, Fotocinese, Aerocinese e Umbracinese. O texto publicado reutiliza descrições de Pirocinese em seis delas; as escolhas ficam disponíveis com essa ressalva explícita, sem inventar uma regra corretiva. Desintegrar, Latejar e os demais nomes sem procedimento continuam bloqueados.
- A Convicção de Hunter foi conferida visualmente na p. 17: custa 1 FID para uma cena, concede imunidade contra poderes sobrenaturais de seres malignos/desumanos (exceto Hunters) e redutor de dano igual a FID ÷ 2 no momento da ativação. A dificuldade de resistência a um Limite é 2 × Porte + nível contra seres desumanos, ou Porte normal contra humanos e Hunters.
- Os dez encantamentos das p. 114–115 agora são exibidos no catálogo de equipamento como consulta bloqueada; a fonte só fornece os nomes, então não há compra, custo ou efeito inventado.
- As p. 163–168 foram conferidas visualmente: redutores de dano localizado, dano de cabeça além da RD, nocaute, CdT/Dispersão de rajada e Esquadrinhar em Combate possuem motor e testes. Mirar não foi automatizado porque sua progressão publicada entra em contradição (a fórmula textual e o máximo por rodadas não coincidem); a página permanece como referência para o Narrador.
- As p. 169–172 foram separadas no ponto de mudança de sistema: privações, fôlego, recuperação natural, Primeiros Socorros/Medicina e a recuperação de Fadiga têm fórmulas Ansy implementadas e testadas. A partir do bloco de Vantagem/Desvantagem, Dados de Cura e Proficiência, o texto é d20 e permanece fora do motor 2d6.
- Planos de Existência (p. 176) confirma o simulacro como regra de jogo: Porte mental vira Vigor, Percepção vira Agilidade e Inteligência vira Força da cópia. As tabelas posteriores usam CA, Destreza e CDs d20; foram auditadas como material importado e não são promovidas a regras do criador Ansy.
- Divina Justiça e Sociedades (p. 142–151) é conteúdo de cenário: acordos, A Vigilante, Filhos de Cain, Casas Mais Antigas, Changelins e Caídos oferecem contexto e ganchos, não opções adicionais de criação. A p. 148 fala em Glamour alterável na primavera, enquanto a p. 149 estabelece seis horas; o criador preserva a divergência no texto da raça e não escolhe arbitrariamente uma frequência.
- Raças comuns das p. 13–25 foram verificadas visualmente. O passivo Tarian que não tinha função dedicada — RD 1, dobro de dano/efeito inalado e metade do fôlego — agora é calculável e testado; “evolução” Tarian continua fora da criação porque a fonte não publica gatilho de aquisição. As 12 raças jogáveis, incluindo as páginas posteriores de Changelin e Kahje, permanecem catalogadas sem promover antagonistas a opções de PdJ.
- Na leitura visual das Ordens, p. 36 confirma que Experiente de Atirador reduz dificuldade em 4 (e não em 5 como o Experiente de Combatente). A descrição e o teste de regressão foram corrigidos; requisitos de NH e Tiro Duplo permanecem separados e bloqueados no app.
- Páginas 33–41 das Ordens foram confrontadas visualmente: custos de entrada/ordens múltiplas, Combatente, Lutador, Atirador, Sacerdote, Vigilante, Bárbaro, Mago Real e Ladino. Campos literais sem regra (como Santuário, Olhar Divino, Patrono, Sorte/Furtivo/Soturno de Ladino) ficam bloqueados; nenhuma lacuna foi preenchida por inferência.
- Páginas 42–47 das Ordens foram confrontadas visualmente: Caçador, Paladino, Bardo, Agente e Xamã. Bardo e a maior parte de Agente/Xamã já correspondem ao texto; `Ofensivo` de Agente foi corrigido para o redutor literal de −1 e recompras por rodada. Os trechos corrompidos ou contraditórios de Paladino, Caçador e Rituais de Xamã continuam sinalizados como incompletos e não são liberados como regras confirmadas.
- Páginas 48–55 confrontadas visualmente: Militar, Mago Invocador, Emissário e Shinobi. Catálogo, limites de recompras, escolhas distintas de dispositivo/adaptação e requisitos correspondem às páginas. `Sangue Frio` passou a exibir os cinco resultados mecânicos publicados; o sexto resultado do d6 não está impresso no manual e permanece explicitamente indefinido, em vez de ser inventado pelo criador. `Encantar` continua bloqueado pois a fonte traz somente “Blah blah”.
- Páginas 56–63 confrontadas visualmente: regra de NH, custos, peso, teto de graduação, especializações e primeiras perícias. A ficha agora exige que `Avaliar` informe seu Saber/Ofício relacionado e valida a dependência mínima de duas graduações. Perícias semelhantes não recebem uma equivalência automática: a própria fonte delega essa relação ao bom senso do Narrador.
- Páginas 64–71 confrontadas visualmente: as demais perícias (incluindo Rituais, recuperação por Sobrevivência, procedimentos de Medicina e o cálculo de Rituais) e o início de Antecedentes/Qualidades. Os efeitos e custos por nível já catalogados de Saúde, Fadiga, Fé/Determinação, Iniciativa, sentidos e resistências foram confrontados; efeitos contextuais continuam descritos para uso do Narrador, sem serem aplicados como bônus permanentes indevidos.
- Páginas 72–79 confrontadas visualmente: encerramento de Qualidades, todos os Defeitos e Peculiaridades, além das armas, armaduras e escudos básicos. A tela de equipamento agora respeita faixas de peso publicadas e alerta quando o manual não informa o peso de algum item, sem falsamente somar esses itens como zero. Dano perfurante, cortante, queima-roupa e regras de uma/duas mãos permanecem expostos como regras de combate contextual.
- Páginas 80–87 confrontadas visualmente: carga, Grimorium e regras gerais de magia. Foram adicionados cálculos verificáveis para custo/tempo/alcance padrão, elevação de resistência por Fé e teste de sustentação. A fórmula geral de Rituais (p. 82) contradiz a fórmula da Ordem Xamã (p. 46); a habilidade permanece bloqueada, documentada e não recebe uma escolha arbitrária entre as versões.
- Páginas 88–95 confrontadas visualmente: modalidades de magia e as primeiras entradas do Grimorium. `Aura Sagrada/Profana` foi corrigida: a página usa o valor de Porte do conjurador nos bônus físicos e o dobro em Porte, não a Diferença de Porte. Entradas com campos em branco continuam classificadas como incompletas e indisponíveis para compra.
- Páginas 96–103 confrontadas visualmente: entradas de `Coma` a `Localizar`. O texto operacional publicado foi preservado, inclusive a resistência de `Desintegrar` que sobe +1 a cada 2 pontos extras de Fé/Determinação. Campos de custo, tempo, duração e alcance ausentes continuam marcados como incompletos; não foram inferidos para transformar essas magias em opções compráveis.
- Páginas 104–111 confrontadas visualmente: entradas de `Luz Solar` a `Visão da Verdade`. `Regenerar` foi corrigida para recuperar `1d + Porte` por rodada a cada 5 pontos gastos, e `Materializar Energia` preserva o custo em F/D e a contradição de tempo entre cabeçalho e descrição. `Paralisar` permanece uma das poucas entradas confirmadas do bloco; todas as demais com campos em branco seguem indisponíveis.
- Páginas 112–119 confrontadas visualmente: final do Grimorium, Alteração de Energia e início dos artefatos. Custos, testes, colisão e limites objetivos das oito alterações de `Materializar Energia` foram convertidos em funções testáveis. As dez melhorias de arma seguem listadas, mas incompletas: o manual publica os nomes sem regras de aquisição ou efeito. Artefatos têm seu texto preservado na ficha sem converter escolhas narrativas de campanha em compras automáticas.
- Páginas 120–135 confrontadas visualmente: artefatos finais, Poderes & Dons e os últimos Limites Hunter; o capítulo de Antagonistas começa na p. 134 e não é tratado como raça jogável. As fórmulas explícitas de Gravitocinese, Eletrocinese e Criar Vórtex passaram a ser calculáveis e testadas. Poderes sem efeito publicado, e os elementos que repetem literalmente o texto de Pirocinese apesar de terem outro nome, permanecem sinalizados como regra incompleta/errata necessária.
- Páginas 136–143 confrontadas visualmente: Antagonistas, Condições e início do cenário Divina Justiça. Frosts, demônios, zumbis, esqueletos, Receptores Vivos e demais criaturas dessa seção são conteúdo de Narrador/condição e continuam fora do seletor de raças jogáveis; isso agora possui teste de regressão. Kahje é a exceção jogável já catalogada: Dever Existencial não libera uma compra de magia sem regra publicada, e Ingenuidade só reduz a resistência contra Persuadir.
- Páginas 144–151 confrontadas visualmente: cenário, sociedades e páginas posteriores de Changelin. `Glamour` contradiz a própria duração — mudança no início da primavera (p. 148) e a cada 6 horas (p. 149) —, portanto ambas são exibidas como contradição e nenhuma duração é automatizada. `Essência Mágica` dispensa F/D quando a personagem já possui uma fonte válida de magia; ela não cria, por inferência, uma lista gratuita de magias. As páginas restantes são lore/facções de Narrador, sem compras novas de ficha publicadas.

- Páginas 152–167 confrontadas visualmente: ações, testes, combate, Teste de Morte, manobras, rajadas e dano localizado. Foram incluídos cálculos testáveis para dano após RD (normal, perfurante e cortante), modificadores de alvo para armas de fogo, manobras com valores fechados, Mirar e Golpe em Arco. A tabela de morte, rajada, dano na cabeça e localização já estavam modelados e foram conferidos; efeitos que dependem de condição narrativa continuam explicitamente fora da automação.

- Páginas 168–176 confrontadas visualmente: `Esquadrinhar em Combate`, Combate Sincronizado, privações, fôlego, cura e Simulacros/Avatares. Combate Sincronizado passou a calcular dificuldade, NH compartilhado, penalidade por integrante malsucedido e bônus de Reflexos; as fórmulas de privações, fôlego, cura, fadiga e simulacro já existentes foram confirmadas. O trecho posterior de recuperação passa a usar explicitamente terminologia de outro sistema (`5e`, d20, classe/nível e magia diária), portanto não foi misturado às regras Ansy.
- Páginas 177–182 confrontadas visualmente: há papéis de uma cena/campanha específica (Caçador, Algoz, Hierofante, Imperador, Mago e Prisioneiro), seguidos de regras/tabelas d20 de objetos, armaduras e componentes. Não há custo, pré-requisito ou integração publicada com a criação Ansy; por segurança, isso permanece material de cenário/anexo, fora dos seletores automáticos. As regras de Simulacro de Ansy, que são a única mecânica claramente compatível desse bloco final, já estão implementadas e testadas.
- Auditoria de requisitos de Ordens: corrigida a validação de pré-requisitos cumulativos. Antes, requisitos como `Força 12+ e Vigor 12+` podiam ser aprovados se apenas o primeiro fosse satisfeito devido a uma composição lógica incorreta. Agora Barbaro, Bardo, Emissário e Shinobi bloqueiam a compra até que cada requisito listado esteja presente; há teste de regressão para cada caso.
- Auditoria de Qualidades: `Habilidade: Perícia` já oferece somente perícias treinadas na interface; a validação de fichas salvas agora também rejeita uma referência solta ou adulterada. O bônus e o custo não podem mais ser direcionados a uma perícia que não exista na ficha.
- Auditoria de Perícias: foram adicionados os cálculos fechados que faltavam de Medicina (amputação), Rastrear e Sacar Rápido. Cada resultado conserva os parâmetros do Narrador como entrada explícita, em vez de supor condições de terreno ou equipamento.
- Auditoria de Limites Hunter: a cobertura estrutural agora exige exatamente as 56 entradas publicadas, não apenas “mais de 50”. Isso impede que um Limite desapareça silenciosamente do catálogo durante futuras alterações.
- Integridade de fichas salvas: a validação passou a recusar raça, Ordem, habilidade de Ordem, perícia, Qualidade ou Defeito inexistente, bem como duplicações de compras únicas. Isso impede que uma importação manual contorne os bloqueios da interface e gere uma ficha aparentemente válida.
- Especializações de perícia: saves agora precisam informar especialização para cada perícia que a fonte exige, e opções fechadas (Armas e Esferas) são comparadas com o catálogo publicado. `Avaliar` continua sendo uma instância única, mas precisa declarar o Saber/Ofício relacionado conforme sua regra própria.
- A mesma auditoria de integridade passou a cobrir equipamento e escolhas sobrenaturais: referências inexistentes e repetições em saves são reportadas antes de qualquer total de XP ou capacidade ser aceito.
- Limites de nível de Qualidades, Defeitos e Habilidades de Ordem agora são validados também em saves. Uma entrada sem recompras publicadas exige nível 1; recompras só são aceitas nos itens marcados como repetíveis e dentro de seus máximos confirmados.
- Magias por Esfera: além de exigir graduação suficiente, a validação agora confere se a Esfera escolhida é uma das Esferas impressas na magia. Um save não consegue mais financiar uma magia de Luz com uma Esfera de Fogo, por exemplo.
- Verificação visual local: a build em `127.0.0.1:5173` foi aberta em viewport 1366×768. A jornada de nove etapas, orçamento, formulário de identidade e barra de navegação inferior renderizam sem sobreposição; o botão Continuar permanece visível sem rolagem nesse primeiro passo.

- Integridade de equipamento: além de rejeitar referências inexistentes ou duplicadas, a validação passou a barrar itens cuja própria fonte não oferece regra operacional completa. Isso fecha a rota de uma ficha salva inserir artefatos/serviços bloqueados pela interface; há teste de regressão.

- Progressão de Armas: os rótulos usados para identificar armas de alcance foram alinhados aos nomes exatos do catálogo (incluindo lasers, arcos, espingarda, rifle sniper e canhão laser). Antes, variações de grafia podiam aplicar a progressão de arma branca a uma arma de alcance; há teste de regressão que exige que cada rótulo exista no catálogo.

- Isolamento de Ordens: a suíte agora percorre todas as habilidades confirmadas e confirma que nenhuma pode ser adquirida sem pertencer à sua Ordem proprietária. Isso cobre o vínculo básico de todas as 17 Ordens, além dos testes específicos de pré-requisitos já existentes.

- Bloqueio de lacunas das Ordens: a cobertura agora percorre todas as habilidades com fonte incompleta e confirma o bloqueio mesmo na Ordem proprietária. Assim, nenhum título com texto corrompido, marcador editorial ou regra parcial volta a ser comprado por regressão.

- Integridade de antecedentes: dados salvos agora também validam idade, carga e os valores fechados de aparência, recursos, alfabetização e renome. Isso impede totais ou modificadores impossíveis criados por edição manual do salvamento; há teste de regressão.

- Integridade de progressão salva: graduações de perícia e níveis de Qualidades, Defeitos e habilidades de Ordem precisam ser inteiros não negativos (ou ao menos 1 para compra). Isso bloqueia valores fracionários, negativos ou zero injetados fora dos controles do criador; teste de regressão cobre os três grupos.

- Cobertura integral do Grimorium: a validação é exercitada para cada entrada transcrita. As 97 magias com fonte operacional incompleta são bloqueadas individualmente; as entradas confirmadas são verificadas para não receber esse bloqueio indevido.

- Cobertura integral de Limites Hunter: as 56 entradas passam pela validação de ficha. Os Limites incompletos precisam retornar o bloqueio de fonte; os confirmados não podem ser classificados indevidamente como incompletos.

- Peculiaridades: o manual permite invenção livre aprovada pelo Narrador e concede +1 XP por item, sem publicar teto. O criador preserva essa liberdade, mas impede entradas vazias ou duplicadas (inclusive por variação de maiúsculas/espaços), tanto na tela quanto na validação de saves.

## Resultado da auditoria

Não restam pendências implementáveis a partir deste Guia Básico. Regras objetivas foram transcritas, calculadas quando pertencem ao criador e testadas; regras dependentes de estado de cena, inventário, criatura, contexto de campanha ou julgamento do Narrador permanecem apresentadas como referência, sem virar modificador permanente indevido.

As lacunas, textos corrompidos e contradições do próprio manual não são preenchidos por inferência: ficam catalogados, visíveis e bloqueados para compra. A próxima ampliação legítima exige uma errata, suplemento ou decisão de campanha do autor/Narrador.
