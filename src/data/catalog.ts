import type { AttributeKey, CatalogItem, RaceId } from '../types'

export const attributes: { id: AttributeKey; name: string; short: string; description: string }[] = [
  { id: 'porte', name: 'Porte', short: 'PRT', description: 'Presença, carisma, vontade e força espiritual.' },
  { id: 'forca', name: 'Força', short: 'FOR', description: 'Força bruta, carga e potência física.' },
  { id: 'agilidade', name: 'Agilidade', short: 'AGI', description: 'Destreza, coordenação e velocidade corporal.' },
  { id: 'vigor', name: 'Vigor', short: 'VIG', description: 'Constituição e capacidade de suportar ferimentos.' },
  { id: 'inteligencia', name: 'Inteligência', short: 'INT', description: 'Raciocínio, memória e aprendizado.' },
  { id: 'percepcao', name: 'Percepção', short: 'PER', description: 'Sentidos e atenção ao ambiente.' },
]

export const races: { id: RaceId; name: string; eyebrow: string; description: string; effects: string[]; unlocks: string[] }[] = [
  { id: 'tarian', name: 'Tarian', eyebrow: 'Memória ancestral', description: 'Ser antigo renascido em um corpo humano para servir na guerra contra as forças das Trevas.', effects: ['Distribua +6, +5, +4, +3, +2 e +1 entre os atributos', 'RD 1', 'Olfato Sensível: dobro do dano/efeito inalado', 'Necessita do dobro de oxigênio e prende a respiração por metade do tempo'], unlocks: ['Sentir Presença', 'Aprendizados'] },
  { id: 'humano', name: 'Humano', eyebrow: 'Adaptável', description: 'A raça padrão: diversa, ambiciosa e capaz de trilhar qualquer caminho.', effects: ['Sem ajustes raciais', 'Sem habilidades raciais automáticas'], unlocks: [] },
  { id: 'hunter', name: 'Hunter', eyebrow: 'Filho desperto', description: 'Um humano escolhido para enxergar e enfrentar aquilo que se esconde da humanidade.', effects: ['Convicção: gaste 1 Fé/Determinação para ativar por uma cena', 'Durante Convicção, imune a poderes sobrenaturais de criaturas malignas/desumanas, exceto outros Hunters', 'Durante Convicção, reduz qualquer dano sobrenatural em Fé/Determinação atual ÷ 2', 'Enxerga quais criaturas são humanas; Limites são escolhidos pelo Narrador', 'Poderes de Hunter podem exigir resistência contra 2 × Porte + nível do Poder (desumanos) ou Porte normal (humanos/Hunters)'], unlocks: ['Convicção', 'Limites de Hunter'] },
  { id: 'nephalim', name: 'Nephalim', eyebrow: 'Sangue celestial', description: 'Descendente de um anjo, cuja existência é autorizada para confrontar o mal.', effects: ['+1 em dois atributos diferentes', 'Milagre: um sucesso crítico por cena, nunca para praticar maldade', 'Inimigo do Mal: bônus e RD iguais à Diferença de Porte, mínimo +1', 'Dano dobrado por Trevas/Energia negativa'], unlocks: ['Dons Celestiais', 'Aprendizados de Luz'] },
  { id: 'anao', name: 'Anão', eyebrow: 'Sangue da pedra', description: 'Engenhoso, robusto e resistente à magia, criado para sobreviver sob a terra e enfrentar antigos inimigos.', effects: ['Força +1', 'Vigor +2', 'Fadiga +2', 'Visão Noturna', 'Resistência à Magia +1d', 'Inimigo Predileto', '+2 em um Ofício'], unlocks: [] },
  { id: 'elfo', name: 'Elfo', eyebrow: 'Luz da natureza', description: 'Ser ancestral de graça sobrenatural, ligado à vida, à magia e aos ambientes naturais.', effects: ['Agilidade +2', 'Percepção +1', 'Porte +1', 'Luz Interior, como a habilidade de Paladino', 'Visão na Penumbra', '+2 em perícias relacionadas à natureza', 'A Arte: cria objetos mágicos com uma perícia NH 9+'], unlocks: ['A Arte'] },
  { id: 'meio-elfo', name: 'Meio-Elfo', eyebrow: 'Entre dois povos', description: 'Descendente de humanos e elfos, adaptável, errante e frequentemente deslocado entre as duas culturas.', effects: ['+1 em um atributo à escolha', 'Visão na Penumbra'], unlocks: [] },
  { id: 'uh-nura', name: 'Uh-Nura', eyebrow: 'Sobrevivente da Calamidade', description: 'Refugiado de outra realidade que toca lembranças e sentimentos, mas esconde-se atrás de histórias e desconfiança.', effects: ['Modo Invisível', 'Conexão Mental', 'Toque Espectral', '−3 em Persuadir e Discernir'], unlocks: [] },
  { id: 'espirito', name: 'Espírito', eyebrow: 'Além da morte', description: 'A porção da alma que continua caminhando pelo Umbral, Spiritum ou mundo material após a morte física.', effects: ['Aparição: 2 Fé por minuto e reutilização somente após 24 horas', 'Mesmo visível não toca matéria sólida', 'Sem Fadiga fora de corpo material', 'Força=Inteligência, Agilidade=Percepção e Vigor=Vigor'], unlocks: ['Comunhão com Spiritum'] },
  { id: 'karinzed', name: 'Karinzed', eyebrow: 'Voz dos ventos', description: 'Filho da própria natureza, capaz de ouvir o vento e assimilar habilidades sobrenaturais.', effects: ['Imunidade ao Medo', '+5 em Sobrevivência', '+2 em perícias em ambiente natural', 'Mimetismo Sobrenatural'], unlocks: ['Som dos Ventos', 'Marcas'] },
  { id: 'changelin', name: 'Changelin', eyebrow: 'Essência feérica', description: 'Fada vinda de Paradísia, feita de Mana, natureza e uma inocência perigosa no mundo humano.', effects: ['Porte +3', 'Percepção +2', 'Força −1', 'Vigor −1', 'Essência Mágica: não gasta Fé ao usar magia', 'Sem Mana, morre na próxima ação', 'Inocência Cega: −4 em Persuadir e Discernir'], unlocks: ['Glamour (mudança: primavera na p. 148; 6 horas na p. 149 — fonte contraditória)', 'Caminho para Paradísia (concentração de uma ação)'] },
  { id: 'kahje', name: 'Kahje', eyebrow: 'Sobrevivente de Krhista', description: 'Estudioso pacifista de uma civilização perdida, cuja compreensão física se aproxima da criação mágica.', effects: ['Porte +2', 'Força −3', 'Agilidade −6', 'Vigor −1', 'Percepção +2', 'Inteligência +6', 'Ingenuidade: −10 na Resistência Mental contra Persuadir', 'Não é capaz de tirar a vida de qualquer ser'], unlocks: ['Dever Existencial — efeitos como Mago Criacionista; regra de compra não publicada'] },
]

