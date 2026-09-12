import { defects, qualities, races, skillSpecializationRules, skills } from '../data/catalog'
import { orders } from '../data/orders'
import { hunterPowers, hunterPowerDetailPrompts, hunterPowerVariants } from '../data/powers'
import { grimoire, nephalimGifts } from '../data/grimoire'
import { campaignUtilities, equipment, magicalEquipment } from '../data/equipment'
import type { AttributeKey, Character } from '../types'

export const defaultCharacter: Character = {
  name:'', player:'', age:18, concept:'', startingXp:70, raceId:'humano', raceConfirmed:false, racialChoices:[], racialAllocation:{}, raceOptions:{},
  attributes:{ porte:10, forca:10, agilidade:10, vigor:10, inteligencia:10, percepcao:10 },
  orderId:null, orderConfirmed:false, orderIds:[], orderAbilities:[], orderAbilityLevels:{}, orderAbilityDetails:{}, selectedSkills:[], skills:{}, skillSpecializations:{}, skillCosts:{}, qualities:[], defects:[], traitLevels:{}, traitDetails:{}, antecedents:{appearance:'normal',resources:0,literacy:0,renown:0}, peculiarities:[], equipment:[], carriedWeight:0, supernaturalChoices:[], supernaturalDetails:{}, magicSphereBySpell:{}
}

export function racialBonus(character: Character, key: AttributeKey) {
  if(character.raceId==='tarian')return character.racialAllocation[key]||0
  if((character.raceId==='nephalim'||character.raceId==='meio-elfo')&&character.racialChoices.includes(key))return 1
  const fixed:Partial<Record<Character['raceId'],Partial<Record<AttributeKey,number>>>>={
    anao:{forca:1,vigor:2},elfo:{agilidade:2,percepcao:1,porte:1},changelin:{porte:3,percepcao:2,forca:-1,vigor:-1},kahje:{porte:2,forca:-3,agilidade:-6,vigor:-1,percepcao:2,inteligencia:6}
  }
  return fixed[character.raceId]?.[key]||0
}
export function ageAttributeModifier(age:number,key:AttributeKey){
  if(age<=10)return -(10-Math.max(1,age))
  if(age<=45)return 0
  if(age<=50)return ({porte:1,forca:-1,vigor:-1} as Partial<Record<AttributeKey,number>>)[key]||0
  if(age<=60)return ({forca:-1,vigor:-1,percepcao:-1} as Partial<Record<AttributeKey,number>>)[key]||0
  if(age<=70)return ({forca:-1,agilidade:-1,vigor:-1,percepcao:-1} as Partial<Record<AttributeKey,number>>)[key]||0
  if(age<=100)return ({forca:-1,agilidade:-1,vigor:-1,inteligencia:-1,percepcao:-1} as Partial<Record<AttributeKey,number>>)[key]||0
  // A tabela publicada encerra em 91–100 anos; não prolongamos esse redutor por suposição.
  return 0
}
export function finalAttribute(character: Character, key: AttributeKey) {
  const source=character.raceId==='espirito'?({forca:'inteligencia',agilidade:'percepcao'} as Partial<Record<AttributeKey,AttributeKey>>)[key]:undefined
  const actual=source||key
  const humanCycle=['humano','hunter'].includes(character.raceId)||character.raceOptions.ageCycle==='human'
  const age=humanCycle?ageAttributeModifier(character.age,key):0
  const total=character.attributes[actual] + racialBonus(character,actual) + age
  return character.defects.includes('cego')&&key==='percepcao'?total*2/3:total
}
export function difference(value:number) { return value - 10 }
/** Dificuldades-base da p. 155. O Narrador ainda pode definir uma dificuldade
 * contextual, por isso resolveTest também aceita qualquer valor numérico. */
export const testDifficulties={facil:9,media:12,desafiadora:15,dificil:18,monumental:21,epica:25} as const
/** A Ingenuidade Kahje só se aplica a tentativas de Persuadir, não à Resistência Mental inteira. */
export function persuasionResistance(character:Character){return derived(character).mental+(character.raceId==='kahje'?-10:0)}
export type TestResult={total:number;success:boolean;critical:'success'|'failure'|null}
/** Regra-base de testes, p. 155–157: duplo 6 vence automaticamente e duplo 1 falha automaticamente. */
export function resolveTest(dice:[number,number],modifier=0,difficulty=0):TestResult{
  if(dice.some(value=>!Number.isInteger(value)||value<1||value>6))throw new Error('Dados Ansy devem estar entre 1 e 6.')
  const total=dice[0]+dice[1]+modifier
  if(dice[0]===6&&dice[1]===6)return {total,success:true,critical:'success'}
  if(dice[0]===1&&dice[1]===1)return {total,success:false,critical:'failure'}
  return {total,success:total>=difficulty,critical:null}
}
/** Em empate de dois sucessos críticos, a fonte exige novo 1d6; a função sinaliza isso ao chamador. */
export function resolveResistedTest(attacker:TestResult,defender:TestResult){
  if(attacker.critical==='success'&&defender.critical==='success')return {winner:'tie-break' as const}
  if(attacker.critical==='success')return {winner:'attacker' as const}
  if(defender.critical==='success')return {winner:'defender' as const}
  if(attacker.critical==='failure')return {winner:'defender' as const}
  if(defender.critical==='failure')return {winner:'attacker' as const}
  return {winner:attacker.total===defender.total?'tie-break' as const:attacker.total>defender.total?'attacker' as const:'defender' as const}
}
/** P. 157: dois sucessos críticos, ou outro empate resistido, usam 1d6 sem modificador e repetem em novo empate. */
export function resolveTieBreak(attackerDie:number,defenderDie:number){
  if(!Number.isInteger(attackerDie)||!Number.isInteger(defenderDie)||attackerDie<1||attackerDie>6||defenderDie<1||defenderDie>6)throw new Error('Desempate Ansy usa 1d6 para cada lado.')
  return {winner:attackerDie===defenderDie?'tie-break' as const:attackerDie>defenderDie?'attacker' as const:'defender' as const}
}
/** Coragem pode reduzir uma Falha Crítica a falha comum por 10 FID; a limitação por sessão é do Narrador. */
export function mitigateCriticalFailure(result:TestResult,availableFaith:number,useCourage:boolean){
  if(result.critical!=='failure'||!useCourage||availableFaith<10)return {result,faithSpent:0}
  return {result:{...result,critical:null,success:false},faithSpent:10}
}
/** Convicção de Hunter, p. 17: a ativação custa 1 FID e dura uma cena.
 * O redutor permanece fracionário porque o manual não manda arredondar. */
export function hunterConviction(availableFaith:number){
  const active=availableFaith>=1
  return {active,faithSpent:active?1:0,supernaturalDamageReduction:active?availableFaith/2:0,
    immunity:'Poderes sobrenaturais de criaturas malignas ou desumanas, exceto Hunters'}
}
/** Dificuldade que um alvo usa contra um Limite de Hunter quando a regra do Limite
 * permitir resistência. Humanos comuns e outros Hunters não usam o multiplicador. */
export function hunterPowerResistanceDifficulty(character:Character,powerLevel:number,target:'humano-ou-hunter'|'desumano'){
  if(!Number.isFinite(powerLevel)||powerLevel<0)throw new Error('Nível do Limite deve ser não negativo.')
  const porte=finalAttribute(character,'porte')
  return target==='desumano'?2*porte+powerLevel:porte
}
/** Bônus que só existem em uma cena específica e, por isso, não podem inflar o
 * NH permanente da ficha. O chamador informa o contexto confirmado pelo Narrador. */
export type RacialTestContext={targetIsDwarfFavoredEnemy?:boolean;targetIsMalignant?:boolean;naturalSkill?:boolean}
export function racialContextEffects(character:Character,context:RacialTestContext={}){
  let testBonus=0,damageBonus=0,damageReduction=0
  if(character.raceId==='anao'&&context.targetIsDwarfFavoredEnemy){testBonus+=2;damageBonus+=1}
  if(character.raceId==='elfo'&&context.naturalSkill)testBonus+=2
  if(character.raceId==='nephalim'&&context.targetIsMalignant){const bonus=Math.max(1,difference(finalAttribute(character,'porte')));testBonus+=bonus;damageReduction+=bonus}
  if(character.raceId==='karinzed'&&context.naturalSkill)testBonus+=2
  return {testBonus,damageBonus,damageReduction}
}
/** Passivos raciais que não pertencem ao NH permanente, p. 15. Evolução de
 * Tarian é progresso de campanha sem gatilho de criação e não entra aqui. */
