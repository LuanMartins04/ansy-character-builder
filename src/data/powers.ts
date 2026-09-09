import type { CatalogItem } from '../types'
const power=(id:string,name:string,cost:number,page:number,description:string,status:'confirmed'|'incomplete'='confirmed'):CatalogItem=>({id,name,cost,page,description,status})
const stub=(id:string,name:string,cost:number,page:number,detail='O manual lista o poder, mas não publica uma regra operacional completa.')=>power(id,name,cost,page,detail,'incomplete')

/** Catálogo integral dos Poderes/Limites, páginas 123–133. Conteúdo copiado de Pirocinese para outras cineses é sinalizado, não validado. */
export const hunterPowers:CatalogItem[]=[
 power('voo','Voo',10,123,'Ignora a gravidade e voa até 5 × Porte metros por segundo. Exige possuir ao menos 2 Fé, sem gastá-los. Para acelerar, cada 2 PF gastos acrescentam +1 ao Porte usado no cálculo. A origem do voo depende de aprovação do Narrador.'),
 power('mimetismo','Mimetismo',5,123,'Combina Assimilar (5) ou Adquirir (15) com Empático (25), Táctil (20) ou Óptico (30).'),
 power('manipular-espaco','Manipular Espaço',20,124,'Teletransporta o usuário e pessoas tocadas. Lugar visível dispensa teste; lugar conhecido exige Porte 15 e desconhecido Porte 18. Cada passageiro além do usuário custa 1 Fé.'),
 power('manipular-tempo','Manipular Tempo',20,124,'Pode parar o tempo até o limite da respiração, sem teste; desacelerá-lo com Porte 15, ganhando uma ação por ponto acima de 15; ou viajar no tempo com Porte 15 +1 por ano de distância, mínimo 15 para até um ano.'),
 power('fenda-espacial','Fenda Espacial',15,124,'Abre portais cujo tamanho e posição são escolhidos. Alvo sob a fenda resiste com Reflexos contra Porte +3 +1 por 3 m² de raio. Ponto não visível exige Porte +3 contra 20 se conhecido ou 25 se nunca presenciado; ambientes conectados interagem fisicamente.'),
 power('pirocinese','Pirocinese',10,124,'Sentir/Manipular/Criar custam 10/15/20. Fogo causa 1d +2 por Diferença de Porte, alcança 2 × Porte m² e explosão causa metade a até 5 m. Cada 2 PF acrescenta +1d, até +5d. Criar exige moléculas e falha no vácuo.'),
 power('criocinese','Criocinese',10,125,'Sentir/Manipular/Criar custam 10/15/20. O manual apresenta Criocinese como domínio do gelo, mas repete literalmente as regras mecânicas de Pirocinese (dano, alcance, explosão e gasto de Fé); o aplicativo preserva essa regra até haver errata oficial.'),
 power('memoria-eidetica','Memória Eidética',5,125,'Nunca esquece estímulos; procedimento observado concede +5 apenas naquela aplicação.'),
 power('invisibilidade-poder','Invisibilidade',10,125,'Controla a luz refletida pelo corpo; extensão a terceiros custa +2.'),
 stub('persuasao-poder','Persuasão',25,125),stub('aptidao-intuitiva','Aptidão Intuitiva',15,125),stub('telepatia','Telepatia',25,125,'A extensão de comando mental custa +2; a regra-base está ausente.'),
 stub('tecnopatia','Tecnopatia',20,126),stub('sentido-ampliado','Sentido Ampliado',15,126,'Escolhe Audição, Visão, Faro ou Tato/Equilíbrio; bônus não informado.'),stub('forca-ampliada','Força Ampliada',20,126),
 power('velocidade-ampliada','Velocidade Ampliada',20,126,'Concede metade do Porte, arredondada para cima, em ações de ataque extras. Ações além disso custam 3 Fé e Resistência Física 20 + quantidade pedida, causando dano/fadiga. Dano, Iniciativa e dificuldade de defesa recebem o maior entre Porte e Fé atual; colisões também ficam mais perigosas. Exige origem e fraqueza energética definidas.'),
 stub('rastreamento','Rastreamento',10,127),stub('regeneracao','Regeneração',20,127,'A extensão de não envelhecer custa +2; a regra-base está ausente.'),stub('manipular-memoria','Manipular Memória',20,127),stub('controle-fluxo-vital','Controle do Fluxo Vital',20,127),stub('metamorfose-poder','Metamorfose',15,127),stub('alquimia-poder','Alquimia',10,127),
 power('vincular','Vincular',25,127,'Conecta seres em 2 m² por Porte. Localiza conectados, usa Poderes/Habilidades Naturais deles e aplica efeitos de toque à distância. Alvo resiste com Resistência Mental contra Porte +3 +2d6; o vínculo se corta ao sair do alcance. Identificar habilidades exige Inteligência 21. A evolução de +2 compartilha perícias e Habilidades de Ordem; o Hunter pode adquirir outras Ordens normalmente com XP.'),stub('liquefacao','Liquefação',15,127),power('hidrocinese','Hidrocinese',10,127,'Sentir/Manipular/Criar custam 10/15/20. O manual apresenta Hidrocinese como domínio da água, mas repete literalmente as regras mecânicas de Pirocinese (inclusive referências a fogo); o aplicativo preserva essa regra até haver errata oficial.'),
 power('ceifar','Ceifar',20,128,'Enquanto toca pele de um ser ou objeto com as mãos nuas, ganha Saúde extra igual à Saúde/Integridade atual dele e todo dano recebido é descontado desse alvo. Quando ele chega a zero, o Hunter volta a sofrer dano. Ser vivo resiste com Resistência Física contra Porte +3 +2d6; objetos não resistem.'),stub('premonicao','Premonição',5,128),stub('intangibilidade','Intangibilidade',15,128,'Extensão a terceiros custa +2; regra-base ausente.'),stub('telecinese','Telecinese',20,128,'Extensão para objetos mais pesados custa +2; regra-base ausente.'),stub('manipular-subconsciente','Manipular Subconsciente',5,128),stub('ilusao-poder','Ilusão',15,128,'Extensão para prender o alvo custa +2; regra-base ausente.'),stub('ondas-frequencia','Manipular Ondas de Frequência',10,128),stub('hibridismo','Hibridismo',15,128,'Escolha canino, felino, anfíbio etc.; efeitos ausentes.'),stub('licantropia','Licantropia',20,128),stub('mimetismo-muscular','Mimetismo Muscular',10,128),
 power('gravitocinese','Gravitocinese',15,128,'Cria campo gravitacional limitado por visão, Porte, peso e Fé.'),power('absorver-emocao','Absorver Emoção',20,129,'Cada pessoa próxima com a emoção eleita concede +2 atributo físico ou +5 perícia física.'),stub('criar-acustica','Criar Acústica',15,129),power('fumocinese','Fumocinese',10,129,'Sentir/Manipular/Criar custam 10/15/20. O manual apresenta Fumocinese como domínio da fumaça, mas repete literalmente as regras mecânicas de Pirocinese (inclusive referências a fogo); o aplicativo preserva essa regra até haver errata oficial.'),
 power('equilibrio-perfeito','Equilíbrio Perfeito',20,130,'Não tropeça ou fica tonto; soma Porte a Acrobacia, Prestidigitação e Arremesso.'),power('eletrocinese','Eletrocinese',10,130,'Sentir/Manipular/Criar custam 10/20/30. Corrente de 110 V causa 1d3, 220 V causa 1d6 e alta tensão causa 4d6 por ação de exposição. Para não ficar paralisado, o alvo testa Resistência Física contra 13 + dano recebido. As descrições dos níveis repetem texto de fogo e devem ser lidas como inconsistência editorial.'),power('arma-natural','Arma Natural',15,130,'O personagem pode expelir um ataque que causa 1d de dano, mais +1 por ponto de Diferença de Porte.'),stub('sonar','Sonar',15,130),power('fotocinese','Fotocinese',10,130,'Sentir/Manipular/Criar custam 10/15/20. O manual apresenta Fotocinese como domínio da luz, mas repete literalmente as regras mecânicas de Pirocinese (inclusive referências a fogo); o aplicativo preserva essa regra até haver errata oficial.'),
 power('ventriloquismo','Ventriloquismo',15,131,'Sincroniza movimentos após contato visual; evolução de 30 permite comandar sem imitar.'),power('discernimento','Discernimento',5,131,'Detecta verdade ou mentira em teste resistido e ganha +3 contra novas tentativas.'),stub('envenenar-poder','Envenenar',15,131,'Envenena o ar em Porte × 10 m²; o manual não define dano, duração, resistência ou demais parâmetros.'),stub('probabilidade','Probabilidade',5,131,'Examina variáveis para buscar o melhor resultado; bônus ou procedimento mecânico ausentes.'),power('clarisciencia','Clarisciência',10,131,'Ao tocar um objeto, conhece toda a história dele.'),stub('drenar','Drenar',15,131),power('aerocinese','Aerocinese',10,131,'Sentir/Manipular/Criar custam 10/15/20. O manual apresenta Aerocinese como domínio do ar, mas repete literalmente as regras mecânicas de Pirocinese (inclusive referências a fogo); o aplicativo preserva essa regra até haver errata oficial.'),
 power('criar-vortex','Criar Vórtex',20,132,'Cria buraco negro limitado por Porte e mantido por Resistência Mental.'),power('ignicao','Ignição',10,132,'Ativa/desativa dispositivos elétricos, eletrônicos e mecânicos na área de Porte.'),power('umbracinese','Umbracinese',10,132,'Sentir/Manipular/Criar custam 10/15/20. O manual apresenta Umbracinese como domínio das sombras, mas repete literalmente as regras mecânicas de Pirocinese (inclusive referências a fogo); o aplicativo preserva essa regra até haver errata oficial.'),stub('desintegrar-poder','Desintegrar',20,133),stub('latejar','Latejar',15,133),
]

