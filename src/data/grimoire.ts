export type MagicLevel = 1 | 2 | 3
export type RuleStatus = 'confirmed' | 'incomplete'

export interface MagicRule {
  id: string
  name: string
  aliases?: string[]
  level: MagicLevel
  spheres: string[]
  description: string
  methods?: string[]
  faithCost?: string
  castingTime?: string
  duration?: string
  range?: string
  learnable: boolean
  status: RuleStatus
  page: number
}

// Canonical transcription of the spell index on manual pages 91–112.
// `incomplete` means that at least one operational field is blank in the source itself.
export const grimoire: MagicRule[] = [
  {id:'abencoar-arma',name:'Abençoar Arma',level:1,spheres:['Luz'],methods:['Oração','Habilidade Natural','Runas de Força'],faithCost:'2',castingTime:'1 ação',duration:'30 min por PRT',range:'Toque',description:'Imbui uma arma tocada com aura divina. Contra criaturas malignas definidas pelo Narrador, aumenta o dano em +1 por ponto de Diferença de Porte do orador, até +5. Ritual: pequeno pedaço de pano branco ou uma folha ainda verde.',learnable:true,status:'confirmed',page:91},
  {id:'acalmar',name:'Acalmar',level:1,spheres:['Espírito','Luz'],methods:['Canção de Poder','Habilidade Natural','Aprendizado','Oração'],faithCost:'2 (toque) ou 4 (área)',castingTime:'1 ação',duration:'Permanente',range:'Toque ou padrão',description:'A presença, visão ou fala do usuário emite energia positiva e acalma nervos e ânimos. Em combate, frenesi, fúria ou controle mental, exige teste resistido de Porte. Ritual: algodão.',learnable:true,status:'confirmed',page:91},
  {id:'afiar',name:'Afiar',level:2,spheres:['Entropia','Terra'],methods:['Runas de Força','Oração'],faithCost:'3',castingTime:'1 ação',duration:'1 min por Diferença de PRT',range:'Toque',description:'Aumenta o dano de uma arma cortante ou perfurante em +1 para cada 3 PF gastos, até +5.',learnable:true,status:'confirmed',page:92},
  {id:'agil',name:'Ágil',aliases:['Agilidade de Gato'],level:2,spheres:['Espírito'],description:'Aumenta Reflexos em +1 para cada 2 PF gastos, até +5.',learnable:true,status:'incomplete',page:92},
  {id:'agouro',name:'Agouro',aliases:['Mau Agouro','Agourar'],level:2,spheres:['Espírito'],description:'Prediz má sorte e impõe −2 em todos os testes físicos do alvo ou dos alvos na área.',learnable:true,status:'incomplete',page:92},
  {id:'andar-agua',name:'Andar na Água',level:1,spheres:['Água'],methods:['Oração'],faithCost:'2',castingTime:'1 ação',duration:'1 min por PRT',range:'Toque',description:'Permite caminhar sobre superfícies líquidas como se fossem sólidas.',learnable:true,status:'confirmed',page:92},
  {id:'aprisionar',name:'Aprisionar',aliases:['Prisão','Selar'],level:3,spheres:['Espírito','Terra','Entropia'],methods:['Runas','Oração'],castingTime:'5 ações',description:'Cria uma barreira ou selo que impede a saída ou movimentação do alvo.',learnable:true,status:'incomplete',page:92},
  {id:'arma-natureza',name:'Arma da Natureza',level:2,spheres:['Terra','Vida'],faithCost:'2 ou mais',castingTime:'2 ações',duration:'Sustentável',range:'Si mesmo',description:'Invoca uma arma feita de materiais naturais. Causa 1d + Diferença de PRT, com +1 de dano por PF adicional.',learnable:true,status:'confirmed',page:93},
  {id:'armadura-natureza',name:'Armadura da Natureza',level:2,spheres:['Terra','Vida'],description:'Invoca proteção formada por minerais, madeira, coral ou outros elementos naturais.',learnable:true,status:'incomplete',page:93},
  {id:'asfixia',name:'Asfixia',level:3,spheres:['Ar'],duration:'Sustentável',range:'Visão',description:'Interrompe a respiração, causando dano contínuo e podendo levar à inconsciência.',learnable:true,status:'incomplete',page:93},
  {id:'augurio',name:'Augúrio',aliases:['Premonição'],level:2,spheres:['Espírito','Espaço/Tempo'],description:'Espíritos videntes fornecem visões ou sussurros sobre acontecimentos destinados a ocorrer; o futuro ainda pode ser alterado.',learnable:true,status:'incomplete',page:93},
  {id:'aura-sagrada',name:'Aura Sagrada/Profana',level:3,spheres:['Luz','Escuridão'],methods:['Oração'],faithCost:'5',castingTime:'1 ação',duration:'1 rodada por PRT',range:'1 m² por PRT',description:'Afeta aliados de mesma índole na área: bônus em Força, Vigor e Agilidade igual ao Porte do conjurador, e em Porte igual ao dobro desse valor. Não afeta o conjurador.',learnable:true,status:'confirmed',page:94},
  {id:'aura-paz',name:'Aura de Paz',level:2,spheres:['Luz','Vida','Espírito'],description:'Quem estiver na área precisa vencer teste resistido para executar ação nociva. Termina se o conjurador agir de forma nociva.',learnable:true,status:'incomplete',page:94},
  {id:'bencao',name:'Bênção',level:1,spheres:['Luz'],methods:['Oração'],range:'Toque',description:'Concede bônus temporários em testes, resistência ou dano.',learnable:true,status:'incomplete',page:94},
  {id:'bola-fogo',name:'Bola de Fogo',level:2,spheres:['Fogo'],faithCost:'3',description:'Conjura uma esfera flamejante que explode ao contato e causa dano em área.',learnable:true,status:'incomplete',page:94},
  {id:'buraco-negro',name:'Buraco Negro',level:3,spheres:['Espaço/Tempo'],description:'Cria gravidade extrema que atrai e prende criaturas e objetos.',learnable:true,status:'incomplete',page:95},
  {id:'camuflagem',name:'Camuflagem',aliases:['Camaleão'],level:1,spheres:['Luz','Terra'],range:'Si mesmo',description:'Adapta a aparência ao ambiente e dificulta detecção visual.',learnable:true,status:'incomplete',page:95},
  {id:'cancelar-magia',name:'Cancelar Magia',level:1,spheres:['Entropia'],description:'Dissipa um feitiço ou efeito mágico ativo. Existe em versões Simples, Média e Complexa.',learnable:true,status:'incomplete',page:95},
  {id:'cegar',name:'Cegar',aliases:['Cegueira'],level:2,spheres:['Entropia'],description:'Provoca perda temporária da visão.',learnable:true,status:'incomplete',page:95},
  {id:'chuva',name:'Chuva',level:1,spheres:['Água'],description:'Gera precipitação, prejudica visibilidade e pode apagar chamas.',learnable:true,status:'incomplete',page:95},
  {id:'coma',name:'Coma',level:3,spheres:['Entropia'],description:'Induz sono profundo e prolongado, resistente a estímulos externos.',learnable:true,status:'incomplete',page:96},
  {id:'comunhao-mortos',name:'Comunhão com os Mortos',aliases:['Falar com os Mortos'],level:1,spheres:['Espírito'],description:'Permite conversar com espíritos para obter informações.',learnable:true,status:'incomplete',page:96},
  {id:'concentrado',name:'Concentrado',level:2,spheres:['Espírito'],methods:['Runas de Força','Oração'],faithCost:'2',range:'Toque',description:'Aumenta a precisão e o foco do alvo, concedendo bônus em testes de ação direcionada. Eleva Resistência Mental em +2 para cada 2 pontos de Fé gastos, até +10. Tempo e duração estão vazios no manual.',learnable:true,status:'incomplete',page:96},
  {id:'conjurar-mortos-vivos',name:'Conjurar Mortos-Vivos',level:3,spheres:['Escuridão'],description:'Invoca mortos-vivos para servir temporariamente.',learnable:true,status:'incomplete',page:96},
  {id:'controle-mortos-vivos',name:'Controle de Mortos-Vivos',level:2,spheres:['Escuridão'],description:'Assume o comando de mortos-vivos na área.',learnable:true,status:'incomplete',page:96},
  {id:'corrente-glacial',name:'Corrente Glacial',level:2,spheres:['Ar','Água'],description:'Lança fluxo contínuo de gelo, causando dano e reduzindo mobilidade.',learnable:true,status:'incomplete',page:97},
  {id:'criar-mortos-vivos',name:'Criar Mortos-Vivos',level:2,spheres:['Escuridão'],description:'Transforma cadáveres em mortos-vivos permanentes sob comando.',learnable:true,status:'incomplete',page:97},
  {id:'curar',name:'Curar',aliases:['Dar Saúde'],level:2,spheres:['Vida'],range:'Toque',description:'Restaura Saúde e remove condições debilitantes menores.',learnable:true,status:'incomplete',page:97},
  {id:'desacelerar-tempo',name:'Desacelerar Tempo',aliases:['Velocidade'],level:3,spheres:['Entropia'],faithCost:'3 por Ação de Movimento extra',range:'Si mesmo',description:'Aumenta a velocidade de movimento e reação do mago.',learnable:true,status:'incomplete',page:97},
  {id:'desintegrar',name:'Desintegrar',level:3,spheres:['Espaço/Tempo','Entropia'],faithCost:'1 por ponto de PRT',castingTime:'Padrão',duration:'Instantânea',range:'1 m por PRT',description:'Dispara um raio que reduz matéria sólida a pó, destruindo objetos ou causando dano massivo. Uma criatura resiste com Resistência Física contra DIF 15 + Porte do mago, aumentada em +1 para cada 2 pontos de Fé/Determinação extras gastos. Para mirar com precisão, o mago testa Resistência Mental 15 +1 por metro até o alvo; se falhar, o raio acerta outro alvo, que resiste pelas mesmas regras.',learnable:true,status:'confirmed',page:97},
  {id:'deslizar',name:'Deslizar',level:1,spheres:['Espaço/Tempo','Entropia'],description:'Move-se sobre superfícies lisas sem resistência por até metade do Porte em metros.',learnable:true,status:'incomplete',page:98},
  {id:'despercebido',name:'Despercebido',aliases:['Modo Invisível','Andar nas Sombras'],level:1,spheres:['Entropia','Espírito'],range:'Si mesmo',description:'Reduz a chance de detecção por visão ou audição.',learnable:true,status:'incomplete',page:98},
  {id:'destrancar',name:'Destrancar',aliases:['Chave Mestra'],level:2,spheres:['Terra'],range:'Toque',description:'Abre fechaduras, trancas e mecanismos sem chave física.',learnable:true,status:'incomplete',page:98},
  {id:'detectar-mana',name:'Detectar Mana',level:2,spheres:['Espírito'],description:'Detecta objetos e efeitos mágicos por visão ou área.',learnable:true,status:'incomplete',page:98},
  {id:'dominar',name:'Dominar',level:3,spheres:['Espírito'],description:'Submete a vontade do alvo ao comando do conjurador.',learnable:true,status:'incomplete',page:98},
  {id:'energizar',name:'Energizar',aliases:['Aumentar Poder'],level:2,spheres:['Entropia','Água','Ar','Luz','Terra'],description:'Amplia temporariamente a potência de um efeito ou alvo.',learnable:true,status:'incomplete',page:99},
  {id:'envenenar-arma',name:'Envenenar Arma',level:2,spheres:['Terra','Escuridão'],description:'Aplica efeito venenoso a uma arma.',learnable:true,status:'incomplete',page:99},
  {id:'enlouquecer',name:'Enlouquecer',aliases:['Loucura'],level:2,spheres:['Espírito'],description:'Distorce o raciocínio, os sentidos e a coerência do alvo.',learnable:true,status:'incomplete',page:99},
  {id:'enxergar-aurea',name:'Enxergar Áurea',level:1,spheres:['Espírito'],range:'Toque',description:'Visualiza energia vital e estado emocional.',learnable:true,status:'incomplete',page:99},
  {id:'enxergar-mortos',name:'Enxergar Mortos',level:1,spheres:['Espírito'],description:'Permite perceber espíritos e entidades espirituais.',learnable:true,status:'incomplete',page:99},
  {id:'escudo-fe',name:'Escudo da Fé',level:2,spheres:['Espírito','Luz'],duration:'1d rodadas',description:'Concede +2 em Resistências e RD 1 contra magia; a duração pode chegar a 5d rodadas. Custo, tempo e alcance estão vazios no manual.',learnable:true,status:'incomplete',page:99},
  {id:'escurecer',name:'Escurecer',aliases:['Crepúsculo'],level:2,spheres:['Escuridão'],description:'Reduz ou elimina a luz em uma área.',learnable:true,status:'incomplete',page:100},
  {id:'esquecimento',name:'Esquecimento',aliases:['Apagar Memória'],level:3,spheres:['Espírito'],description:'Apaga memórias do alvo.',learnable:true,status:'incomplete',page:100},
  {id:'exclusao',name:'Exclusão',aliases:['Vanguarda'],level:2,spheres:['Terra','Espírito'],description:'Cria campo que impede inimigos de atravessar uma área.',learnable:true,status:'incomplete',page:100},
  {id:'explosao',name:'Explosão',level:3,spheres:['Fogo'],description:'Libera energia concentrada e causa dano em área.',learnable:true,status:'incomplete',page:100},
  {id:'explosao-espiritual',name:'Explosão Espiritual',level:3,spheres:['Espírito'],description:'Onda de energia que atinge diretamente a essência de vivos e mortos-vivos.',learnable:true,status:'incomplete',page:100},
  {id:'expulsao',name:'Expulsão',aliases:['Banimento'],level:2,spheres:['Espírito'],description:'Força criatura extraplanar ou espiritual a retornar ao plano de origem.',learnable:true,status:'incomplete',page:100},
  {id:'falar-animais',name:'Falar com os Animais',level:1,spheres:['Espírito','Terra'],range:'Si mesmo',description:'Permite compreender e comunicar-se verbalmente com animais.',learnable:true,status:'incomplete',page:101},
  {id:'fantasma',name:'Fantasma',aliases:['Modo Fantasma'],level:1,spheres:['Entropia'],range:'Si mesmo',description:'Torna o alvo intangível, permitindo atravessar objetos sólidos não orgânicos (não funciona para atravessar seres vivos).',learnable:true,status:'incomplete',page:101},
  {id:'fascinar',name:'Fascinar',level:2,spheres:['Espírito'],description:'Prende a atenção e impede temporariamente ação contra o conjurador.',learnable:true,status:'incomplete',page:101},
  {id:'flecha-fogo',name:'Flecha de Fogo',level:2,spheres:['Fogo'],description:'Projétil ígneo contra um alvo.',learnable:true,status:'incomplete',page:101},
  {id:'flecha-acida',name:'Flecha Ácida',level:2,spheres:['Terra','Fogo'],description:'Projétil corrosivo com dano inicial e contínuo.',learnable:true,status:'incomplete',page:101},
  {id:'furacao',name:'Furacão',level:3,spheres:['Ar'],description:'Cria ventos giratórios massivos que causam dano e arremessam alvos.',learnable:true,status:'incomplete',page:101},
  {id:'garras-besta',name:'Garras da Besta',aliases:['Mãos do Inferno'],level:2,spheres:['Escuridão','Fogo'],faithCost:'3',duration:'Próximo ataque',range:'Si mesmo',description:'Torna o próximo golpe corporal cortante e aumenta o dano em +1 por Diferença de PRT, até +5. O tempo está vazio no manual.',learnable:true,status:'incomplete',page:102},
  {id:'globo-luz',name:'Globo de Luz',level:1,spheres:['Luz'],faithCost:'2',duration:'Sustentável',range:'0,5 m por PRT',description:'Cria esfera luminosa e dissipa escuridão mágica. O tempo está vazio no manual.',learnable:true,status:'incomplete',page:102},
  {id:'identificar',name:'Identificar',level:1,spheres:['Entropia','Luz'],faithCost:'2 por nível da magia',duration:'Instantânea',range:'Toque ou visão',description:'Revela propriedades e efeitos de item ou encantamento. O tempo está vazio no manual.',learnable:true,status:'incomplete',page:102},
  {id:'ilusao',name:'Ilusão',level:2,spheres:['Luz'],faithCost:'2 por m² ou 100 kg',duration:'Sustentável',range:'Visão/alvo',description:'Cria imagens ou sons falsos. O tempo está vazio no manual.',learnable:true,status:'incomplete',page:102},
  {id:'imunidade-medo',name:'Imunidade ao Medo',aliases:['Sem Medo'],level:2,spheres:['Espírito','Luz'],faithCost:'2',duration:'Sustentável',range:'Si mesmo',description:'Torna imune a intimidação, medo e pânico. O tempo está vazio no manual.',learnable:true,status:'incomplete',page:102},
  {id:'invisibilidade',name:'Invisibilidade',level:2,spheres:['Luz'],description:'Torna o alvo invisível à visão normal.',learnable:true,status:'incomplete',page:103},
  {id:'jorrar-agua',name:'Jorrar Água',level:2,spheres:['Água'],description:'Cria fluxo de água direcionado.',learnable:true,status:'incomplete',page:103},
  {id:'levitacao',name:'Levitação',aliases:['Voar'],level:2,spheres:['Ar'],description:'Permite flutuar ou voar controlando altura e direção.',learnable:true,status:'incomplete',page:103},
  {id:'invocacao',name:'Invocação',level:3,spheres:['Espaço/Tempo','Espírito','Escuridão'],description:'Chama criatura mágica para auxiliar temporariamente.',learnable:true,status:'incomplete',page:103},
  {id:'invocar-objetos',name:'Invocar Objetos',level:2,spheres:['Espaço/Tempo','Escuridão'],description:'Faz aparecer objetos inanimados conhecidos.',learnable:true,status:'incomplete',page:103},
  {id:'localizar',name:'Localizar',aliases:['Rastrear'],level:1,spheres:['Espírito','Ar'],description:'Aponta direção ou localização aproximada de alvo ou objeto.',learnable:true,status:'incomplete',page:103},
  {id:'luz-solar',name:'Luz Solar',level:2,spheres:['Luz','Vida'],description:'Emite luz solar verdadeira, capaz de ferir vulneráveis e ignorar RD não mágica na versão ofensiva descrita.',learnable:true,status:'incomplete',page:104},
  {id:'lufada-vento',name:'Lufada de Vento',level:2,spheres:['Ar'],description:'Rajada que empurra criaturas e objetos leves.',learnable:true,status:'incomplete',page:104},
  {id:'materializar-energia',name:'Materializar Energia',aliases:['Canalizar'],level:3,spheres:['Entropia'],faithCost:'3 F/D ou variável',castingTime:'Instantânea no cabeçalho; 1 ação simples na descrição',duration:'Variável',range:'100 m por PRT',description:'REGRA CONTRADITÓRIA: o cabeçalho diz Tempo Instantânea, mas a descrição exige uma ação simples. O ataque é 2d6 + Porte +3, com +1 por ação rápida adicional aguardada (máximo 5); causa 2d6 e pode ganhar +1d6 por 3 pontos de Fé/Determinação. Pode ser sustentada; ao sofrer dano, exige Resistência Mental contra dano ×2 +10.',learnable:true,status:'incomplete',page:104},
  {id:'momento-inferno',name:'Momento de Inferno',level:3,spheres:['Escuridão','Espírito'],description:'Prende mentalmente o alvo em semiplano próximo a um plano abissal.',learnable:true,status:'incomplete',page:105},
  {id:'morte-magica',name:'Morte Mágica',level:3,spheres:['Entropia'],description:'Faz o alvo esquecer permanentemente uma magia conhecida.',learnable:true,status:'incomplete',page:105},
  {id:'nao-me-olhe',name:'Não Me Olhe',aliases:['Quem me olha'],level:1,spheres:['Espaço/Tempo'],description:'Permite perceber e localizar quem observa o mago.',learnable:true,status:'incomplete',page:105},
  {id:'nevar',name:'Nevar',level:1,spheres:['Ar','Água'],description:'Produz neve, reduz visibilidade e mobilidade.',learnable:true,status:'incomplete',page:105},
  {id:'nomear',name:'Nomear',level:1,spheres:['Espírito'],description:'Nomeia um item e aumenta a qualidade de objetos comuns ou mágicos.',learnable:true,status:'incomplete',page:105},
  {id:'oraculo',name:'Oráculo',level:2,spheres:['Entropia'],description:'Fornece visões ou respostas sobre passado, presente ou futuro.',learnable:true,status:'incomplete',page:105},
  {id:'panico',name:'Pânico',aliases:['Presença Aterradora'],level:2,spheres:['Espírito'],description:'Induz medo intenso e força inimigos a recuar ou fugir.',learnable:true,status:'incomplete',page:105},
  {id:'paralisar',name:'Paralisar',level:2,spheres:['Entropia'],faithCost:'Padrão',castingTime:'1 ação',duration:'1 rodada por PRT',range:'Padrão',description:'Bloqueia pontos nervosos. Resistência Física evita; toque aumenta a dificuldade em +2.',learnable:true,status:'confirmed',page:106},
  {id:'patas-aranha',name:'Patas de Aranha',aliases:['Aderência'],level:1,spheres:['Terra'],description:'Permite escalar paredes e andar em tetos.',learnable:true,status:'incomplete',page:106},
  {id:'percepcao-raposa',name:'Percepção da Raposa',level:1,spheres:['Entropia'],methods:['Conjuração','Habilidade Natural','Oração'],description:'Eleva Percepção e aprimora sentidos.',learnable:true,status:'incomplete',page:106},
  {id:'perseguir',name:'Perseguir',level:2,spheres:['Espírito','Luz','Ar'],faithCost:'2 a cada 30 min',duration:'Concentração',range:'Toque',description:'Permite seguir um alvo com precisão, ignorando obstáculos comuns. O tempo está vazio no manual.',learnable:true,status:'incomplete',page:106},
  {id:'peso-leve',name:'Peso Leve',aliases:['Pulo das Nuvens','Salto do Gafanhoto'],level:1,spheres:['Ar','Entropia'],duration:'1 min por PRT',range:'Si mesmo',description:'Reduz peso e aumenta altura e distância dos saltos.',learnable:true,status:'incomplete',page:107},
  {id:'petrificacao',name:'Petrificação',level:3,spheres:['Terra'],description:'Transforma o alvo em pedra e o imobiliza.',learnable:true,status:'incomplete',page:107},
  {id:'proteger',name:'Proteger',aliases:['Escudo'],level:2,spheres:['Terra'],faithCost:'2 por RD, máximo 10',duration:'1 min por PRT',range:'Toque',description:'Cria proteção que aumenta a RD do alvo. O tempo está vazio no manual.',learnable:true,status:'incomplete',page:107},
  {id:'protecao-chuva',name:'Proteção Contra Chuva',level:1,spheres:['Água'],description:'Cria barreira invisível que mantém o alvo seco.',learnable:true,status:'incomplete',page:107},
  {id:'quebra-maldicao',name:'Quebra de Maldição',level:3,spheres:['Entropia','Vida'],range:'Toque',description:'Remove maldições e efeitos nocivos persistentes.',learnable:true,status:'incomplete',page:107},
  {id:'rastrear-magia',name:'Rastrear',aliases:['Seguir Rastros'],level:1,spheres:['Água'],description:'Identifica e segue rastros físicos ou mágicos.',learnable:true,status:'incomplete',page:107},
  {id:'refletir',name:'Refletir',aliases:['Contra-Ataque Mental'],level:3,spheres:['Entropia','Espírito'],description:'Devolve efeito mental ou mágico contra seu conjurador.',learnable:true,status:'incomplete',page:108},
  {id:'regenerar',name:'Regenerar',aliases:['Regeneração'],level:3,spheres:['Vida'],faithCost:'5 por nível',castingTime:'1 rodada por nível',duration:'PRT/2 rodadas',range:'Toque',description:'Regenera 1d + Porte por rodada para cada 5 pontos gastos na magia e pode restaurar membros perdidos.',learnable:true,status:'confirmed',page:108},
  {id:'reparar',name:'Reparar',aliases:['Consertar'],level:2,spheres:['Terra'],description:'Restaura objetos quebrados ao estado original.',learnable:true,status:'incomplete',page:108},
  {id:'respirar-agua',name:'Respirar na Água',aliases:['Anfíbio'],level:2,spheres:['Água'],description:'Permite respirar submerso normalmente.',learnable:true,status:'incomplete',page:108},
  {id:'rogar-maldicao',name:'Rogar Maldição',aliases:['Amaldiçoar'],level:3,spheres:['Escuridão','Entropia','Espírito'],description:'Impõe efeito negativo persistente.',learnable:true,status:'incomplete',page:108},
  {id:'sanidade',name:'Sanidade',level:2,spheres:['Vida'],range:'Toque',description:'Restaura ou protege a mente contra loucura e confusão.',learnable:true,status:'incomplete',page:108},
  {id:'semear-emocao',name:'Semear Emoção',level:2,spheres:['Vida','Espírito'],range:'Toque',description:'Implanta sentimentos que influenciam comportamento.',learnable:true,status:'incomplete',page:109},
  {id:'sentir-presenca',name:'Sentir Presença',level:1,spheres:['Espírito'],description:'Detecta seres vivos ou energias ocultas próximas.',learnable:true,status:'incomplete',page:109},
  {id:'sono',name:'Sono',aliases:['Adormecer'],level:2,spheres:['Espírito'],description:'Induz sono em um ou mais alvos.',learnable:true,status:'incomplete',page:109},
  {id:'sopro-paralisante',name:'Sopro Paralisante',level:1,spheres:['Entropia'],description:'Exala gás ou energia que paralisa temporariamente.',learnable:true,status:'incomplete',page:109},
  {id:'sugestao',name:'Sugestão',level:2,spheres:['Entropia','Espírito'],description:'Implanta ordem simples que o alvo tenta cumprir.',learnable:true,status:'incomplete',page:109},
  {id:'sussurro',name:'Sussurro',aliases:['Mensagem'],level:1,spheres:['Espírito'],description:'Transmite mensagem curta e discreta à distância.',learnable:true,status:'incomplete',page:109},
  {id:'teletransporte',name:'Teletransporte',level:3,spheres:['Espaço/Tempo'],description:'Move instantaneamente o conjurador ou alvo para local conhecido.',learnable:true,status:'incomplete',page:110},
  {id:'terraformacao',name:'Terraformação',aliases:['Planeta Nativo'],level:2,spheres:['Entropia'],faithCost:'4',duration:'1 hora por PRT',range:'Si mesmo/toque',description:'Cria ao redor do alvo gravidade, atmosfera e condições equivalentes às de seu planeta nativo. O tempo está vazio no manual.',learnable:true,status:'incomplete',page:110},
  {id:'terremoto',name:'Terremoto',level:2,spheres:['Terra'],description:'Provoca tremores violentos e instabilidade no terreno.',learnable:true,status:'incomplete',page:110},
  {id:'toque-espectral',name:'Toque Espectral',aliases:['Ferir Alma'],level:2,spheres:['Espírito'],faithCost:'2',duration:'1 rodada por PRT',range:'Toque',description:'Permite interação física com seres incorpóreos e acrescenta +1d de dano espiritual. O tempo está vazio no manual.',learnable:true,status:'incomplete',page:110},
  {id:'tornado',name:'Tornado',aliases:['Furacão'],level:2,spheres:['Ar'],description:'Invoca um tornado.',learnable:true,status:'incomplete',page:111},
  {id:'tocar',name:'Tocar',aliases:['Mãos Mágicas'],level:3,spheres:['Espaço/Tempo'],description:'Manipula objetos à distância como se fossem tocados.',learnable:true,status:'incomplete',page:111},
  {id:'transformacao',name:'Transformação',aliases:['Metamorfose'],level:3,spheres:['Entropia'],description:'Altera características físicas ou até a estrutura genética.',learnable:true,status:'incomplete',page:111},
  {id:'vigoroso',name:'Vigoroso',level:2,spheres:['Espírito'],methods:['Conjuração','Runas de Força','Oração'],faithCost:'2',range:'Toque',description:'Aumenta Resistência Física em +1 para cada 2 pontos de Fé gastos, até +5. Tempo e duração estão vazios no manual.',learnable:true,status:'incomplete',page:111},
  {id:'visao-verdade',name:'Visão da Verdade',aliases:['Revelar'],level:2,spheres:['Espírito'],description:'Enxerga através de ilusões e disfarces mágicos.',learnable:true,status:'incomplete',page:111},
  {id:'visao-aguia',name:'Visão da Águia',level:1,spheres:['Entropia'],methods:['Conjuração','Habilidade Natural','Oração'],description:'Aumenta alcance e clareza da visão.',learnable:true,status:'incomplete',page:112},
]

export const magicById = Object.fromEntries(grimoire.map(magic => [magic.id, magic]))

// Lista racial explícita da página 24. O custo segue o nível de Aprendizado (1/2/3).
export const nephalimGiftIds = [
  'abencoar-arma','aura-sagrada','bencao','andar-agua','cancelar-magia','comunhao-mortos',
  'chuva','curar','enxergar-aurea','enxergar-mortos','escudo-fe','expulsao','jorrar-agua',
  'luz-solar','peso-leve','sentir-presenca','globo-luz','sanidade','sono','respirar-agua','visao-verdade',
] as const

export const nephalimGifts = nephalimGiftIds.map(id=>magicById[id]).filter(Boolean)