export const orders: (CatalogItem & { abilities: CatalogItem[] })[] = [
  { id: 'sem-ordem', name: 'Sem Ordem', description: 'Seu caminho ainda não foi definido.', cost: 0, abilities: [] },
  { id: 'combatente', name: 'Combatente', description: 'Especialista em armas, manobras e controle do campo de batalha.', cost: 5, abilities: [
    { id: 'manobrista', name: 'Manobrista', description: '+2 cumulativo em manobras de combate.', cost: 5 },
    { id: 'defensivo', name: 'Defensivo', description: 'Apara com ação rápida ou amplia Reflexos.', cost: 5, requirements: ['NH adequado em uma arma'] },
    { id: 'ofensivo', name: 'Ofensivo', description: 'Contra-ataca após uma defesa ou falha adversária.', cost: 5, requirements: ['Defensivo'] },
    { id: 'especialista', name: 'Especialista', description: 'Amplia a faixa de sucesso crítico com uma arma.', cost: 5, requirements: ['Graduação 10 em uma arma'] },
    { id: 'experiente', name: 'Experiente', description: 'Reduz em 5 as dificuldades no uso da arma.', cost: 5, requirements: ['NH 15+ em arma simples'] },
  ]},
  { id: 'atirador', name: 'Atirador', description: 'Domina armas de alcance, precisão e combate à distância.', cost: 5, abilities: [
    { id: 'precisao', name: 'Precisão', description: 'Ao se concentrar para mirar, recebe +3 no ataque por ação empregada, em vez do +1 normal. É possível acumular até três ações, alcançando +9.', cost: 5 },
    { id: 'alcance', name: 'Alcance', description: 'Usando experiência, melhorias e modificações na arma ou munição, cobre uma distância 50% maior que o alcance normal.', cost: 5 },
    { id: 'experiente-atirador', name: 'Experiente', description: 'Sua experiência sobrepuja dificuldades: reduz em 5 os redutores aplicados ao disparo. O NH exigido depende da complexidade da arma: 15 para Simples, 18 para Média ou 21 para Complexa.', cost: 5, requirements: ['NH 15+ em Armas'] },
    { id: 'tiro-duplo', name: 'Tiro Duplo', description: 'Emprega duas ações — ou uma ação de rodada completa — e 1 ponto de Fé/Determinação para causar o dobro do dano em um ataque com redutor de −2. Armas municiadas podem consumir o dobro de munição, a critério do Narrador.', cost: 5, requirements: ['Habilidade Experiente'] },
    { id: 'recarga', name: 'Recarga', description: 'Reduz pela metade o tempo necessário para recarregar. Uma recarga de uma ação passa a não consumir ação; uma recarga de rodada completa passa a exigir somente uma ação de movimento.', cost: 5, requirements: ['NH 10+ em Armas'] },
  ]},
  { id: 'vigilante', name: 'Vigilante Noturno', description: 'Justiceiro urbano que protege quem a lei deixou para trás.', cost: 5, abilities: [
    { id: 'foco-defensivo', name: 'Foco Defensivo', description: 'Analisa ameaças para receber bônus de combate.', cost: 5 },
    { id: 'evasao', name: 'Evasão', description: '+3 em Reflexos contra um adversário escolhido.', cost: 5, requirements: ['Agilidade 12+'] },
    { id: 'resistencia-a-dor', name: 'Resistência à Dor', description: 'Continua lutando mesmo gravemente ferido.', cost: 5, requirements: ['Resistência Mental 13+'] },
    { id: 'justiceiro', name: 'Justiceiro', description: '+2 em testes para defender alguém injustiçado.', cost: 5 },
    { id: 'perseguido', name: 'Perseguido', description: 'Bônus para escapar ou ocultar-se das autoridades.', cost: 5 },
  ]},
  { id: 'mago-invocador', name: 'Mago Invocador', description: 'Estuda as Esferas e grava fórmulas para invocar magias.', cost: 5, abilities: [
    { id: 'metodo', name: 'Método de Invocação', description: 'Aprende uma forma adicional de conjurar.', cost: 5 },
    { id: 'especialidade', name: 'Especialidade', description: 'Reduz o custo de Fé de um tipo de magia.', cost: 5 },
    { id: 'linha-lei', name: 'Linha de Lei', description: 'Canaliza uma linha de Mana próxima.', cost: 5 },
    { id: 'encantar', name: 'Encantar', description: 'Manipula propriedades mágicas de objetos.', cost: 5 },
    { id: 'familiar', name: 'Familiar', description: 'Atrai um companheiro extraplanar.', cost: 5, requirements: ['Inteligência 13+'] },
  ]},
  { id:'lutador',name:'Lutador',description:'Transforma o próprio corpo em arma por treinamento, estilo e domínio do movimento.',cost:5,abilities:[] },
  { id:'sacerdote',name:'Sacerdote',description:'Intercede junto a uma divindade por meio de fé, credo, foco e obrigações.',cost:5,abilities:[] },
  { id:'barbaro',name:'Bárbaro',description:'Campeão rústico de comunidades isoladas, moldado por hostilidade, resistência e força.',cost:5,abilities:[] },
  { id:'mago-real',name:'Mago Real / Criacionista',description:'Compreende as leis do Universo e força a realidade a aceitar novos resultados, arriscando Paradoxo.',cost:5,abilities:[] },
  { id:'ladino',name:'Ladino',description:'Especialista em furtividade, oportunidade, trapaça e acesso a lugares proibidos.',cost:5,abilities:[] },
  { id:'cacador',name:'Caçador',description:'Persegue, estuda e abate presas específicas usando terreno, sentidos e preparação.',cost:5,abilities:[] },
  { id:'paladino',name:'Paladino',description:'Guerreiro da Luz guiado por fé, dever, proteção e combate às forças malignas.',cost:5,abilities:[] },
  { id:'bardo',name:'Bardo',description:'Transforma atuação, conhecimento e inspiração em influência sobre aliados e adversários.',cost:5,abilities:[] },
  { id:'agente',name:'Agente',description:'Operativo da Vigilante ou da Divina Justiça treinado para missões contra ameaças incomuns.',cost:5,abilities:[] },
  { id:'shaman',name:'Shaman',description:'Médium e ritualista que negocia, sincroniza e combate espíritos.',cost:5,abilities:[] },
  { id:'militar',name:'Militar',description:'Soldado disciplinado que atua por missão, coordenação tática, patente e comando.',cost:5,abilities:[] },
  { id:'emissario',name:'Emissário',description:'Explorador e diplomata da Vigilante com acesso a mundos, Federação e tecnologia alienígena.',cost:5,abilities:[] },
  { id:'shinobi',name:'Shinobi',description:'Agente secreto de escolas ocultas, treinado em sombras, sentidos, arremesso e jutsus.',cost:5,abilities:[] },
]

