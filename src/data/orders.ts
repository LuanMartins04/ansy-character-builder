import { orders as legacyOrders } from './catalog'
import type { CatalogItem } from '../types'

type Order = CatalogItem & { abilities: CatalogItem[] }
const a=(id:string,name:string,description:string,page:number,requirements?:string[],extra:Partial<CatalogItem>={}):CatalogItem=>({id,name,description,cost:5,page,requirements,...extra})
const incomplete=(id:string,name:string,description:string,page:number)=>a(id,name,description,page,undefined,{status:'incomplete'})
const base=(id:string)=>legacyOrders.find(o=>o.id===id)!
const order=(id:string,abilities:CatalogItem[],extra:Partial<Order>={}):Order=>({...base(id),abilities,...extra})

export const orders:Order[]=[
  order('sem-ordem',[]),
  order('combatente',[
    a('manobrista','Manobrista','Realiza qualquer manobra de combate com +2 cumulativo por compra.',34,undefined,{repeatable:true}),
    a('defensivo','Defensivo','Usa Aparar como ação rápida com +2 NH ou recebe +2 Reflexos. Recompras aumentam usos e bônus.',34,['NH 12/15/18 em arma Simples/Média/Complexa'],{repeatable:true}),
    a('ofensivo','Ofensivo','Após sua defesa ou falha do atacante, recebe ataque extra com −2, uma vez por rodada.',34,['Defensivo']),
    a('especialista','Especialista','Com a arma escolhida, amplia o sucesso crítico para 11–12.',34,['10 graduações na arma']),
    a('experiente','Experiente','Reduz em 5 as dificuldades ao usar a arma escolhida.',34,['NH 15/18/21 em arma Simples/Média/Complexa']),
  ]),
  order('atirador',[
    a('precisao','Precisão','Ao mirar, recebe +3 por ação em vez de +1, até três ações (+9).',36),
    a('alcance','Alcance','Aumenta em 50% o alcance normal por experiência e modificações na arma ou munição.',36),
    a('tiro-duplo','Tiro Duplo','Gasta duas ações ou uma rodada completa e 1 Fé para causar dano dobrado, com −2 no ataque.',36,['Experiente']),
    a('experiente-atirador','Experiente','Reduz em 4 as dificuldades ao usar arma; exige NH 15/18/21 conforme complexidade.',36,['NH adequado na arma']),
    a('recarga','Recarga','Reduz pela metade o tempo de recarga; uma ação vira livre e rodada completa vira movimento.',36,['NH 10+ na arma']),
  ]),
  order('vigilante',[
    a('foco-defensivo','Foco Defensivo','Após uma ação analisando inimigos e 2 Fé, recebe +2 em ataques/defesas e +3 em desarmes contra os analisados.',38),
    a('evasao','Evasão','Recebe +3 Reflexos contra um adversário; combina com Evasivo/Defensivo.',38,['Agilidade 12+']),
    a('resistencia-a-dor','Resistência à Dor','Ao receber dano, reduz a penalidade conforme a tabela parcial e recebe RD 2 ao proteger alguém.',38,['Resistência Mental 13+'],{status:'incomplete'}),
    a('justiceiro','Justiceiro','Recebe +2 em Perícias, Atributos e Resistências para defender alguém injustiçado.',39,['Perseguido']),
    a('perseguido','Perseguido','Recebe +3 para fugir/esconder-se de autoridades; Defesa Total eleva a +5.',39),
  ]),
  order('mago-invocador',[
    a('metodo','Método de Invocação','Aprende método Lírico ou Rúnico sem perder a Conjuração; pode comprar novamente até dominar os três.',50,undefined,{repeatable:true}),
    a('especialidade','Especialidade','Escolha um tipo de magia; gasta metade da Fé/Determinação nesse tipo.',50),
    a('linha-lei','Linha de Lei','Após cinco rodadas concentrado, canaliza linha próxima e usa magia como se tocasse alvos na área conhecida.',50),
    incomplete('encantar','Encantar','O documento contém apenas o marcador editorial “Blah blah”.',50),
    a('familiar','Familiar','Atrai criatura extraplanar. Compras elevam afinidade Servo, Crédulo e Devoto; máximo três.',50,['Inteligência 13+'],{repeatable:true}),
  ]),
  order('lutador',[
    a('defensivo-lutador','Defensivo','Uma vez por rodada, usa Aparar como ação rápida e +2 NH, ou recebe +2 Reflexos. Recompras aumentam usos e bônus em +1.',35,['Briga ou Artes Marciais NH 12+'],{repeatable:true}),
    a('ofensivo-lutador','Ofensivo','Após sua defesa ou falha do atacante, recebe ataque extra com −2. Recompras concedem usos e reduzem o redutor.',35,['Defensivo'],{repeatable:true}),
    a('estilo-exotico','Estilo Exótico','Pode transferir até 5 pontos do ataque para o dano; o redutor não vale contra quem compreenda o estilo.',35,['Briga ou Artes Marciais NH 15+']),
    a('evasao-lutador','Evasão','Recebe +3 Reflexos contra um adversário; combina com Evasivo/Defensivo para +2/+3 ou +4 concentrado.',35,['Agilidade 12+']),
    a('golpe-efeito','Golpe de Efeito','Antes de cada ataque desarmado, escolha +2 dano ou −2 na Defesa do alvo.',36,['Estilo Exótico']),
  ]),
  order('sacerdote',[
    a('foco-divino','Foco Divino','Com o símbolo devocional, gasta 1 Fé a menos em magias. Sem ele, testa Porte 15/18/21 conforme a magia.',37),
    a('arma-divindade','Arma da Divindade','Escolhe por dia: +2 dano; +1d6+2 Fé; +3 numa perícia da entidade; ou +2 em todas as magias.',37),
    incomplete('santuario','Santuário','O manual apresenta somente o título, sem regra.',37),
    incomplete('olhar-divino','Olhar Divino','O manual apresenta somente o título, sem regra.',37),
    incomplete('patrono-divino','Patrono Divino (Poderes Concedidos)','O manual apresenta somente o título, sem regra.',37),
  ]),
  order('barbaro',[
    a('resistente-barbaro','Resistente','Por compra: +5 contra doenças naturais, RD 1 contra dano natural e +1 Saúde no estágio Sadio.',39,['Força 12+','Vigor 12+'],{repeatable:true}),
    incomplete('barbaro-nao-publicado','Demais habilidades não publicadas','A seção termina sem apresentar as outras quatro habilidades prometidas pelo formato.',39),
  ]),
  order('mago-real',[
    a('focado-criacionista','Focado','Aumenta em +3 a dificuldade de resistir ao efeito mágico por compra.',40,undefined,{repeatable:true}),
    a('linha-lei-criacionista','Linha de Lei','Cada 2 minutos concentrado dá +1 no próximo efeito, até +5; a linha fica ativa pelo dobro do tempo para invocadores.',40),
    a('ligacao-esfera','Ligação à Esfera','Escolha uma Esfera: +2 nos efeitos dela e +1 quando for associada; até cinco compras na mesma Esfera.',40,undefined,{repeatable:true}),
    a('efeito-dopple','Efeito Dopple','Desloca a assinatura da magia para outro ponto; Sentir contra 10 + Porte do mago pode detectar a origem.',41),
    incomplete('criacionista-nao-publicado','Quinta habilidade não publicada','Não há uma quinta regra completa identificável na seção.',41),
  ],{requirements:['Qualidade Distorcer Realidade']}),
  order('ladino',[
    a('sussurros-ladino','Sussurros','Concentrado numa pessoa/grupo localizado, ouve a conversa apesar do ruído e compreende o idioma.',41,['Ouvir NH 12+']),
    incomplete('sorte-ladino','Sorte','O texto contém somente um marcador editorial.' ,41),
    incomplete('furtivo-ladino','Furtivo','A regra está corrompida e duplicada no documento.',41),
    a('evasao-ladino','Evasão','Recebe +3 Reflexos contra um adversário; combina com Evasivo/Defensivo.',41,['Agilidade 12+']),
    incomplete('ladino-quinta','Quinta habilidade ilegível','A posição repete conteúdo e não permite confirmar outra regra.',41),
  ]),
  order('cacador',[
    a('sussurros-cacador','Sussurros','Concentrado numa pessoa/grupo localizado, ouve a conversa apesar do ruído e compreende o idioma.',42,['Ouvir NH 12+']),
    incomplete('ventos-cacador','Ventos','O trecho legível fala em detectar seres próximos após duas rodadas; a regra está incompleta.',42),
    incomplete('sintonia-natureza','Sintonia com a Natureza','A entrada remete apenas a “modo invisível” e não define a regra.',42),
    a('evasao-cacador','Evasão','Recebe +3 Reflexos contra um adversário; combina com Evasivo/Defensivo.',42,['Agilidade 12+']),
    incomplete('soturno','Soturno','A descrição repete indevidamente Sussurros.',43),
  ]),
  order('paladino',[
    incomplete('luz-interior-paladino','Luz Interior','A descrição repete outra habilidade.',43),
    incomplete('arma-divindade-paladino','Arma da Divindade','O texto contém somente um marcador editorial.',43),
    incomplete('imunidade-medo-paladino','Imunidade ao Medo / Aterrorizar','A descrição publicada é um marcador incompleto.',43),
    incomplete('magias-divinas-paladino','Magias Divinas','A descrição repete Evasão e não define o acesso mágico.',43),
    incomplete('santidade-paladino','Santidade','A descrição repete Sussurros e não pode ser confirmada.',44),
  ]),
  order('bardo',[
    a('inspirar','Inspirar','Com Atuar 15 por rodada, aliados que assistem podem aplicar +5 a um teste durante três rodadas.',44,['Atuar NH 10+']),
    a('incentivar','Incentivar','Com Atuar 18 por rodada, aliados recebem +2 em todos os testes de perícia.',44,['Atuar NH 12+']),
    a('fortalecer','Fortalecer','Com Atuar 21 por rodada, aliados recebem +1d6 nas Resistências e recuperam 1d3 Saúde.',44,['Atuar NH 12+','Porte 12+']),
    a('acalmar-aterrorizar','Acalmar / Aterrorizar','Atuar +2d6+3 contra Resistência Mental: acalma ou impõe −2 em perícias/atributos e −1 Resistências.',45,['Porte 13+']),
    a('invocacao-arcana-bardo','Invocação Arcana','Aprende magias simples/médias/complexas por 5/10/15 XP, dificuldades 15/18/21; não permite épicas/divinas.',45,['Acalmar / Aterrorizar']),
  ]),
  order('agente',[
    a('foco-agente','Foco','Após uma rodada e teste de Inteligência ou Percepção 20, recebe +2 em todos os testes da próxima rodada.',45),
    a('evasao-agente','Evasão','Recebe +3 Reflexos contra um adversário; combina com Evasivo/Defensivo.',46,['Agilidade 12+']),
    a('experiente-agente','Experiente','Reduz dificuldades em 5; exige NH 15/18/21 em arma simples/média/complexa.',46,['NH adequado na arma']),
    a('defensivo-agente','Defensivo','Apara como ação rápida com +2 NH ou recebe +2 Reflexos; recompras aumentam usos/bônus.',46,['NH adequado na arma'],{repeatable:true}),
    a('ofensivo-agente','Ofensivo','Após defesa ou falha do atacante, recebe um ataque extra com −1. Recompras permitem usar a habilidade mais vezes na mesma rodada.',46,['Defensivo'],{repeatable:true}),
  ]),
  order('shaman',[
    a('rituais-shaman','Rituais','REGRA CONTRADITÓRIA: a página 46 usa metade de Rituais + metade de Ocultismo + metade de Porte; a página 66 usa NH de Rituais + metade do NH de Ocultismo.',46,['Rituais NH 10+'],{status:'incomplete'}),
    a('troca-equivalente','Troca Equivalente','Substitui cada componente ausente por 20 cm² de pano branco.',47,['Estudo Arcano','Ocultismo NH 18+']),
    a('estudo-arcano','Estudo Arcano','Executa ritual conhecido como invocador, pagando 50% mais Fé em vez de materiais.',47,['Ocultismo NH 15+']),
    a('itako','Itako','Com colar sagrado, prende, expulsa ou invoca um espírito.',47,['Sincronizar Espírito']),
    a('sincronizar-espirito','Sincronizar Espírito','Pelo toque lê emoções/memórias; o espírito resiste com Porte contra Resistência Mental e não pode possuí-lo.',47),
    a('espirito-guia','Espírito Guia','Um espírito acompanha, orienta e protege o shaman, mas pode discordar dele.',47,['Porte 12+']),
  ]),
  order('militar',[
    a('sangue-frio','Sangue Frio','Após uma rodada concentrado em combate, role 1d6. A fonte publica cinco resultados: relançar 2d6 uma vez a cada 3 rodadas; +1 ataque por rodada; +50% dano com um tipo de arma; 1d3+1 RD; +1 aleatório em atributo básico. O sexto resultado não foi impresso. Trocar exige duas rodadas concentrado.',48,['Porte 12+']),
    a('equipe','Equipe','Concede cinco militares sob comando em missão; cada nível multiplica o efetivo por cinco.',48,['Outra habilidade de Militar'],{repeatable:true}),
    a('prodigio','Prodígio','Uma vez por rodada em missão, acrescenta 1d3 a um teste por compra.',48,['Agilidade 11+','Porte 11+'],{repeatable:true}),
    a('foco-missao','Foco na Missão','Distribui +3, +3 e +2 entre Resistências; dobra contra coerção para sabotar a missão.',49),
    a('coordenacao','Coordenação','Esquadrinhar exige só uma rodada; Combate Sincronizado recebe +3, aliados +1 ou Equipe +2.',49,['Poliorcética NH 15+']),
  ]),
  order('emissario',[
    a('foco-emissario','Foco','Após uma rodada e teste de Inteligência ou Percepção 20, recebe +2 em todos os testes da próxima rodada.',52),
    a('tecnologia-alien','Tecnologia Alien','Cada compra concede um dos seis Dispositivos autorizados listados no manual.',52,['Inteligência 13+'],{repeatable:true}),
    a('adaptado','Adaptado','Escolha um tipo: RD +2 e Resistências +2 contra fogo, frio, ácido, mental, eletricidade ou radiação.',52,['Vigor 12+'],{repeatable:true}),
    a('andarilho-horizonte','Andarilho do Horizonte','Após cinco minutos concentrado, viaja entre realidades e Planos.',52,['Porte 15+','Inteligência 15+','Adaptado']),
    a('frota','Frota','Compras liberam veículos espaciais para 3, 20, 150 e 2.000 pessoas.',53,['Tecnologia Alien'],{repeatable:true}),
  ]),
  order('shinobi',[
    a('comunhao-sombras','Comunhão com as Sombras','Por uma ação e com ao menos 3 Fé, funde-se a uma sombra de no mínimo 70 cm² e move-se nela à velocidade normal. A segunda compra permite teletransportar-se entre sombras a até Porte metros.',54,['Porte 15+','Furtividade NH 20+'],{repeatable:true}),
    a('sentidos-aflorados','Sentidos Aflorados','Cada compra concede +1 em todos os testes de Agilidade e Percepção, inclusive perícias, Reflexos e testes de atributo. Máximo de cinco compras; não aumenta os atributos.',54,['Percepção 12+'],{repeatable:true}),
    a('arremesso-preciso','Arremesso Preciso','Em objetos pequenos/médios, soma a Arremesso metade do Porte arredondada para cima.',54,['Percepção 13+','Agilidade 13+']),
    a('mascara-shinobi','Máscara','Contra quem não conhece sua identidade e não é Shinobi, soma ao dano 1/3 do NH de Furtividade.',54,['Sentidos Aflorados','Arremesso Preciso']),
    a('elementos-shinobi','Elementos','Aprende jutsus por 5/10/15 XP; versões modificadas costumam custar 20/25 XP.',54,['Porte 15+','Inteligência 12+']),
  ]),
]