export function racialPassiveEffects(character:Character){
  if(character.raceId==='tarian')return {naturalPhysicalDamageReduction:1,inhaledDamageMultiplier:2,heldBreathMultiplier:.5}
  return {naturalPhysicalDamageReduction:0,inhaledDamageMultiplier:1,heldBreathMultiplier:1}
}
export function attributeXp(character:Character) { return Object.values(character.attributes).reduce((sum,value)=>sum + (value-10)*10,0) }
/** Perícias comuns sempre usam o custo publicado. Só Armas varia por especialização. */
export function skillPointCost(character:Character,instance:string){const base=instance.split(':')[0];const published=skills.find(([id])=>id===base)?.[3]||1;return base==='armas'?(character.skillCosts[instance]||published):published}
export function skillPointsSpent(character:Character) { return Object.entries(character.skills).reduce((sum,[instance,graduation])=>sum+graduation*skillPointCost(character,instance),0) }
export function freeSkillPoints(character:Character){return finalAttribute(character,'inteligencia')+Math.max(0,character.age-15)}
export function skillCost(character:Character) { return Math.max(0,skillPointsSpent(character)-freeSkillPoints(character)) }
/** P. 56: idade ÷ 4 + [INT]. O colchete se refere ao valor inteiro de
 * Inteligência, não à sua Diferença em relação a 10. */
export function maxSkillGraduation(character:Character){return Math.max(0,Math.floor(character.age/4)+finalAttribute(character,'inteligencia'))}
export function traitsCost(character:Character) {
  const appearanceCosts:Record<string,number>={hediondo:-8,'muito-feio':-4,feio:-2,normal:0,atraente:2,bonito:4,'muito-bonito':8}
  const antecedentCost=(appearanceCosts[character.antecedents.appearance]||0)+character.antecedents.resources*2+character.antecedents.literacy+character.antecedents.renown*2
  const tiered:Record<string,number[]>={'resistencia-magia':[4,8],sorte:[2,16],mediunidade:[2,4,8,16],'visao-noturna':[4,8],aliado:[2,4,8,4,8,16],inimigo:[-2,-4],juramento:[-2,-4]}
  const repeatable=new Set(['visao-agucada','faro-agucado','audicao-agucada','duro-matar','vitalidade-extra','fadiga-extra','poder-oculto','determinado','hipoalgia','ma-reputacao'])
  const costOf=(x:{id:string;cost:number})=>{const level=Math.max(1,character.traitLevels[x.id]||1);if(x.id==='habilidade-inata'){const skillId=character.traitDetails[x.id]||'';return skillPointCost(character,skillId)*2}return tiered[x.id]?.[Math.min(level,tiered[x.id].length)-1]??x.cost*(repeatable.has(x.id)?level:1)}
  return antecedentCost+qualities.filter(x=>character.qualities.includes(x.id)).reduce((s,x)=>s+costOf(x),0)
    + defects.filter(x=>character.defects.includes(x.id)).reduce((s,x)=>s+costOf(x),0)
    - character.peculiarities.length
}
export function supernaturalCost(character:Character) {
  if(character.raceId==='hunter')return hunterPowers.filter(x=>character.supernaturalChoices.includes(x.id)).reduce((s,x)=>{const variants=hunterPowerVariants[x.id],selected=variants?.find(v=>v.id===character.supernaturalDetails[x.id]);return s+(selected?.cost??x.cost)},0)
  if(character.orderAbilities.includes('invocacao-arcana-bardo')||character.orderAbilities.includes('elementos-shinobi'))return grimoire.filter(x=>character.supernaturalChoices.includes(x.id)).reduce((s,x)=>s+x.level*5,0)
  return 0
}
/** Nephalim pode aprender o mesmo efeito como Dom racial ou via Esferas. Uma magia
 * marcada com Esfera usa o treinamento arcano; sem Esfera, consome a capacidade racial. */
export function learningPointsUsed(character:Character){return grimoire.filter(x=>character.supernaturalChoices.includes(x.id)&&!(character.raceId==='nephalim'&&character.magicSphereBySpell[x.id])).reduce((s,x)=>s+x.level,0)}
export function orderCost(character:Character) {
  const selected=character.orderIds.length?character.orderIds:(character.orderId?[character.orderId]:[])
  const memberships=selected.reduce((sum,_,index)=>sum+(index<2?5:index*5),0)
  return memberships+character.orderAbilities.reduce((sum,id)=>sum+5*Math.max(1,character.orderAbilityLevels[id]||1),0)
}
export function spentXp(character:Character) { return attributeXp(character)+skillCost(character)+traitsCost(character)+orderCost(character)+supernaturalCost(character) }
export function remainingXp(character:Character) { return character.startingXp-spentXp(character) }
/** P. 11: personagens comuns começam com qualquer total entre 50 e 70 XP;
 * 75 e 80 são as duas exceções expressamente autorizadas ao Narrador. */
export function isPublishedStartingXp(value:number){return Number.isInteger(value)&&((value>=50&&value<=70)||value===75||value===80)}
export function encumbrance(character:Character){const force=Math.max(0,finalAttribute(character,'forca')),weight=Math.max(0,character.carriedWeight||0);if(weight<=force/5)return {level:'Nenhuma carga',penalty:'Nenhuma',penaltyValue:0,movement:0,status:'confirmed' as const};if(weight<=force/2)return {level:'Leve',penalty:'O manual não publica a penalidade desta faixa.',penaltyValue:null,movement:0,status:'incomplete' as const};if(weight<=force)return {level:'Média',penalty:'−1 em testes de perícias afetadas pelo peso',penaltyValue:-1,movement:0,status:'confirmed' as const};if(weight<=force*2)return {level:'Pesada',penalty:'−2 em testes de perícias afetadas pelo peso; o valor de Deslocamento está truncado.',penaltyValue:-2,movement:null,status:'incomplete' as const};return {level:'Sobrepeso',penalty:'−4; cada 2 kg acima de 2× Força agrava a carga',penaltyValue:-4,movement:-4,status:'confirmed' as const}}
export function derived(character:Character) {
  const a=(key:AttributeKey)=>finalAttribute(character,key)
  const vigor=a('vigor'), level=(id:string)=>character.qualities.includes(id)?Math.max(1,character.traitLevels[id]||1):0, determinado=level('determinado'), prontidao=level('prontidao'), vitalidade=level('vitalidade-extra'), duro=level('duro-matar')
  const barbarianHealth=character.orderAbilities.includes('resistente-barbaro')?Math.max(1,character.orderAbilityLevels['resistente-barbaro']||1):0
  // P. 29: cada um dos cinco estágios vale Vigor ÷ 2, arredondado para cima.
  // Os números exibidos são limites cumulativos, logo todos avançam pelo mesmo
  // tamanho de estágio (VIG 11: 6 / 12 / 18 / 24 / 30).
  const healthStageSize=Math.ceil(vigor/2)
  const health=[1,2,3,4,5].map(stage=>healthStageSize*stage)
  // Vitalidade Extra e Resistente Bárbaro mencionam expressamente Sadio.
  health[0]+=vitalidade+barbarianHealth
  for(let i=1;i<=duro;i++)health.push(healthStageSize*(5+i))
  const reflexBase=Math.round(Math.max(a('agilidade'),a('percepcao'))*2/3)+(character.orderAbilities.includes('sentidos-aflorados')?Math.max(1,character.orderAbilityLevels['sentidos-aflorados']||1):0)
  const reflexes=character.defects.includes('paraplegico')?reflexBase/2:character.defects.includes('perneta')?reflexBase*2/3:reflexBase
  return {
    health,
    fatigue:character.raceId==='espirito'?0:a('forca')+(character.raceId==='anao'?2:0)+level('fadiga-extra'), faith:a('porte')+determinado+level('distorcer-realidade'), initiative:difference(a('agilidade'))+prontidao+(character.qualities.includes('sagaz')?3:0), renown:character.antecedents.renown,
    physical:Math.ceil((a('forca')+vigor)/2), mental:Math.ceil((a('porte')+a('inteligencia'))/2),
    reflexes, evasiveReflexes:character.qualities.includes('evasivo')?reflexes+2:null
  }
}
/** Marcos cumulativos de Saúde da p. 27. A ficha cria os limites; dano atual é estado de jogo e não é salvo na criação. */
export function healthStages(character:Character){
  const [sadio,atordoado,ferido,incapacitado,morrendo]=derived(character).health
  return [
    {name:'Sadio',threshold:sadio,penalty:0},
    {name:'Atordoado',threshold:atordoado,penalty:-1},
    {name:'Ferido',threshold:ferido,penalty:-2},
    {name:'Incapacitado',threshold:incapacitado,penalty:-4},
    {name:'Morrendo',threshold:morrendo,penalty:-8},
  ]
}
/** Teste de Morte, p. 161–163. A tabela publicada vai de 2 a 12;
 * resultados agravados acima de 12 ficam a cargo do Narrador. */