export const skills = [
  ['acrobacia','Acrobacia','agilidade',3], ['adestrar','Adestrar','porte',2], ['armas','Armas','agilidade',2],
  ['arremesso','Arremesso','agilidade',2], ['artes-marciais','Artes Marciais','agilidade',3], ['atuar','Atuar','porte',2],
  ['avaliar','Avaliar','percepcao',3], ['briga','Briga / Boxe','agilidade',1], ['conducao','Condução','agilidade',2],
  ['black-jack','Black Jack','agilidade',2], ['esporte','Esporte','vigor',2],
  ['discernir','Discernir','porte',2], ['disfarce','Disfarce','porte',3], ['furtividade','Furtividade','agilidade',1],
  ['intimidar','Intimidar','porte',2], ['observar','Observar','percepcao',1], ['ouvir','Ouvir','percepcao',1],
  ['persuadir','Persuadir','porte',2], ['poliorcetica','Poliorcética','inteligencia',2], ['prestigiditacao','Prestidigitação','agilidade',3],
  ['primeiros-socorros','Primeiros Socorros','inteligencia',1], ['rastrear','Rastrear','percepcao',3], ['rituais','Rituais','inteligencia',3],
  ['saber','Saber / Ofício','inteligencia',2], ['sentir','Sentir','percepcao',1], ['sobrevivencia','Sobrevivência','percepcao',2],
  ['idioma','Idioma','nenhum',1], ['montar','Montar','porte',2], ['natacao','Natação','vigor',2],
  ['pilotar','Pilotar','inteligencia',3], ['sacar-rapido','Sacar Rápido','agilidade',1], ['tortura','Tortura','porte',2],
  ['esfera','Esfera de Magia','nenhum',3], ['etiqueta-alien','Etiqueta Alien','inteligencia',3], ['conhecimento-terreno','Conhecimento do Terreno','inteligencia',2],
] as const