/** Textos auditados das páginas 129–132. Mantidos separados para deixar visível a
 *  diferença entre dados confirmados e as entradas incompletas do próprio PDF. */
const auditedHunterPowerDescriptions:Record<string,string>={
  gravitocinese:'Cria gravidade em uma área de até Porte m², dentro da visão/sentidos. Exige ter ao menos 3 Fé, mas seu uso não a gasta. Peso total: 5 × Porte kg; cada 2 Fé acrescenta 50%. A dificuldade inicial para resistir a ser atirado/sugado é Porte +3; +1 de dificuldade custa 1 Fé por teste e alvos que resistem no campo aumentam a dificuldade em +1 por rodada. Gravidade acima de 2× o peso só derruba; até metade do peso impõe −3 em testes físicos; entre metade e dobro aumenta dificuldade em +6. Em direções/reversão, deve superar o peso do alvo.',
  'absorver-emocao':'Para cada pessoa no raio de 2 m² por Porte que esteja com a emoção eleita, recebe +2 em um Atributo Físico (AGI, FOR ou VIG) ou +5 em Perícia Física escolhida. O manual não fixa limite de pessoas nem de bônus.',
  'equilibrio-perfeito':'Nunca tropeça nem fica tonto. Recebe bônus igual ao Porte em Acrobacia, Prestidigitação e Arremesso.',
  ventriloquismo:'Após um primeiro contato visual, obriga até a Diferença de Porte em pessoas a copiar todos os seus movimentos, inclusive fala, respiração e reflexos nervosos. Cada alvo resiste com Resistência Mental contra (Porte ×2) +3. O usuário sente feridas e toques do alvo, mas não os sofre. Evolução permite comandar movimentos sem imitá-los.',
  discernimento:'Percebe verdade ou mentira pela voz/retina. O alvo resiste com Persuadir contra Discernir + Fé/Determinação atual do Hunter. Cada nova tentativa de esconder/mentir ao Hunter concede +3 aos testes de Discernir.',
  'criar-vortex':'Com contato visual no momento da criação, cria um buraco negro de até Porte m² de diâmetro; +1 m² custa 3 Fé. Mantê-lo exige, a cada rodada, Resistência Mental dificuldade 10 + diâmetro. Alvos resistem contra 15 + diâmetro −1 a cada 5 m de distância por rodada. O Hunter não é imune. Quem é sugado faz teste de morte: apenas 2 ou 3 sobrevivem e podem aparecer em outro lugar/tempo.',
  ignicao:'Ativa/desativa dispositivos elétricos, eletrônicos e mecânicos numa área igual ao Porte. O Narrador pode pedir teste de Porte para objetos complexos. O efeito só termina por vontade, inconsciência ou morte do Hunter.',
}
for(const item of hunterPowers) if(auditedHunterPowerDescriptions[item.id]) item.description=auditedHunterPowerDescriptions[item.id]