export function deathTestOutcome(result:number){
  if(!Number.isInteger(result)||result<2)throw new Error('Teste de Morte usa resultado inteiro de 2d6.')
  if(result===2)return {state:'Acordado' as const,detail:'0 Saúde; move 1,5 m por ação e não executa esforço intenso.'}
  if(result<=4)return {state:'Inconsciente' as const,detail:'Acorda em 2d+1 rodadas no estado Acordado.'}
  if(result<=6)return {state:'Sangrando' as const,detail:'Após 1d+2 h, testa Resistência Física 20; falha aumenta o resultado em 1d.'}
  if(result<=9)return {state:'Estado Grave' as const,detail:'Morre em 1d+2 h sem ajuda médica.'}
  if(result<=11)return {state:'Moribundo' as const,detail:'Morre em 1d+1 rodadas sem salvamento urgente.'}
  if(result===12)return {state:'Morto' as const,detail:'Não há mais nada a fazer pelo personagem.'}
  return {state:'Não publicado' as const,detail:'A tabela do manual não descreve resultado acima de 12.'}
}
/** O exemplo publicado aplica +1 por cada três pontos que ultrapassam a Saúde restante. */
export function deathTestOverkillModifier(healthBefore:number,damage:number){
  return Math.max(0,Math.floor((Math.max(0,damage)-Math.max(0,healthBefore))/3))
}
/** Modificadores de ataque localizado publicados na p. 167. O efeito final
 * depende do local e do tipo de dano, por isso só os redutores objetivos são
 * calculados aqui. */
export const localizedAttackPenalties={cabeca:-4,pescoco:-5,olhos:-6,bracos:-4,maos:-5,pernas:-4,pes:-5} as const
export type LocalizedTarget=keyof typeof localizedAttackPenalties
/** Crânio humanoide: RD 3 e teste de Resistência Física para dano que a
 * ultrapasse (p. 167). Consequências seguem sob decisão do Narrador. */
export function headHitResistanceDifficulty(damage:number,damageReduction=3){
  if(!Number.isFinite(damage)||!Number.isFinite(damageReduction))throw new Error('Dano e RD devem ser números finitos.')
  const overflow=Math.max(0,damage-damageReduction)
  return {overflow,difficulty:overflow?2*overflow+20:null}
}
/** P. 165: dano na cabeça exige RF contra dano +5, ou dano +10 se elétrico/contusão. */
export function knockoutDifficulty(headDamage:number,type:'normal'|'eletrico-ou-contusao'='normal'){
  if(!Number.isFinite(headDamage)||headDamage<0)throw new Error('Dano na cabeça deve ser não negativo.')
  return headDamage+(type==='eletrico-ou-contusao'?10:5)
}
/** P. 166–167: CdT é a quantidade de tiros e Dispersão reduz cada tiro posterior. */
export function burstShotModifiers(cadence:number,dispersion:number){
  if(!Number.isInteger(cadence)||cadence<1||!Number.isFinite(dispersion)||dispersion<0)throw new Error('CdT deve ser inteiro positivo e Dispersão não negativa.')
  return Array.from({length:cadence},(_,index)=>index===0?0:-dispersion*index)
}
/** Dano final, p. 160: primeiro subtrai RD; perfurante dobra o excedente e
 * cortante aumenta-o em 50%, sempre arredondando para cima. */
export function combatDamage(attackDamage:number,damageReduction=0,type:'normal'|'perfurante'|'cortante'='normal'){
  if(!Number.isFinite(attackDamage)||!Number.isFinite(damageReduction))throw new Error('Dano e RD devem ser números finitos.')
  const afterReduction=Math.max(0,attackDamage-damageReduction)
  const finalDamage=type==='perfurante'?afterReduction*2:type==='cortante'?Math.ceil(afterReduction*1.5):afterReduction
  return {afterReduction,finalDamage}
}
/** Modificadores objetivos do alvo para ataques com arma de fogo, p. 161. */
export const firearmTargetModifiers={emPe:0,deitado:-2,agachado:-1,correndo:-2,'em-combate':-1,andando:0,parado:1} as const
/** Manobras com matemática completa no texto das pp. 163–166. Alcance e
 * consequências narrativas não são convertidos em bônus ocultos. */
export const combatManeuverModifiers={
  soco:{attack:0,damage:'1d6 + Diferença de Força'},
  chute:{attack:-2,damage:'1d6 + 2',balanceDifficulty:10},
  joelhada:{attack:-2,damage:'1d6 + 2',balanceDifficulty:10},
  cabecada:{attack:1,damageBonus:2,selfDamageFraction:1/3,selfDamageRoundUp:true},
  cotovelada:{attack:-1,damage:'1d6 + 3',defense:-1,defenseRounds:1},
  contraAtaqueOfensivo:{defense:-3,attack:2,damageAlternative:1},
  contraAtaqueDefensivo:{attack:-2,damage:-1,defense:2},
  defesaTotal:{defense:4,movementFraction:.5,attackIfBroken:-15,nextRoundActionsLost:1},
  investida:{minimumRunMeters:4,attack:1,damageBonus:3,defense:-4,damageBonusAlternative:4,defenseAlternative:-5,postActionMovementMeters:1.5,balanceDifficulty:15},
  ataqueForca:{damageBonus:3,resistance:-2,attack:-2},
  ataquePreciso:{attack:3,damage:-2},
  rasteira:{attack:-4,fallDamage:1},
  desarmarTomar:{attack:-3},
  fraturar:{automaticHit:true,damageBonus:2,physicalResistanceBaseDifficulty:10},
  golpeMisericordia:{attack:3,damageMultiplier:1.5,resistance:-5,aimRounds:2,physicalResistanceBonusDifficulty:10,deathTestIncrease:'1d6'},
} as const
/** Mirar recebe +2 na primeira rodada e +1 a cada duas seguintes, até +4. */
export function aimingBonus(rounds:number){
  if(!Number.isInteger(rounds)||rounds<0)throw new Error('Rodadas mirando devem ser um inteiro não negativo.')
  return Math.min(4,rounds===0?0:2+Math.floor((rounds-1)/2))
}
/** Golpe em arco: cada alvo adicional defende melhor e recebe menos dano. */
export function arcStrikeModifiers(targetIndex:number){
  if(!Number.isInteger(targetIndex)||targetIndex<1)throw new Error('A posição do alvo começa em 1.')
  return {defenseBonus:targetIndex,damageReduction:targetIndex-1}
}
/** Esquadrinhar em Combate, p. 168. O bônus após falha é estado de jogo e não
 * é incorporado à ficha permanente. */
export function combatSquadroning(targetCombatSkill:number,roundsObserved:number){
  if(!Number.isFinite(targetCombatSkill)||!Number.isInteger(roundsObserved)||roundsObserved<0)throw new Error('NH e rodadas devem ser valores válidos.')
  const rounds=Math.min(9,roundsObserved)
  return {difficulty:targetCombatSkill+5,rounds,successBonus:2*Math.floor(rounds/3),failedAttemptMaxRounds:6,failedAttemptMaxBonus:4}
}
/** Combate Sincronizado, pp. 168–169. Só entram no NH compartilhado os testes
 * bem-sucedidos; cada falha reduz o grupo em 2 e Reflexos recebe +1 por membro. */