export const skillSpecializationRules: Record<string,{label:string;mode:'text'|'options';options?:{name:string;cost?:number}[]}> = {
  adestrar:{label:'Espécie ou tipo de animal',mode:'text'},
  armas:{label:'Arma',mode:'options',options:[
    {name:'Espada Curta / Punhal',cost:1},{name:'Faca / Adaga',cost:1},{name:'Porrete / Cajado',cost:1},{name:'Dardo (alcance)',cost:1},{name:'Funda / Estilingue',cost:1},{name:'Revólver',cost:1},{name:'Pistola',cost:1},{name:'Pistola Laser',cost:1},
    {name:'Espada Longa',cost:2},{name:'Machado',cost:2},{name:'Machadinha',cost:2},{name:'Foice Pequena',cost:2},{name:'Lança',cost:2},{name:'Dardo (corpo a corpo)',cost:2},{name:'Arco Longo',cost:2},{name:'Arco Curto',cost:2},{name:'Submetralhadora',cost:2},{name:'Metralhadora / Rifle de Assalto',cost:2},{name:'Espingarda',cost:2},{name:'Rifle Laser',cost:2},
    {name:'Espada de Duas Mãos',cost:3},{name:'Espada Bastarda',cost:3},{name:'Machado Duplo',cost:3},{name:'Katana',cost:3},{name:'Foice Grande',cost:3},{name:'Rifle Sniper',cost:3},{name:'Bazuca',cost:3},{name:'Canhão Laser',cost:3}
  ]},
  saber:{label:'Área de Saber ou Ofício',mode:'text'}, avaliar:{label:'Saber ou Ofício relacionado',mode:'text'}, idioma:{label:'Idioma',mode:'text'}, atuar:{label:'Forma artística ou instrumento',mode:'text'},
  conducao:{label:'Veículo terrestre',mode:'text'}, pilotar:{label:'Aeronave ou nave',mode:'text'}, montar:{label:'Montaria',mode:'text'},
  'conhecimento-terreno':{label:'Cidade, bairro ou região',mode:'text'}, esfera:{label:'Esfera',mode:'options',options:['Espaço/Tempo','Espírito','Vida','Entropia','Água','Ar','Escuridão','Fogo','Luz','Matéria','Terra'].map(name=>({name,cost:3}))}
}