export interface HunterPowerVariant {id:string;label:string;cost:number;description:string}
export const hunterPowerVariants:Record<string,HunterPowerVariant[]>={
  mimetismo:[
    {id:'assimilar:tacito',label:'Assimilar + Táctil',cost:25,description:'Copia enquanto mantiver proximidade após tocar.'},
    {id:'assimilar:empatico',label:'Assimilar + Empático',cost:30,description:'Copia enquanto estiver na área empática.'},
    {id:'assimilar:otico',label:'Assimilar + Ótico',cost:35,description:'Copia o uso observado enquanto mantiver proximidade.'},
    {id:'adquirir:tacito',label:'Adquirir + Táctil',cost:35,description:'Mantém o poder copiado após o toque.'},
    {id:'adquirir:empatico',label:'Adquirir + Empático',cost:40,description:'Mantém o poder copiado após contato empático.'},
    {id:'adquirir:otico',label:'Adquirir + Ótico',cost:45,description:'Mantém o poder copiado após observá-lo.'},
  ],
  pirocinese:[
    {id:'sentir',label:'Nível 1 — Sentir',cost:10,description:'Sente elevações de temperatura e fontes de fogo.'},
    {id:'manipular',label:'Nível 2 — Manipular',cost:15,description:'Manipula fontes de calor e fogo existentes.'},
    {id:'criar',label:'Nível 3 — Criar',cost:20,description:'Cria fogo quando houver moléculas; não funciona no vácuo.'},
  ],
  criocinese:[
    {id:'sentir',label:'Nível 1 — Sentir',cost:10,description:'Percebe elevações de temperatura ou fontes de fogo, conforme o texto publicado.'},
    {id:'manipular',label:'Nível 2 — Manipular',cost:15,description:'Manipula fontes conforme as regras publicadas para o poder.'},
    {id:'criar',label:'Nível 3 — Criar',cost:20,description:'Cria o efeito quando houver moléculas; não funciona no vácuo, conforme o texto publicado.'},
  ],
  hidrocinese:[
    {id:'sentir',label:'Nível 1 — Sentir',cost:10,description:'Percebe as fontes conforme o texto publicado.'},
    {id:'manipular',label:'Nível 2 — Manipular',cost:15,description:'Manipula fontes conforme as regras publicadas para o poder.'},
    {id:'criar',label:'Nível 3 — Criar',cost:20,description:'Cria o efeito quando houver moléculas; não funciona no vácuo, conforme o texto publicado.'},
  ],
  fumocinese:[
    {id:'sentir',label:'Nível 1 — Sentir',cost:10,description:'Percebe as fontes conforme o texto publicado.'},
    {id:'manipular',label:'Nível 2 — Manipular',cost:15,description:'Manipula fontes conforme as regras publicadas para o poder.'},
    {id:'criar',label:'Nível 3 — Criar',cost:20,description:'Cria o efeito quando houver moléculas; não funciona no vácuo, conforme o texto publicado.'},
  ],
  eletrocinese:[
    {id:'sentir',label:'Nível 1 — Sentir',cost:10,description:'Sente energia elétrica; o texto complementar repete a descrição de Pirocinese.'},
    {id:'manipular',label:'Nível 2 — Manipular',cost:20,description:'Controla energia elétrica; o texto complementar repete a descrição de Pirocinese.'},
    {id:'criar',label:'Nível 3 — Criar',cost:30,description:'Pode criar energia elétrica; o texto complementar repete a descrição de Pirocinese.'},
  ],
  fotocinese:[
    {id:'sentir',label:'Nível 1 — Sentir',cost:10,description:'Percebe as fontes conforme o texto publicado.'},
    {id:'manipular',label:'Nível 2 — Manipular',cost:15,description:'Manipula fontes conforme as regras publicadas para o poder.'},
    {id:'criar',label:'Nível 3 — Criar',cost:20,description:'Cria o efeito quando houver moléculas; não funciona no vácuo, conforme o texto publicado.'},
  ],
  aerocinese:[
    {id:'sentir',label:'Nível 1 — Sentir',cost:10,description:'Percebe as fontes conforme o texto publicado.'},
    {id:'manipular',label:'Nível 2 — Manipular',cost:15,description:'Manipula fontes conforme as regras publicadas para o poder.'},
    {id:'criar',label:'Nível 3 — Criar',cost:20,description:'Cria o efeito quando houver moléculas; não funciona no vácuo, conforme o texto publicado.'},
  ],
  umbracinese:[
    {id:'sentir',label:'Nível 1 — Sentir',cost:10,description:'Percebe as fontes conforme o texto publicado.'},
    {id:'manipular',label:'Nível 2 — Manipular',cost:15,description:'Manipula fontes conforme as regras publicadas para o poder.'},
    {id:'criar',label:'Nível 3 — Criar',cost:20,description:'Cria o efeito quando houver moléculas; não funciona no vácuo, conforme o texto publicado.'},
  ],
  'invisibilidade-poder':[
    {id:'pessoal',label:'Pessoal',cost:10,description:'Torna somente o Hunter invisível.'},
    {id:'terceiros',label:'Extensão para terceiros',cost:12,description:'Também pode ocultar outras pessoas.'},
  ],
  ventriloquismo:[
    {id:'sincronizar',label:'Sincronizar',cost:15,description:'Imita os movimentos do alvo após contato visual.'},
    {id:'comandar',label:'Evolução — Comandar',cost:30,description:'Comanda o alvo sem precisar imitar seus movimentos.'},
  ],
  vincular:[
    {id:'basico',label:'Vínculo básico',cost:25,description:'Localiza conectados, compartilha Poderes/Habilidades Naturais e rompe a distância de efeitos de toque.'},
    {id:'evolucao',label:'Evolução',cost:27,description:'Além do vínculo básico, compartilha graduações de perícias e Habilidades de Ordem dos conectados.'},
  ],
}

export const hunterPowerDetailPrompts:Record<string,string>={
  voo:'Defina a origem do voo aprovada pelo Narrador (propulsão, controle da gravidade ou outra).',
  'velocidade-ampliada':'Defina a origem da velocidade e a fraqueza energética que inibe o poder.',
  'absorver-emocao':'Defina qual emoção será absorvida.',
}