export function synchronizedCombat(poliorceticaResults:number[],successful:boolean[]){
  if(poliorceticaResults.length===0||poliorceticaResults.length!==successful.length||!poliorceticaResults.every(Number.isFinite))throw new Error('Informe um resultado e sucesso para cada participante.')
  const members=poliorceticaResults.length
  const successes=poliorceticaResults.filter((_,index)=>successful[index])
  const failures=members-successes.length
  return {difficulty:10+members,memberTestPenalty:-1,sharedCombatNh:successes.length?successes.reduce((sum,value)=>sum+value,0)/members-failures*2:null,reflexBonus:members,failures}
}
/** Privações, p. 169: os primeiros testes usam estes marcos; testes seguintes
 * ocorrem a cada três horas e recebem -1 cumulativo. */
export function deprivationThresholds(vigor:number,force:number){
  if(!Number.isFinite(vigor)||!Number.isFinite(force)||vigor<0||force<0)throw new Error('Vigor e Força devem ser não negativos.')
  return {foodHours:Math.ceil(vigor/2),waterHours:Math.floor(vigor/3),repeatTestEveryHours:3,repeatTestPenalty:-1,faintAtFatigue:force}
}
/** P. 169–170: fôlego é expresso em ações de três segundos. */
export function heldBreath(vigor:number,healthLevelsAboveSadio=0,physicalExertion=false,fatigue=0){
  if(![vigor,healthLevelsAboveSadio,fatigue].every(value=>Number.isFinite(value)&&value>=0))throw new Error('Valores de fôlego devem ser não negativos.')
  const actions=Math.max(0,vigor*2-healthLevelsAboveSadio*4-(physicalExertion?5:0)-fatigue*2)
  return {actions,seconds:actions*3,extendedTestDifficulty:25,extendedTestIncreaseEverySeconds:3}
}
/** Recuperação Natural, p. 170: uma tentativa por 24 h e dificuldade igual a
 * 12 + Saúde perdida. Penalidades contextuais são retornadas, não ocultadas. */
export function naturalRecovery(healthLost:number,context:{firstAidBonus?:number;medicineBonus?:number;woundsUnclean?:boolean;hungry?:boolean;fatigueGainedToday?:number;internalHemorrhage?:boolean}={}){
  if(!Number.isFinite(healthLost)||healthLost<0)throw new Error('Saúde perdida deve ser não negativa.')
  const modifier=(context.firstAidBonus||0)+(context.medicineBonus||0)+(context.woundsUnclean?-2:0)+(context.hungry?-2:0)-Math.max(0,context.fatigueGainedToday||0)+(context.internalHemorrhage?-5:0)
  return {intervalHours:24,difficulty:12+healthLost,modifier,healthRecoveredOnSuccess:1,healthLostAfterTwoConsecutiveFailures:1}
}
/** Primeiros Socorros e Medicina, p. 170–171, com os únicos números publicados. */
export function medicalDifficulties(healthLost:number,hasFullSurgeryEquipment:boolean){
  if(!Number.isFinite(healthLost)||healthLost<0)throw new Error('Saúde perdida deve ser não negativa.')
  return {firstAidCleaning:10+healthLost,surgeryForeignBody:hasFullSurgeryEquipment?20:35,stopInternalHemorrhage:(hasFullSurgeryEquipment?15:25)+healthLost}
}
/** Valores publicados para amputação por Medicina, p. 65. A escolha do membro
 * é clínica/narrativa; esta função mantém apenas a dificuldade e o dano certos. */
export function amputationProcedure(member:'pequeno'|'medio'|'grande',hasAppropriateEquipment:boolean){
  const base={pequeno:20,medio:25,grande:30}[member]
  const difficulty=base+(hasAppropriateEquipment?0:10)
  return {difficulty,healthDamage:Math.ceil(difficulty/2)}
}
/** Rastrear, p. 66: o Narrador informa o ajuste do terreno (0, +1 ou +2),
 * pois a fonte o vincula às condições concretas de rigidez/fofura. */
export function trackingDifficulty(hoursOfRain:number,hoursPassed:number,weightKg:number,additionalTargets=0,terrainModifier=0){
  if(![hoursOfRain,hoursPassed,weightKg,additionalTargets,terrainModifier].every(Number.isFinite))throw new Error('Parâmetros de rastreio devem ser números finitos.')
  return 15+Math.max(0,Math.floor(hoursOfRain))+2*Math.floor(Math.max(0,hoursPassed)/12)-Math.floor(Math.max(0,weightKg)/10)-Math.max(0,Math.floor(additionalTargets))+terrainModifier
}
/** Sacar Rápido, p. 66: o manual fixa as dificuldades de objetos pequenos e médios. */
export function quickDrawDifficulty(size:'pequeno'|'medio'){return size==='pequeno'?15:18}
/** Recuperação de Fadiga, p. 172, é a última fórmula Ansy antes do trecho d20. */
export function fatigueRecoveryMinutes(fatigue:number){
  if(!Number.isInteger(fatigue)||fatigue<0)throw new Error('Fadiga deve ser inteiro não negativo.')
  return fatigue===0?0:5+(fatigue-1)*2
}
/** Simulacros e Avatares, p. 176: ao visitar plano imaterial, os atributos
 * mentais originam a cópia física. O manual só define estes três mapeamentos;
 * os demais efeitos na ficha são recalculados pelo Narrador. */