export const skillDescriptions: Record<string,string> = {
  'acrobacia':'Movimentos corporais complexos e equilíbrio (DIF comum 12 ou 15). Passar por área ameaçada exige ação plena e DIF 18. Contra ataque à distância, esquiva acrobática bem-sucedida concede +2 Reflexos; falha impõe −1, e falha crítica derruba e causa 1 dano.',
  'adestrar':'Acalma, domestica ou instiga animais por meio de testes resistidos contra o Porte deles.',
  'armas':'Treinamento com uma arma específica. Cada tipo — pistola, espada longa, arco e outros — deve ser adquirido separadamente.',
  'arremesso':'Acerta alvos com lança, dardo, pedra ou outro objeto carregável. A distância máxima, em metros, é Força × 2 + Agilidade − peso do objeto em kg; distância, tamanho do alvo e ambiente alteram a dificuldade.',
  'artes-marciais':'Treinamento formal em um estilo de luta. Graduações elevadas concedem dano, aparo e ataques adicionais.',
  'atuar':'Entretenimento por canto, dança, interpretação, poesia, comédia ou instrumento, escolhido separadamente. Resultado acima de 15 chama a atenção do público. Diferente de Persuadir, o público sabe que presencia uma atuação.',
  'avaliar':'Reconhece histórico e valor atual de um objeto; raridade e informações disponíveis definem a dificuldade. Requer Saber/Ofício relacionado e o Narrador deve testar em segredo, pois o avaliador pode não perceber a falha.',
  'briga':'Combate corporal instintivo, sem a formação técnica de Artes Marciais. Concede benefícios em patamares de graduação.',
  'black-jack':'Usa objetos improvisados como armas — garrafas, canecos, ferramentas, escudos e coronhadas. Dano e durabilidade ficam a cargo do Narrador.',
  'esporte':'Treinamento em esportes, corrida e salto. Em saltos, a dificuldade básica é 12 + metros; correr ao menos 3 m concede +2.',
  'conducao':'Conduz um tipo específico de veículo terrestre. Trânsito normal dispensa teste; chegar muito mais rápido é DIF 15, atirar dirigindo DIF 18 e manobras muito arriscadas DIF 21.',
  'discernir':'Sonda intenções, contradições e tentativas de engano. Normalmente é testada em segredo pelo Narrador.',
  'disfarce':'Altera aparência, voz ou comportamento para se passar por outra pessoa ou ocultar a própria identidade.',
  'furtividade':'Move-se, segue alguém ou se esconde sem ser percebido, resistida por Observar de quem procura.',
  'intimidar':'Provoca medo ou submissão com ameaças, presença e circunstâncias favoráveis.',
  'observar':'Encontra detalhes, pistas, ameaças e personagens escondidos por meio da visão.',
  'ouvir':'Distingue ruídos, conversas distantes, sussurros e aproximações silenciosas.',
  'persuadir':'Convence, mente ou influencia alguém; pode ser resistida por Discernir, Resistência Mental ou Poliorcética.',
  'poliorcetica':'Conhecimento de tática e estratégia; analisa oponentes e coordena ações sincronizadas em combate.',
  'prestigiditacao':'Ilusionismo manual, furto discreto e manipulação técnica de trancas, cadeados e fechaduras.',
  'primeiros-socorros':'Estanca ferimentos externos e estabiliza uma vítima, impedindo agravamento imediato.',
  'rastrear':'Segue vestígios em diferentes terrenos; clima, tempo, peso e quantidade de alvos alteram a dificuldade.',
  'rituais':'Reconhece, prepara e executa efeitos mágicos por palavras, fé e componentes específicos.',
  'saber':'Conhecimento ou ofício em uma área específica, como Ocultismo, Medicina, Informática, Teologia ou Mecânica.',
  'sentir':'Percebe odores, texturas, pressentimentos e presenças através dos sentidos e do chamado sexto sentido.',
  'sobrevivencia':'Encontra água, abrigo, direção e segurança em ambientes selvagens e permite recuperação adequada nesses locais.'
  ,'idioma':'Um idioma adicional por perícia, além da língua materna. Graduação 1 decifra partes básicas com Inteligência 18; 2 compreende o idioma, salvo fundamentos complexos; 3 fala como nativo. O limite é Diferença de Inteligência +1.'
  ,'montar':'Domínio de uma espécie de montaria. Adestrar pode conceder bônus conforme suas graduações.'
  ,'natacao':'Em competição, usa testes resistidos. A profundidade de mergulho é NH/2 metros; o tempo sem respirar é Diferença de Vigor + metade da graduação. Pode boiar por NH rodadas e depois testa Fadiga a cada 5 rodadas, com −1 cumulativo após o primeiro teste.'
  ,'pilotar':'Opera aviões, helicópteros e naves. NH 10 permite uso seguro; decolagem e pouso normalmente usam DIF 15, e manobras arriscadas DIF 18 ou 20.'
  ,'sacar-rapido':'Saca um objeto embainhado usando somente uma ação rápida, ou disputa velocidade em um duelo.'
  ,'tortura':'Usa pressão física e mental para obter respostas, confrontando Resistências Física e Mental.'
  ,'esfera':'Conhecimento difícil dos caminhos fundamentais da magia. A página 61 lista Matéria e não Escuridão; a página 182 lista Escuridão e não Matéria. Ambas ficam visíveis como alternativas contraditórias da fonte.'
  ,'etiqueta-alien':'Conhecimento de culturas extraterrestres, protocolos da Federação e formas adequadas de interação.'
  ,'conhecimento-terreno':'Conhecimento detalhado de uma localidade: saídas, contatos, informantes, perigos e pontos relevantes.'
}