export function simulacrumPhysicalAttributes(mental:{porte:number;inteligencia:number;percepcao:number}){
  if(!Object.values(mental).every(Number.isFinite))throw new Error('Atributos mentais do simulacro devem ser números finitos.')
  return {vigor:mental.porte,agilidade:mental.percepcao,forca:mental.inteligencia}
}
export function skillNh(character:Character,id:string,attribute:AttributeKey|'nenhum') { const base=id.split(':')[0],talent=character.qualities.includes('habilidade-inata')&&[id,base].includes(character.traitDetails['habilidade-inata'])?3:0,dwarf=character.raceId==='anao'&&base==='saber'&&character.skillSpecializations[id]?.toLocaleLowerCase()===character.raceOptions.oficio?.toLocaleLowerCase()?2:0,uhNura=character.raceId==='uh-nura'&&['persuadir','discernir'].includes(base)?-3:0,changelin=character.raceId==='changelin'&&['persuadir','discernir'].includes(base)?-4:0,karinzed=character.raceId==='karinzed'&&base==='sobrevivencia'?5:0,mount=base==='montar'?Math.floor(Math.max(0,character.skills.adestrar||0)/3):0,senses=attribute!=='nenhum'&&character.orderAbilities.includes('sentidos-aflorados')&&['agilidade','percepcao'].includes(attribute)?Math.max(1,character.orderAbilityLevels['sentidos-aflorados']||1):0,preciseThrow=base==='arremesso'&&character.orderAbilities.includes('arremesso-preciso')?Math.ceil(finalAttribute(character,'porte')/2):0,vision=base==='observar'&&character.qualities.includes('visao-agucada')?3*Math.max(1,character.traitLevels['visao-agucada']||1):0,peripheral=base==='observar'&&character.qualities.includes('visao-periferica')?2:0,hearing=base==='ouvir'&&character.qualities.includes('audicao-agucada')?3*Math.max(1,character.traitLevels['audicao-agucada']||1):0;return base==='idioma'||base==='esfera'?(character.skills[id]||0)+talent:finalAttribute(character,attribute as AttributeKey)-5+(character.skills[id]||0)+talent+dwarf+uhNura+changelin+karinzed+mount+senses+preciseThrow+vision+peripheral+hearing }
export const weightAffectedSkills=new Set(['acrobacia','armas','arremesso','artes-marciais','black-jack','briga','furtividade','montar','natacao','prestigiditacao','sacar-rapido'])
export function skillTestNh(character:Character,id:string,attribute:AttributeKey|'nenhum'){const base=skillNh(character,id,attribute),load=encumbrance(character);return weightAffectedSkills.has(id.split(':')[0])&&load.penaltyValue!==null?base+load.penaltyValue:base}
export function bestSkillNh(character:Character,base:string) {
  const definition=skills.find(([id])=>id===base)
  if(!definition)return 0
  const ids=character.selectedSkills.filter(id=>id===base||id.startsWith(`${base}:`))
  return ids.length?Math.max(...ids.map(id=>skillNh(character,id,definition[2]))):skillNh(character,base,definition[2])
}
export function bestSpecializedGraduation(character:Character,base:string,specialization:string){return Math.max(0,...character.selectedSkills.filter(id=>id.startsWith(`${base}:`)&&character.skillSpecializations[id]?.trim().toLocaleLowerCase()===specialization.toLocaleLowerCase()).map(id=>character.skills[id]||0))}
export function bestSpecializedNh(character:Character,base:string,specialization:string){const definition=skills.find(([id])=>id===base);if(!definition)return 0;return Math.max(0,...character.selectedSkills.filter(id=>id.startsWith(`${base}:`)&&character.skillSpecializations[id]?.trim().toLocaleLowerCase()===specialization.toLocaleLowerCase()).map(id=>skillNh(character,id,definition[2])))}
export function skillIncreaseRequirement(character:Character,instance:string){const base=instance.split(':')[0],next=(character.skills[instance]||0)+1;if(next>(base==='idioma'?3:maxSkillGraduation(character)))return 'Limite de graduação atingido';if(base==='rituais'){const occult=bestSpecializedGraduation(character,'saber','Ocultismo');if(occult<2)return 'Exige ao menos 2 graduações em Saber: Ocultismo';if(skillNh(character,instance,'inteligencia')>=bestSkillNh(character,'saber'))return 'O NH de Rituais não pode superar Saber: Ocultismo'}if(base==='avaliar'){const know=Math.max(0,...character.selectedSkills.filter(id=>id.startsWith('saber:')).map(id=>character.skills[id]||0));if(know<2)return 'Exige ao menos 2 graduações em um Saber/Ofício relacionado';if(next>know+5)return 'Não pode superar a perícia requerida em mais de 5 graduações'}if(base==='idioma'){const already=character.selectedSkills.filter(id=>id.startsWith('idioma:')&&id!==instance&&(character.skills[id]||0)>0).length;if((character.skills[instance]||0)===0&&already>=Math.max(0,difference(finalAttribute(character,'inteligencia'))+1))return 'Limite de idiomas adicionais atingido'}return null}
export function qualityRequirement(character:Character,id:string){if(id==='percepcao-cegas'){const sentir=character.skills.sentir||0,ouvir=character.skills.ouvir||0;if(sentir<5||ouvir<5)return `Exige 5 graduações em Sentir e Ouvir (atuais: ${sentir} e ${ouvir})`}return null}
export function orderRequirement(character:Character,id:string) {
  const owner=orders.find(o=>o.abilities.some(x=>x.id===id))
  const selectedOrders=character.orderIds.length?character.orderIds:(character.orderId?[character.orderId]:[])
  if(owner&&!selectedOrders.includes(owner.id))return `Exige pertencer à Ordem ${owner.name}`
  const ability=owner?.abilities.find(x=>x.id===id)
  if(ability?.status==='incomplete')return 'Regra incompleta no manual — compra desativada'
  const has=(...ids:string[])=>ids.some(x=>character.orderAbilities.includes(x))
  const attr=(key:AttributeKey,n:number,label:string)=>finalAttribute(character,key)>=n?null:`${label} ${n}+ (atual: ${finalAttribute(character,key)})`
  const skill=(id:string,n:number,label:string)=>bestSkillNh(character,id)>=n?null:`${label} NH ${n}+ (atual: ${bestSkillNh(character,id)})`
  const all=(...reasons:(string|null)[])=>reasons.find((reason):reason is string=>reason!==null)||null
  const weaponMeets=(thresholds:[number,number,number])=>character.selectedSkills.some(instance=>instance.startsWith('armas:')&&skillNh(character,instance,'agilidade')>=thresholds[Math.max(0,Math.min(2,(character.skillCosts[instance]||2)-1))])
  const weaponGraduation=(n:number)=>character.selectedSkills.some(instance=>instance.startsWith('armas:')&&(character.skills[instance]||0)>=n)
  if(id==='defensivo'&&!weaponMeets([12,15,18]))return 'Exige arma Simples NH 12, Média NH 15 ou Complexa NH 18'
  if(id==='ofensivo'&&!has('defensivo'))return 'Compre Defensivo primeiro'
  if(id==='especialista'&&!weaponGraduation(10))return 'Exige 10 graduações em uma arma'
  if(id==='experiente'&&!weaponMeets([15,18,21]))return 'Exige arma Simples NH 15, Média NH 18 ou Complexa NH 21'
  if(id==='tiro-duplo'&&!has('experiente-atirador'))return 'Compre Experiente primeiro'
  if(id==='experiente-atirador'&&!weaponMeets([15,18,21]))return 'Exige arma Simples NH 15, Média NH 18 ou Complexa NH 21'
  if(id==='recarga')return skill('armas',10,'Armas')
  if(['evasao','evasao-lutador','evasao-ladino','evasao-cacador','evasao-agente'].includes(id))return attr('agilidade',12,'Agilidade')
  if(id==='familiar')return attr('inteligencia',13,'Inteligência')
  if(id==='justiceiro'&&!has('perseguido'))return 'Compre Perseguido primeiro'
  if(id==='resistencia-a-dor'){const mental=derived(character).mental;return mental>=13?null:`Resistência Mental 13+ (atual: ${mental})`}
  if(id==='defensivo-lutador')return bestSkillNh(character,'briga')>=12||bestSkillNh(character,'artes-marciais')>=12?null:'Briga ou Artes Marciais NH 12+'
  if(id==='estilo-exotico')return bestSkillNh(character,'briga')>=15||bestSkillNh(character,'artes-marciais')>=15?null:'Briga ou Artes Marciais NH 15+'
  if(id==='ofensivo-lutador'&&!has('defensivo-lutador'))return 'Compre Defensivo primeiro'
  if(id==='golpe-efeito'&&!has('estilo-exotico'))return 'Compre Estilo Exótico primeiro'
  if(id==='resistente-barbaro')return all(attr('forca',12,'Força'),attr('vigor',12,'Vigor'))
  if(id==='sussurros-ladino'||id==='sussurros-cacador')return skill('ouvir',12,'Ouvir')
  if(['inspirar'].includes(id))return skill('atuar',10,'Atuar')
  if(['incentivar'].includes(id))return skill('atuar',12,'Atuar')
  if(id==='fortalecer')return all(skill('atuar',12,'Atuar'),attr('porte',12,'Porte'))
  if(id==='acalmar-aterrorizar')return attr('porte',13,'Porte')
  if(id==='invocacao-arcana-bardo'&&!has('acalmar-aterrorizar'))return 'Compre Acalmar / Aterrorizar primeiro'
  if(id==='ofensivo-agente'&&!has('defensivo-agente'))return 'Compre Defensivo primeiro'
  if(id==='experiente-agente'&&!weaponMeets([15,18,21]))return 'Exige arma Simples NH 15, Média NH 18 ou Complexa NH 21'
  if(id==='defensivo-agente'&&!weaponMeets([12,15,18]))return 'Exige arma Simples NH 12, Média NH 15 ou Complexa NH 18'
  if(id==='rituais-shaman')return skill('rituais',10,'Rituais')
  if(id==='estudo-arcano')return bestSpecializedNh(character,'saber','Ocultismo')>=15?null:`Saber: Ocultismo NH 15+ (atual: ${bestSpecializedNh(character,'saber','Ocultismo')})`
  if(id==='troca-equivalente')return has('estudo-arcano')?(bestSpecializedNh(character,'saber','Ocultismo')>=18?null:`Saber: Ocultismo NH 18+ (atual: ${bestSpecializedNh(character,'saber','Ocultismo')})`):'Compre Estudo Arcano primeiro'
  if(id==='itako'&&!has('sincronizar-espirito'))return 'Compre Sincronizar Espírito primeiro'
  if(id==='espirito-guia'||id==='sangue-frio')return attr('porte',12,'Porte')
  if(id==='equipe'&&!character.orderAbilities.some(x=>['sangue-frio','prodigio','foco-missao','coordenacao'].includes(x)))return 'Compre outra habilidade de Militar primeiro'
  if(id==='prodigio')return all(attr('agilidade',11,'Agilidade'),attr('porte',11,'Porte'))
  if(id==='coordenacao')return skill('poliorcetica',15,'Poliorcética')
  if(id==='tecnologia-alien')return attr('inteligencia',13,'Inteligência')
  if(id==='adaptado')return attr('vigor',12,'Vigor')
  if(id==='andarilho-horizonte')return all(attr('porte',15,'Porte'),attr('inteligencia',15,'Inteligência'),!has('adaptado')?'Compre Adaptado primeiro':null)
  if(id==='frota'&&!has('tecnologia-alien'))return 'Compre Tecnologia Alien primeiro'
  if(id==='comunhao-sombras')return all(attr('porte',15,'Porte'),skill('furtividade',20,'Furtividade'))
  if(id==='sentidos-aflorados')return attr('percepcao',12,'Percepção')
  if(id==='arremesso-preciso')return all(attr('percepcao',13,'Percepção'),attr('agilidade',13,'Agilidade'))
  if(id==='mascara-shinobi')return has('sentidos-aflorados')&&has('arremesso-preciso')?null:'Exige Sentidos Aflorados e Arremesso Preciso'
  if(id==='elementos-shinobi')return all(attr('porte',15,'Porte'),attr('inteligencia',12,'Inteligência'))
  return null
}
export function canUseMagic(character:Character) { return (character.orderIds.length?character.orderIds:[character.orderId]).includes('mago-invocador') || character.qualities.includes('fe-verdadeira') || (character.raceId==='espirito'&&finalAttribute(character,'inteligencia')>12&&finalAttribute(character,'porte')>12) }
/** Parâmetros gerais do Grimorium, pp. 85–87. Aplicam-se somente quando o
 * campo individual da magia disser “Padrão”; o texto específico sempre vence. */