export const qualities: CatalogItem[] = [
  { id:'audaz', name:'Audaz', description:'+2 ao fazer algo arriscado e desnecessário.', cost:2 },
  { id:'visao-agucada', name:'Visão Aguçada', description:'+3 em testes de Observar por nível adquirido.', cost:2 },
  { id:'faro-agucado', name:'Faro Aguçado', description:'+3 em testes de Sentir usados para farejar por nível.', cost:2 },
  { id:'audicao-agucada', name:'Audição Aguçada', description:'+3 em testes de Ouvir por nível adquirido.', cost:2 },
  { id:'sono-leve', name:'Sono Leve', description:'Pode testar Ouvir 12 ou Porte 18 para acordar enquanto dorme.', cost:2 },
  { id:'equilibrista', name:'Equilibrista', description:'Recebe metade do Porte como bônus para equilibrar-se ou evitar quedas.', cost:4 },
  { id:'ambidestria', name:'Ambidestria', description:'Usa os dois lados do corpo com eficiência.', cost:8 },
  { id:'atento', name:'Atento', description:'Não sofre os efeitos de ser flanqueado.', cost:2 },
  { id:'determinado', name:'Determinado', description:'+1 de Fé/Determinação.', cost:2 },
  { id:'distorcer-realidade', name:'Distorcer Realidade', description:'Percebe o universo como algo maleável, recebe +1 Fé/Determinação e pode tornar-se Mago Real.', cost:8 },
  { id:'duro-matar', name:'Duro de Matar', description:'Acrescenta um estágio de Saúde depois de Morrendo por nível.', cost:8 },
  { id:'vitalidade-extra', name:'Vitalidade Extra', description:'+1 ponto de Saúde no estágio Sadio por nível.', cost:4 },
  { id:'fadiga-extra', name:'Fadiga Extra', description:'+1 no limite de Fadiga por nível.', cost:2 },
  { id:'evasivo', name:'Evasivo', description:'+2 em Reflexos contra um adversário escolhido.', cost:4 },
  { id:'fe-verdadeira', name:'Fé Verdadeira', description:'Permite receber magia de uma entidade superior.', cost:4 },
  { id:'aliado', name:'Aliado', description:'Possui um companheiro confiável; custo varia conforme o poder do aliado.', cost:2 },
  { id:'resoluto', name:'Resoluto', description:'+3 para resistir a medo e ameaças capazes de paralisar uma pessoa comum.', cost:2 },
  { id:'mediunidade', name:'Mediunidade', description:'Percebe e interage com espíritos; níveis superiores permitem toque e entrada no Umbral.', cost:2 },
  { id:'poder-oculto', name:'Poder Oculto', description:'Em perigo extremo, manifesta temporariamente atributos, perícias ou qualidades adicionais.', cost:2 },
  { id:'prontidao', name:'Prontidão', description:'+1 em Iniciativa e +2 para perceber perigos.', cost:2 },
  { id:'visao-periferica', name:'Visão Periférica', description:'+2 em Observar e amplo campo visual, exceto diretamente na retaguarda.', cost:4 },
  { id:'hipoalgia', name:'Hipoalgia', description:'Reduz em 1 as penalidades por ferimentos e melhora a resistência contra Tortura física.', cost:4 },
  { id:'percepcao-cegas', name:'Percepção às Cegas', description:'Ignora penalidades por cegueira enquanto audição e faro estiverem disponíveis.', cost:4, requirements:['Sentir 5', 'Ouvir 5'] },
  { id:'ysea', name:'Ysea', description:'Entra conscientemente no Sonhar e recebe +1 em um atributo do simulacro.', cost:2 },
  { id:'senso-direcao', name:'Senso de Direção', description:'Memoriza trajetos, não se perde e conhece os pontos cardeais.', cost:2 },
  { id:'senso-numerico', name:'Senso Numérico', description:'Estima quantidades, medidas e deslocamentos de forma imediata.', cost:2 },
  { id:'senso-perigo', name:'Senso do Perigo', description:'Percebe intenção hostil contra si em um raio baseado no Porte.', cost:2 },
  { id:'sagaz', name:'Sagaz', description:'+3 permanente na Iniciativa.', cost:2 },
  { id:'resistencia-magia', name:'Resistência à Magia', description:'+1d contra efeitos mágicos.', cost:4 },
  { id:'sorte', name:'Sorte', description:'Uma vez por sessão, relance um teste com +2.', cost:2 },
  { id:'visao-noturna', name:'Visão Noturna', description:'Por 4 pontos, sofre apenas −3 no escuro; por 8, enxerga perfeitamente.', cost:4 },
  { id:'habilidade-inata', name:'Habilidade: Perícia', description:'Escolha uma única perícia e receba +3 permanente nela. Só pode ser adquirida uma vez.', cost:2 },
]