export function defaultMagicParameters(level:1|2|3){return {faithCost:level,actions:level,rangeMetersPerPorte:1}}
/** Antes da conjuração, cada custo adicional igual ao nível eleva em +2 a
 * dificuldade de resistência do alvo. */
export function magicResistanceIncrease(level:1|2|3,steps:number){const paid=Math.max(0,Math.floor(steps));return {faithCost:level*paid,difficultyBonus:2*paid}}
/** Magia sustentada exige RM 10 + nível + dano sofrido para não se desfazer. */
export function sustainMagicDifficulty(level:1|2|3,damage:number){return 10+level+Math.max(0,damage)}
/** Bônus do teste resistido de uma magia invocada: 2d6 + Diferença de Porte
 * + nível. O dado não é rolado pelo criador. */
export function invocationResistanceBonus(character:Character,level:1|2|3){return difference(finalAttribute(character,'porte'))+level}
/** Alterações publicadas para Materializar Energia (pp. 112–113). Os efeitos
 * de cena continuam com o Narrador; estes dados cobrem apenas custo e limites
 * que o manual imprime de modo objetivo. */
export const materializeEnergyAlterations={
  teleguiado:{cost:'×1,5 F/D (arredonda para cima)',costMultiplier:1.5,roundUp:true},
  lento:{cost:'½ F/D',costMultiplier:.5},
  explosivo:{cost:'×2 F/D',costMultiplier:2},
  cortante:{cost:'×2 F/D',costMultiplier:2},
  perfurador:{cost:'×2 F/D',costMultiplier:2},
  multiplos:{cost:'+3 F/D a cada 2 lançamentos',costPerTwoLaunches:3},
  simples:{cost:'−1 F/D',costAdjustment:-1},
  rajada:{cost:'×3 F/D; ×2 por rodada além da primeira',costMultiplier:3,extraRoundMultiplier:2},
} as const
export type MaterializeAlterationId=keyof typeof materializeEnergyAlterations
/** Custo de uma única alteração. Para Múltiplos, informe o número de
 * lançamentos; para Rajada, informe as rodadas sustentadas. */
export function materializeAlterationCost(baseFaith:number,id:MaterializeAlterationId,amount=1){
  const base=Math.max(0,baseFaith),count=Math.max(1,Math.floor(amount)),rule=materializeEnergyAlterations[id]
  if('costMultiplier' in rule){let value=base*rule.costMultiplier;if(id==='rajada')value*=Math.pow(2,count-1);return id==='teleguiado'?Math.ceil(value):value}
  if('costPerTwoLaunches' in rule)return Math.ceil(count/2)*rule.costPerTwoLaunches
  return Math.max(0,base+rule.costAdjustment)
}
/** Acrescentar outra magia à Materialização exige RM 18 + nível; em falha,
 * perde 2 F/D. O custo da magia adicional é cobrado individualmente. */
export function embeddedMagicRequirement(level:1|2|3){return {mentalResistanceDifficulty:18+level,faithLossOnFailure:2}}
/** Duas Materializações podem ser interceptadas com DIF 20. A que superar a
 * outra por pelo menos 5 de dano continua, com a diferença como dano restante. */
export function materializationCollision(firstDamage:number,secondDamage:number){const delta=Math.abs(firstDamage-secondDamage);return {difficulty:20,continues:delta>=5,remainingDamage:delta>=5?delta:0}}
/** Regras objetivas de Gravitocinese (p. 129). A direção, área desenhada e
 * consequências de cena ainda são escolhas do jogador/Narrador. */
export function gravitokinesisParameters(porte:number,faithSpent=0,bonusDifficulty=0){
  const p=Math.max(0,porte),faith=Math.max(0,faithSpent)
  return {minimumFaithToUse:3,maximumAreaSquareMeters:p,baseResistanceDifficulty:p+3,extraResistanceDifficulty:Math.max(0,bonusDifficulty),extraFaithCost:Math.max(0,bonusDifficulty),controlWeightKg:5*p*(1+.5*Math.floor(faith/2))}
}
/** Eletrocinese: a resistência física para não paralisar é DIF 13 + dano. */
export function electrokinesisResistanceDifficulty(damage:number){return 13+Math.max(0,damage)}
/** Criar Vórtex usa Porte como teto de diâmetro; cada m² adicional custa 3 F/D.
 * A manutenção é RM 10 + diâmetro e o alvo resiste em 15 + diâmetro − distância/5. */
export function vortexParameters(porte:number,diameter:number,distanceMeters=0){const p=Math.max(0,porte),d=Math.max(0,diameter);return {maximumDiameter:p,diameter:d,extraFaithCost:Math.max(0,d-p)*3,maintenanceMentalDifficulty:10+d,targetResistanceDifficulty:15+d-Math.floor(Math.max(0,distanceMeters)/5)}}
export function unlockedSupernatural(character:Character) {
  if(character.raceId==='hunter') return ['Convicção','Limites de Hunter']
  if(character.raceId==='nephalim') return ['Milagre','Inimigo do Mal','Dons Celestiais','Aprendizados de Luz',...(character.age>=21?['Detectar Maldade (21+)']:[])]
  if(character.raceId==='tarian') return ['Sentir Presença','Aprendizados']
  if(character.raceId==='uh-nura') return ['Modo Invisível','Conexão Mental','Toque Espectral']
  if(character.raceId==='espirito') return ['Aparição',...(finalAttribute(character,'inteligencia')>12&&finalAttribute(character,'porte')>12?['Comunhão com Spiritum']:['Comunhão com Spiritum (exige Porte e Inteligência 13+)'])]
  if(character.raceId==='karinzed') return ['Som dos Ventos','Mimetismo Sobrenatural']
  if(character.raceId==='changelin') return ['Essência Mágica','Glamour','Caminho para Paradísia']
  if(character.raceId==='kahje') return ['Dever Existencial']
  if(character.orderAbilities.includes('rituais-shaman'))return ['Rituais']
  if(character.orderAbilities.includes('invocacao-arcana-bardo'))return ['Invocação Arcana']
  if(character.orderAbilities.includes('elementos-shinobi'))return ['Jutsus']
  if(canUseMagic(character)) return ['Grimorium','Esferas de Magia']
  return []
}
export function validation(character:Character) {
  const messages:string[]=[]
  const duplicates=(values:string[])=>[...new Set(values.filter((value,index)=>values.indexOf(value)!==index))]
  const normalizedPeculiarities=character.peculiarities.map(value=>value.trim().toLocaleLowerCase())
  if(normalizedPeculiarities.some(value=>!value))messages.push('Uma peculiaridade não pode ficar vazia.')
  if(new Set(normalizedPeculiarities).size!==normalizedPeculiarities.length)messages.push('A mesma peculiaridade não pode conceder XP mais de uma vez.')
  if(!Number.isInteger(character.age)||character.age<0)messages.push('A idade precisa ser um número inteiro não negativo.')
  if(!Number.isFinite(character.carriedWeight)||character.carriedWeight<0)messages.push('O peso carregado não pode ser negativo.')
  if(!['hediondo','muito-feio','feio','normal','atraente','bonito','muito-bonito'].includes(character.antecedents.appearance))messages.push('A aparência do antecedente não existe no manual.')
  if(![-2,-1,0,1,2,3,4].includes(character.antecedents.resources)||![-2,0,2].includes(character.antecedents.literacy)||!Number.isInteger(character.antecedents.renown)||character.antecedents.renown<0)messages.push('Os valores de antecedentes salvos são inválidos.')
  if(!races.some(race=>race.id===character.raceId))messages.push('A raça salva não existe no catálogo publicado.')
  if(!Object.values(character.attributes).every(value=>Number.isFinite(value)))messages.push('Todos os atributos precisam ser números finitos.')
  const selectedOrders=character.orderIds.length?character.orderIds:(character.orderId?[character.orderId]:[])
  if(selectedOrders.some(id=>!orders.some(order=>order.id===id)))messages.push('A ficha contém uma Ordem inexistente.')
  if(duplicates(selectedOrders).length)messages.push('A mesma Ordem não pode ser comprada mais de uma vez.')
  if(duplicates(character.selectedSkills).length)messages.push('A mesma instância de perícia não pode ser selecionada mais de uma vez.')
  if(character.selectedSkills.some(instance=>!skills.some(([id])=>id===instance.split(':')[0])))messages.push('A ficha contém uma perícia inexistente.')
  if(character.selectedSkills.some(instance=>{const graduation=character.skills[instance]??0;return !Number.isInteger(graduation)||graduation<0}))messages.push('A ficha contém uma graduação de perícia inválida.')
  if(duplicates(character.qualities).length||duplicates(character.defects).length)messages.push('Qualidades e Defeitos não podem ser duplicados.')
  if(character.qualities.some(id=>!qualities.some(item=>item.id===id))||character.defects.some(id=>!defects.some(item=>item.id===id)))messages.push('A ficha contém uma Qualidade ou Defeito inexistente.')
  if([...character.qualities,...character.defects].some(id=>{const level=character.traitLevels[id]??1;return !Number.isInteger(level)||level<1}))messages.push('A ficha contém um nível de Qualidade ou Defeito inválido.')
  if(duplicates(character.orderAbilities).length)messages.push('A mesma habilidade de Ordem não pode ser selecionada mais de uma vez.')
  if(character.orderAbilities.some(id=>!orders.some(order=>order.abilities.some(ability=>ability.id===id))))messages.push('A ficha contém uma habilidade de Ordem inexistente.')
  if(character.orderAbilities.some(id=>{const level=character.orderAbilityLevels[id]??1;return !Number.isInteger(level)||level<1}))messages.push('A ficha contém um nível de habilidade de Ordem inválido.')
  const equipmentCatalog=[...equipment,...campaignUtilities,...magicalEquipment]
  if(duplicates(character.equipment).length)messages.push('O mesmo equipamento não pode ser selecionado mais de uma vez.')
  if(character.equipment.some(id=>!equipmentCatalog.some(item=>item.id===id)))messages.push('A ficha contém um equipamento inexistente.')
  if(character.equipment.some(id=>equipmentCatalog.find(item=>item.id===id)?.status==='incomplete'))messages.push('A ficha contém equipamento sem regra operacional completa no manual.')
  if(character.equipment.some(id=>equipmentCatalog.find(item=>item.id===id)?.category==='Artefato'))messages.push('Artefatos não podem ser selecionados na criação; somente o Narrador pode concedê-los.')
  const supernaturalCatalog=[...hunterPowers,...grimoire,...nephalimGifts]
  if(duplicates(character.supernaturalChoices).length)messages.push('O mesmo dom, poder ou magia não pode ser selecionado mais de uma vez.')
  if(character.supernaturalChoices.some(id=>!supernaturalCatalog.some(item=>item.id===id)))messages.push('A ficha contém um dom, poder ou magia inexistente.')
  if(!character.name.trim()) messages.push('O personagem ainda não tem nome.')
  if(!isPublishedStartingXp(character.startingXp)) messages.push('XP inicial deve estar entre 50 e 70, ou ser 75/80 com autorização do Narrador.')
  const humanCycle=['humano','hunter'].includes(character.raceId)||character.raceOptions.ageCycle==='human'
  if(humanCycle&&character.age>100) messages.push('A tabela de idade humana publicada termina aos 100 anos; defina os ajustes posteriores com o Narrador.')
  const validAttributes=new Set<AttributeKey>(['porte','forca','agilidade','vigor','inteligencia','percepcao'])
  if(character.raceId==='nephalim' && (new Set(character.racialChoices).size!==2||character.racialChoices.some(x=>!validAttributes.has(x)))) messages.push('Escolha dois atributos diferentes para os bônus de Nephalim.')
  if(character.raceId==='meio-elfo' && (character.racialChoices.length!==1||!validAttributes.has(character.racialChoices[0]))) messages.push('Escolha o atributo que recebe o bônus de Meio-Elfo.')
  const tarianValues=Object.values(character.racialAllocation)
  if(character.raceId==='tarian' && (tarianValues.length!==6||![1,2,3,4,5,6].every(x=>tarianValues.includes(x)))) messages.push('Distribua os seis bônus diferentes da raça Tarian.')
  if(character.raceId==='anao'&&!character.raceOptions.oficio)messages.push('Escolha o Ofício favorecido da raça Anão.')
  if(character.raceId==='anao'&&!character.raceOptions.inimigoPredileto)messages.push('Escolha o Inimigo Predileto da raça Anão.')
  if(character.raceId==='tarian'&&!character.selectedSkills.some(id=>id==='sentir'&&(character.skills[id]||0)>0))messages.push('Sentir Presença de Tarian exige possuir a perícia Sentir.')
  if((character.orderIds.includes('mago-real')||character.orderId==='mago-real')&&!character.qualities.includes('distorcer-realidade'))messages.push('Mago Real exige a qualidade Distorcer Realidade.')
  character.qualities.forEach(id=>{const reason=qualityRequirement(character,id);if(reason)messages.push(`${qualities.find(x=>x.id===id)?.name||id}: ${reason}.`)})
  const traitCaps:Record<string,number>={'resistencia-magia':2,sorte:2,mediunidade:4,'visao-noturna':2,aliado:6,'duro-matar':3,inimigo:2,juramento:2}
  const levelledTraits=new Set(['resistencia-magia','sorte','mediunidade','visao-noturna','aliado','inimigo','juramento','visao-agucada','faro-agucado','audicao-agucada','duro-matar','vitalidade-extra','fadiga-extra','poder-oculto','determinado','hipoalgia','ma-reputacao'])
  ;[...character.qualities,...character.defects].forEach(id=>{const level=character.traitLevels[id]||1;if(level<1||traitCaps[id]&&level>traitCaps[id])messages.push(`${qualities.find(x=>x.id===id)?.name||defects.find(x=>x.id===id)?.name||id}: nível ${level} não existe no manual.`);if(!levelledTraits.has(id)&&level!==1)messages.push(`${qualities.find(x=>x.id===id)?.name||defects.find(x=>x.id===id)?.name||id} não possui níveis no manual.`)})
  ;['habilidade-inata','inimigo','intolerancia','principio','juramento','dever','protegido','insanidade-leve','insanidade-media','insanidade-grave','doenca-media','doenca-grave'].forEach(id=>{if((character.qualities.includes(id)||character.defects.includes(id))&&!character.traitDetails[id]?.trim())messages.push(`Especifique a escolha de ${qualities.find(x=>x.id===id)?.name||defects.find(x=>x.id===id)?.name}.`)})
  if(character.qualities.includes('habilidade-inata')&&character.traitDetails['habilidade-inata']&&!character.selectedSkills.includes(character.traitDetails['habilidade-inata']))messages.push('Habilidade: Perícia deve apontar para uma perícia treinada da ficha.')
  if(character.qualities.includes('ysea')&&!(['porte','forca','agilidade','vigor','inteligencia','percepcao'] as string[]).includes(character.traitDetails.ysea))messages.push('Escolha o atributo +1 do simulacro de Ysea.')
  ;['especialidade','ligacao-esfera','tecnologia-alien','adaptado','metodo'].forEach(id=>{if(character.orderAbilities.includes(id)&&!character.orderAbilityDetails[id]?.trim())messages.push(`Especifique a escolha da habilidade ${orders.flatMap(o=>o.abilities).find(x=>x.id===id)?.name}.`)})
  const repeatCaps:Record<string,number>={metodo:2,familiar:3,'ligacao-esfera':5,equipe:4,frota:4,'tecnologia-alien':6,adaptado:6,'comunhao-sombras':2,'sentidos-aflorados':5}
  const optionSets:Record<string,string[]>={metodo:['Lírico','Rúnico'],'ligacao-esfera':['Água','Ar','Entropia','Espaço/Tempo','Espírito','Fogo','Luz','Matéria','Terra','Vida','Escuridão'],'tecnologia-alien':['Acelerador de Movimento','Multiplicador de Saúde','Controle da Massa','Alterar Matéria','Controle Tecnológico','Alterador Estrutural'],adaptado:['Fogo/Calor','Frio/Gelo','Ácido','Efeitos Mentais','Eletricidade','Radiação']}
  character.orderAbilities.forEach(id=>{const level=character.orderAbilityLevels[id]||1,ability=orders.flatMap(o=>o.abilities).find(x=>x.id===id),cap=repeatCaps[id];if(!ability?.repeatable&&level!==1)messages.push(`${ability?.name||id} não pode ser comprada mais de uma vez.`);if(cap&&level>cap)messages.push(`${ability?.name||id} excede o máximo de ${cap} compras.`);const allowed=optionSets[id];if(allowed){const chosen=(character.orderAbilityDetails[id]||'').split('|').filter(Boolean),needed=['metodo','tecnologia-alien','adaptado'].includes(id)?level:1;if(chosen.length!==needed||new Set(chosen).size!==chosen.length||chosen.some(x=>!allowed.includes(x)))messages.push(`Escolha ${needed} ${needed===1?'opção válida':'opções válidas'}${needed===1?'':' e diferentes'} para ${ability?.name||id}.`)}})
  character.orderAbilities.forEach(id=>{const reason=orderRequirement(character,id);if(reason)messages.push(`${orders.flatMap(o=>o.abilities).find(x=>x.id===id)?.name||id}: ${reason}.`)})
  if(character.raceId==='hunter')character.supernaturalChoices.forEach(id=>{const variants=hunterPowerVariants[id];if(variants&&!variants.some(v=>v.id===character.supernaturalDetails[id]))messages.push(`Escolha um nível ou variante válida para ${hunterPowers.find(x=>x.id===id)?.name}.`);if(hunterPowerDetailPrompts[id]&&!character.supernaturalDetails[id]?.trim())messages.push(`Defina ${hunterPowerDetailPrompts[id].toLocaleLowerCase()}`)})
  if(['nephalim','tarian','karinzed'].includes(character.raceId)){const capacity=character.raceId==='karinzed'?Math.max(1,difference(finalAttribute(character,'porte'))):finalAttribute(character,'porte')+Math.ceil(finalAttribute(character,'inteligencia')/2),used=learningPointsUsed(character);if(used>capacity)messages.push(`Aprendizados raciais usam ${used} pontos, acima da capacidade ${capacity}.`)}
  const divine=character.qualities.includes('fe-verdadeira')
  const broadMagic=['tarian','karinzed'].includes(character.raceId)||canUseMagic(character)||character.orderAbilities.some(id=>['invocacao-arcana-bardo','elementos-shinobi'].includes(id))
  character.supernaturalChoices.forEach(id=>{const power=hunterPowers.find(x=>x.id===id),spell=grimoire.find(x=>x.id===id),sphereMagic=(character.orderIds.includes('mago-invocador')||character.orderId==='mago-invocador')&&!!spell;const allowed=character.raceId==='hunter'?!!power:character.raceId==='nephalim'?(nephalimGifts.some(x=>x.id===id)||sphereMagic):divine?!!spell?.methods?.includes('Oração'):broadMagic?!!spell:false;if(!allowed)messages.push(`${power?.name||spell?.name||id} não está disponível para as fontes sobrenaturais deste personagem.`);if((power||spell)?.status==='incomplete')messages.push(`${power?.name||spell?.name}: regra incompleta no manual.`)})
  character.selectedSkills.forEach(instance=>{const base=instance.split(':')[0],graduation=character.skills[instance]||0,specialization=character.skillSpecializations[instance]?.trim(),rule=skillSpecializationRules[base];if(rule&&base!=='avaliar'&&!instance.includes(':'))messages.push(`${skills.find(([id])=>id===base)?.[1]||base} exige especialização definida.`);if(instance.includes(':')&&!specialization)messages.push('Há uma perícia especializada sem área, arma ou aplicação definida.');if(rule?.mode==='options'&&specialization&&!rule.options?.some(option=>option.name===specialization))messages.push(`${skills.find(([id])=>id===base)?.[1]||base}: especialização não publicada.`);if(base==='avaliar'&&graduation>0){const know=Math.max(0,...character.selectedSkills.filter(id=>id.startsWith('saber:')).map(id=>character.skills[id]||0));if(!specialization)messages.push('Avaliar exige definir o Saber ou Ofício relacionado.');if(know<2)messages.push('Avaliar exige ao menos 2 graduações em um Saber/Ofício relacionado.');if(graduation>know+5)messages.push('Avaliar não pode superar a perícia requerida em mais de 5 graduações.')}if(base==='rituais'&&graduation>0){const occult=bestSpecializedGraduation(character,'saber','Ocultismo');if(occult<2)return messages.push('Rituais exige ao menos 2 graduações em Saber: Ocultismo.');if(skillNh(character,instance,'inteligencia')>bestSpecializedNh(character,'saber','Ocultismo'))messages.push('O NH de Rituais não pode superar Saber: Ocultismo.')}})
  const maximum=maxSkillGraduation(character)
  character.selectedSkills.forEach(instance=>{const cap=instance.split(':')[0]==='idioma'?3:maximum;if((character.skills[instance]||0)>cap)messages.push(`${instance} excede o máximo de ${cap} graduações.`)})
  const languages=character.selectedSkills.filter(x=>x==='idioma'||x.startsWith('idioma:')).filter(x=>(character.skills[x]||0)>0).length
  const languageLimit=Math.max(0,difference(finalAttribute(character,'inteligencia'))+1)
  if(languages>languageLimit)messages.push(`Idiomas adicionais excedem o limite de ${languageLimit}.`)
  const usesSpheres=character.orderIds.includes('mago-invocador')||character.orderId==='mago-invocador'||character.raceId==='espirito'
  if(usesSpheres){
    const ranks=character.selectedSkills.reduce<Record<string,number>>((all,id)=>{if(id.startsWith('esfera:'))all[character.skillSpecializations[id]||'']=character.skills[id]||0;return all},{})
    const used:Record<string,number>={}
    character.supernaturalChoices.filter(id=>grimoire.some(spell=>spell.id===id)&&!(character.raceId==='nephalim'&&nephalimGifts.some(gift=>gift.id===id)&&!character.magicSphereBySpell[id])).forEach(id=>{const spell=grimoire.find(x=>x.id===id)!;const sphere=character.magicSphereBySpell[id];if(!sphere)messages.push(`Escolha a Esfera usada por ${spell.name}.`);else {if(!spell.spheres.includes(sphere))messages.push(`${spell.name} não pertence à Esfera ${sphere}.`);used[sphere]=(used[sphere]||0)+spell.level}})
    Object.entries(used).forEach(([sphere,total])=>{if(total>(ranks[sphere]||0))messages.push(`Magias da Esfera ${sphere} usam ${total} pontos, acima das ${ranks[sphere]||0} graduações disponíveis.`)})
  }
  if(remainingXp(character)<0) messages.push(`A construção excede o orçamento em ${Math.abs(remainingXp(character))} XP.`)
  return messages
}