export const defects: CatalogItem[] = [
  { id:'ganancia', name:'Ganância', description:'Para recusar aposta ou proposta que envolva ganho de dinheiro ou riqueza, exige teste de Resistência Mental 25.', cost:-2 },
  { id:'inimigo', name:'Inimigo', description:'Alguém procura ativamente prejudicar você.', cost:-2 },
  { id:'intolerancia', name:'Intolerância', description:'Escolha um comportamento ou grupo que seu personagem não consegue tolerar.', cost:-2 },
  { id:'ma-reputacao', name:'Má Reputação', description:'Sua fama dificulta pedidos e relações.', cost:-2 },
  { id:'principio', name:'Princípio', description:'Segue um código mesmo quando isso traz perigo.', cost:-2 },
  { id:'juramento', name:'Juramento', description:'Sua vida está comprometida com uma promessa.', cost:-2 },
  { id:'dever', name:'Dever', description:'Sente-se compelido a guardar, proteger ou interferir em favor de algo.', cost:-4 },
  { id:'insanidade-leve', name:'Insanidade Leve', description:'Perturbação menor, como distração, fantasia ou limitação cognitiva.', cost:-2 },
  { id:'insanidade-media', name:'Insanidade Média', description:'Perturbação relevante, como paranoia, fobia, agressividade ou falha de memória.', cost:-4 },
  { id:'insanidade-grave', name:'Insanidade Grave', description:'Condição severa, como comportamento homicida, depressão profunda, megalomania ou esquizofrenia.', cost:-8 },
  { id:'covardia', name:'Covardia', description:'Quando houver risco de morte, exige teste de Resistência Mental 25. Falha impõe −2 por 1d rodadas ou até o perigo passar.', cost:-2 },
  { id:'fragil', name:'Frágil', description:'Penalidades por ferimento são dobradas.', cost:-4 },
  { id:'protegido', name:'Protegido', description:'Você possui forte instinto de proteger uma pessoa. Enquanto ela estiver em perigo, recebe −2 em todos os testes até que esteja em segurança.', cost:-2, page:73 },
  { id:'cego', name:'Limitação: Cego', description:'Não possui visão; aplicações de Percepção e ações visuais são afetadas.', cost:-4 },
  { id:'maneta', name:'Limitação: Maneta', description:'Perdeu uma mão; aparar com armas médias sofre −3 e com armas grandes −6.', cost:-4 },
  { id:'perneta', name:'Limitação: Perneta', description:'Movimentação e Reflexos são reduzidos para dois terços.', cost:-4 },
  { id:'paraplegico', name:'Limitação: Paraplégico ou Amputado', description:'Movimentação e Reflexos são reduzidos à metade.', cost:-8 },
  { id:'doenca-media', name:'Doença Média', description:'Doença constante como asma, tosse ou perda temporária de sentido; o Narrador a ativa em momentos de impacto.', cost:-4 },
  { id:'doenca-grave', name:'Doença Grave', description:'Crises graves podem impor grandes penalidades, perda de capacidade ou estado de coma, conforme o diagnóstico definido.', cost:-8 },
]

export const hunterLimits: CatalogItem[] = [
  { id:'premonicao', name:'Premonição', description:'Vislumbra acontecimentos antes que ocorram.', cost:5 },
  { id:'telecinese', name:'Telecinese', description:'Move objetos pela força da vontade.', cost:20 },
  { id:'regeneracao', name:'Regeneração', description:'Seu corpo reconstitui ferimentos anormalmente.', cost:20 },
  { id:'velocidade-ampliada', name:'Velocidade Ampliada', description:'Obtém ações adicionais e movimento sobrenatural.', cost:20 },
  { id:'discernimento', name:'Discernimento', description:'Percebe a verdade nas alterações da voz e dos olhos.', cost:5 },
  { id:'eletrocinese', name:'Eletrocinese', description:'Sente e manipula correntes elétricas.', cost:10 },
]

export const celestialGifts: CatalogItem[] = [
  { id:'abencoar-arma', name:'Abençoar Arma', description:'Imbui uma arma com poder celestial.', cost:1 },
  { id:'aura-sagrada', name:'Aura Sagrada', description:'Manifesta uma presença protetora ligada à Luz.', cost:2 },
  { id:'curar', name:'Curar', description:'Restaura ferimentos através de energia positiva.', cost:2 },
  { id:'escudo-fe', name:'Escudo da Fé', description:'Cria proteção sustentada pela convicção.', cost:1 },
  { id:'expulsao', name:'Expulsão', description:'Repele entidades espirituais ou malignas.', cost:2 },
  { id:'luz-solar', name:'Luz Solar', description:'Manifesta luz capaz de ferir criaturas das Trevas.', cost:2 },
  { id:'sentir-presenca', name:'Sentir Presença', description:'Detecta presenças sobrenaturais próximas.', cost:1 },
  { id:'visao-verdade', name:'Visão da Verdade', description:'Revela ilusões e aparências sobrenaturais.', cost:3 },
]

export const generalLearnings: CatalogItem[] = [
  { id:'sentir-presenca-ap', name:'Sentir Presença', description:'Percebe a manifestação espiritual ou sobrenatural de seres próximos.', cost:1 },
  { id:'detectar-magia', name:'Detectar Magia', description:'Identifica Mana ativa, efeitos mágicos, encantamentos e sua direção aproximada.', cost:1 },
  { id:'modo-invisivel', name:'Modo Invisível', description:'Desvia a atenção de observadores para passar despercebido sem desaparecer fisicamente.', cost:1 },
  { id:'toque-espectral', name:'Toque Espectral', description:'Permite tocar e afetar seres ou estruturas de natureza espiritual.', cost:1 },
  { id:'enxergar-aurea', name:'Enxergar Áurea', description:'Revela cores e alterações da aura, oferecendo pistas sobre natureza e estado emocional.', cost:1 },
  { id:'enxergar-mortos', name:'Enxergar Mortos', description:'Permite perceber espíritos, fantasmas e outras manifestações do pós-vida.', cost:1 },
  { id:'globo-luz', name:'Globo de Luz', description:'Cria uma fonte móvel de iluminação mágica.', cost:1 },
  { id:'peso-leve', name:'Peso Leve', description:'Reduz magicamente peso e influência da gravidade sobre um alvo.', cost:1 },
  { id:'respirar-agua', name:'Respirar na Água', description:'Permite respirar normalmente enquanto estiver submerso.', cost:1 },
  { id:'sono-ap', name:'Sono', description:'Induz sono sobrenatural em um ou mais alvos suscetíveis.', cost:1 },
  { id:'cancelar-magia-ap', name:'Cancelar Magia', description:'Interrompe ou desfaz um efeito mágico existente quando sua força é superada.', cost:2 },
  { id:'comunhao-mortos', name:'Comunhão com os Mortos', description:'Estabelece comunicação consciente com espíritos e habitantes de Spiritum.', cost:2 },
  { id:'curar-ap', name:'Curar', description:'Canaliza energia vital para recuperar ferimentos do alvo.', cost:2 },
  { id:'sanidade', name:'Sanidade', description:'Estabiliza a mente e reduz perturbações ou influências mentais.', cost:2 },
  { id:'visao-verdade-ap', name:'Visão da Verdade', description:'Enxerga através de ilusões, Glamour, disfarces sobrenaturais e alterações mágicas.', cost:3 },
  { id:'luz-solar-ap', name:'Luz Solar', description:'Manifesta luz solar verdadeira, especialmente nociva a seres ligados às Trevas.', cost:3 },
]
