import { describe, expect, it } from 'vitest'
import { grimoire, nephalimGifts } from '../data/grimoire'
import { orders } from '../data/orders'
import { hunterPowerVariants, hunterPowers } from '../data/powers'
import { equipment, equipmentWeightBounds, magicalEnhancements, magicalEquipment } from '../data/equipment'
import { defects, qualities, races, skillDescriptions, skillSpecializationRules, skills } from '../data/catalog'
import { rangedWeapons, skillProgressions } from '../data/skillProgressions'
import { ageAttributeModifier, aimingBonus, amputationProcedure, arcStrikeModifiers, attributeXp, burstShotModifiers, canUseMagic, combatDamage, combatManeuverModifiers, combatSquadroning, deathTestOutcome, deathTestOverkillModifier, defaultCharacter, defaultMagicParameters, deprivationThresholds, derived, electrokinesisResistanceDifficulty, embeddedMagicRequirement, encumbrance, fatigueRecoveryMinutes, finalAttribute, firearmTargetModifiers, freeSkillPoints, gravitokinesisParameters, headHitResistanceDifficulty, healthStages, heldBreath, hunterConviction, hunterPowerResistanceDifficulty, invocationResistanceBonus, isPublishedStartingXp, knockoutDifficulty, localizedAttackPenalties, magicResistanceIncrease, materializationCollision, materializeAlterationCost, medicalDifficulties, mitigateCriticalFailure, naturalRecovery, orderCost, orderRequirement, persuasionResistance, qualityRequirement, quickDrawDifficulty, racialContextEffects, racialPassiveEffects, remainingXp, resolveResistedTest, resolveTest, resolveTieBreak, simulacrumPhysicalAttributes, skillCost, skillNh, skillPointCost, skillPointsSpent, skillTestNh, sustainMagicDifficulty, supernaturalCost, synchronizedCombat, testDifficulties, trackingDifficulty, traitsCost, unlockedSupernatural, validation, vortexParameters, weightAffectedSkills } from './rules'
import type { Character } from '../types'

const make = (patch:Partial<Character>={}):Character => ({...defaultCharacter,attributes:{...defaultCharacter.attributes},...patch})

describe('racial rules',()=>{
  it('offers exactly the twelve player races published outside the NPC-antagonist chapter',()=>expect(races.map(race=>race.id).sort()).toEqual(['humano','hunter','nephalim','tarian','anao','elfo','meio-elfo','uh-nura','espirito','karinzed','changelin','kahje'].sort()))
  it('rejects malformed saved catalog references and duplicate purchases before calculating the sheet',()=>{
    const malformed=make({raceId:'nao-publicada' as Character['raceId'],orderIds:['combatente','combatente','ordem-falsa'],orderAbilities:['manobrista','manobrista','poder-falso'],selectedSkills:['acrobacia','acrobacia','pericia-falsa'],qualities:['audaz','audaz','qualidade-falsa'],defects:['ganancia','defeito-falso'],equipment:['faca','faca','item-falso'],supernaturalChoices:['pirocinese','pirocinese','magia-falsa']})
    const issues=validation(malformed).join(' ')
    expect(issues).toContain('raça salva');expect(issues).toContain('Ordem inexistente');expect(issues).toContain('mesma Ordem');expect(issues).toContain('perícia inexistente');expect(issues).toContain('Qualidade ou Defeito inexistente');expect(issues).toContain('habilidade de Ordem inexistente');expect(issues).toContain('equipamento inexistente');expect(issues).toContain('dom, poder ou magia inexistente')
  })
  it('allows original peculiarities but rejects blank or duplicate XP entries',()=>{
    expect(traitsCost(make({peculiarities:['ora antes de dormir','cruza os braços']}))).toBe(-2)
    expect(validation(make({peculiarities:['Ora antes de dormir',' ora antes de dormir ','']})).join(' ')).toContain('peculiaridade não pode ficar vazia')
    expect(validation(make({peculiarities:['Ora antes de dormir',' ora antes de dormir ']})).join(' ')).toContain('não pode conceder XP mais de uma vez')
  })
  it('rejects fractional or negative saved graduations and purchase levels',()=>{
    const c=make({selectedSkills:['acrobacia'],skills:{acrobacia:-1},qualities:['audaz'],traitLevels:{audaz:1.5},orderIds:['combatente'],orderAbilities:['manobrista'],orderAbilityLevels:{manobrista:0}})
    const issues=validation(c).join(' ')
    expect(issues).toContain('graduação de perícia inválida');expect(issues).toContain('nível de Qualidade ou Defeito inválido');expect(issues).toContain('nível de habilidade de Ordem inválido')
  })
  it('rejects malformed saved identity, load and antecedent values',()=>{
    const c=make({age:-1,carriedWeight:-2,antecedents:{appearance:'inventada',resources:9,literacy:1,renown:-1}})
    const issues=validation(c).join(' ')
    expect(issues).toContain('idade precisa');expect(issues).toContain('peso carregado');expect(issues).toContain('aparência do antecedente');expect(issues).toContain('antecedentes salvos')
  })
  it('rejects incomplete source equipment injected into a saved sheet',()=>{
    expect(validation(make({equipment:['rebeliao']})).join(' ')).toContain('equipamento sem regra operacional completa')
  })
  it('does not let saved data invent levels for one-time traits or Order abilities',()=>{
    const invalid=make({qualities:['audaz'],traitLevels:{audaz:2},orderIds:['combatente'],orderAbilities:['ofensivo'],orderAbilityLevels:{ofensivo:2}})
    const issues=validation(invalid).join(' ')
    expect(issues).toContain('Audaz não possui níveis');expect(issues).toContain('Ofensivo não pode ser comprada mais de uma vez')
  })
  it('applies the exact age bands from page 154',()=>{expect(ageAttributeModifier(49,'porte')).toBe(1);expect(ageAttributeModifier(49,'forca')).toBe(-1);expect(ageAttributeModifier(55,'porte')).toBe(0);expect(ageAttributeModifier(65,'agilidade')).toBe(-1);expect(ageAttributeModifier(75,'inteligencia')).toBe(-1);expect(ageAttributeModifier(8,'percepcao')).toBe(-2)})
  it('does not extrapolate the human age table beyond its published 100-year endpoint',()=>{expect(ageAttributeModifier(101,'forca')).toBe(0);expect(validation(make({age:101})).join(' ')).toContain('100')})
  it('uses every published Teste de Morte state and only leaves results above 12 to the Narrador',()=>{expect(deathTestOutcome(2).state).toBe('Acordado');expect(deathTestOutcome(3).state).toBe('Inconsciente');expect(deathTestOutcome(5).state).toBe('Sangrando');expect(deathTestOutcome(7).state).toBe('Estado Grave');expect(deathTestOutcome(10).state).toBe('Moribundo');expect(deathTestOutcome(12).state).toBe('Morto');expect(deathTestOutcome(13).state).toBe('Não publicado');expect(deathTestOverkillModifier(3,7)).toBe(1)})
  it('only applies human aging automatically to confirmed human cycles',()=>{expect(finalAttribute(make({raceId:'humano',age:50}),'porte')).toBe(11);expect(finalAttribute(make({raceId:'elfo',age:50}),'porte')).toBe(11);expect(finalAttribute(make({raceId:'elfo',age:50,raceOptions:{ageCycle:'human'}}),'porte')).toBe(12)})
  it('applies fixed dwarf attributes and fatigue',()=>{const c=make({raceId:'anao'});expect(finalAttribute(c,'forca')).toBe(11);expect(finalAttribute(c,'vigor')).toBe(12);expect(derived(c).fatigue).toBe(13)})
  it('models Hunter Convicção with its published activation cost, scene reduction and resistance split',()=>{expect(hunterConviction(0).active).toBe(false);expect(hunterConviction(5)).toMatchObject({active:true,faithSpent:1,supernaturalDamageReduction:2.5});const hunter=make({raceId:'hunter',attributes:{...defaultCharacter.attributes,porte:12}});expect(hunterPowerResistanceDifficulty(hunter,3,'desumano')).toBe(27);expect(hunterPowerResistanceDifficulty(hunter,3,'humano-ou-hunter')).toBe(12)})
  it('reveals the published Nephalim Detectar Maldade awakening only at 21 years',()=>{expect(unlockedSupernatural(make({raceId:'nephalim',age:20}))).not.toContain('Detectar Maldade (21+)');expect(unlockedSupernatural(make({raceId:'nephalim',age:21}))).toContain('Detectar Maldade (21+)')})
  it('does not unlock Comunhão com Spiritum before both published attributes exceed 12',()=>{expect(unlockedSupernatural(make({raceId:'espirito'})).join(' ')).toContain('exige Porte e Inteligência 13+');expect(unlockedSupernatural(make({raceId:'espirito',attributes:{...defaultCharacter.attributes,porte:13,inteligencia:13}}))).toContain('Comunhão com Spiritum')})
  it('keeps contextual racial effects out of permanent NH while applying their exact scene bonuses',()=>{expect(racialContextEffects(make({raceId:'anao'}),{targetIsDwarfFavoredEnemy:true})).toEqual({testBonus:2,damageBonus:1,damageReduction:0});expect(racialContextEffects(make({raceId:'elfo'}),{naturalSkill:true}).testBonus).toBe(2);expect(racialContextEffects(make({raceId:'nephalim',racialChoices:['porte','forca'],attributes:{...defaultCharacter.attributes,porte:13}}),{targetIsMalignant:true})).toEqual({testBonus:4,damageBonus:0,damageReduction:4})})
  it('adds each Resistente Bárbaro purchase to the published Sadio health stage',()=>expect(derived(make({orderAbilities:['resistente-barbaro'],orderAbilityLevels:{'resistente-barbaro':2}})).health[0]).toBe(7))
  it('derives Renome from the published antecedent rather than a basic attribute',()=>{expect(derived(make({antecedents:{appearance:'normal',resources:0,literacy:0,renown:3}})).renown).toBe(3)})
  it('exposes the five published cumulative health stages and penalties without saving combat damage into the character sheet',()=>expect(healthStages(make()).map(stage=>[stage.name,stage.threshold,stage.penalty])).toEqual([['Sadio',5,0],['Atordoado',10,-1],['Ferido',15,-2],['Incapacitado',20,-4],['Morrendo',25,-8]]))
  it('builds every health threshold from the same rounded-up half-Vigor stage',()=>{
    const character=make({attributes:{...defaultCharacter.attributes,vigor:11}})
    expect(derived(character).health).toEqual([6,12,18,24,30])
  })
  it('keeps Renome uncapped because the manual prices it per level without publishing a maximum',()=>{const c=make({antecedents:{appearance:'normal',resources:0,literacy:0,renown:12}});expect(derived(c).renown).toBe(12);expect(traitsCost(c)).toBe(24);expect(validation(c).join(' ')).not.toContain('Renome')})
  it('requires the two dwarf choices',()=>{const c=make({raceId:'anao'});expect(validation(c).join(' ')).toContain('Ofício');expect(validation(c).join(' ')).toContain('Inimigo Predileto')})
  it('uses Intelligence and Perception for a spirit body while retaining Vigor',()=>{const c=make({raceId:'espirito',attributes:{...defaultCharacter.attributes,porte:12,inteligencia:14,percepcao:13}});expect(finalAttribute(c,'forca')).toBe(14);expect(finalAttribute(c,'agilidade')).toBe(13);expect(finalAttribute(c,'vigor')).toBe(10);expect(derived(c).fatigue).toBe(0)})
  it('applies the published Cego reduction to effective Perception',()=>expect(finalAttribute(make({defects:['cego']}),'percepcao')).toBeCloseTo(20/3))
  it('does not reject a Spirit merely for lacking the optional Communion thresholds',()=>expect(validation(make({raceId:'espirito'})).join(' ')).not.toContain('Comunhão com Spiritum exige'))
  it('only gives a Spirit magical access after the published Communion thresholds',()=>{expect(canUseMagic(make({raceId:'espirito'}))).toBe(false);expect(canUseMagic(make({raceId:'espirito',attributes:{...defaultCharacter.attributes,porte:13,inteligencia:13}}))).toBe(true)})
  it('requires unique complete Tarian allocation',()=>{const bad=make({raceId:'tarian',racialAllocation:{porte:6,forca:6}});expect(validation(bad).join(' ')).toContain('seis bônus');const good=make({raceId:'tarian',racialAllocation:{porte:6,forca:5,agilidade:4,vigor:3,inteligencia:2,percepcao:1}});expect(validation(good).join(' ')).not.toContain('seis bônus')})
  it('keeps every published Tarian passive separate from campaign evolution',()=>expect(racialPassiveEffects(make({raceId:'tarian'}))).toEqual({naturalPhysicalDamageReduction:1,inhaledDamageMultiplier:2,heldBreathMultiplier:.5}))
  it('rejects six unique but noncanonical Tarian bonuses',()=>expect(validation(make({raceId:'tarian',racialAllocation:{porte:7,forca:8,agilidade:9,vigor:10,inteligencia:11,percepcao:12}})).join(' ')).toContain('seis bônus'))
  it('applies Changelin attributes and Inocência Cega exactly',()=>{const c=make({raceId:'changelin'});expect(finalAttribute(c,'porte')).toBe(13);expect(finalAttribute(c,'percepcao')).toBe(12);expect(finalAttribute(c,'forca')).toBe(9);expect(finalAttribute(c,'vigor')).toBe(9);expect(skillNh(c,'discernir','percepcao')).toBe(3);expect(skillNh(c,'persuadir','porte')).toBe(4)})
  it('adds the fully specified Kahje adjustments while limiting Ingenuidade to Persuadir',()=>{const c=make({raceId:'kahje'});expect(finalAttribute(c,'porte')).toBe(12);expect(finalAttribute(c,'forca')).toBe(7);expect(finalAttribute(c,'agilidade')).toBe(4);expect(finalAttribute(c,'vigor')).toBe(9);expect(finalAttribute(c,'inteligencia')).toBe(16);expect(finalAttribute(c,'percepcao')).toBe(12);expect(persuasionResistance(c)).toBe(4);expect(unlockedSupernatural(c)).toEqual(['Dever Existencial'])})
})

describe('core 2d6 tests',()=>{
  it('publishes every named difficulty tier from page 155',()=>expect(testDifficulties).toEqual({facil:9,media:12,desafiadora:15,dificil:18,monumental:21,epica:25}))
  it('makes double 6 succeed and double 1 fail regardless of numerical difficulty',()=>{expect(resolveTest([6,6],0,25)).toMatchObject({success:true,critical:'success'});expect(resolveTest([1,1],30,9)).toMatchObject({success:false,critical:'failure'})})
  it('uses total for ordinary tests and requests the published tie-break for double criticals',()=>{expect(resolveTest([4,5],3,12)).toMatchObject({total:12,success:true,critical:null});expect(resolveResistedTest(resolveTest([6,6]),resolveTest([6,6]))).toEqual({winner:'tie-break'})})
  it('resolves the published unmodified 1d6 tie-break and Courage mitigation',()=>{expect(resolveTieBreak(6,2)).toEqual({winner:'attacker'});expect(resolveTieBreak(4,4)).toEqual({winner:'tie-break'});expect(mitigateCriticalFailure(resolveTest([1,1]),10,true)).toMatchObject({faithSpent:10,result:{critical:null,success:false}});expect(mitigateCriticalFailure(resolveTest([1,1]),9,true).faithSpent).toBe(0)})
})

describe('combat rules with complete numerical text',()=>{
  it('keeps every published localized-attack penalty and calculates head consequences separately',()=>{
    expect(localizedAttackPenalties).toEqual({cabeca:-4,pescoco:-5,olhos:-6,bracos:-4,maos:-5,pernas:-4,pes:-5})
    expect(headHitResistanceDifficulty(3)).toEqual({overflow:0,difficulty:null})
    expect(headHitResistanceDifficulty(7)).toEqual({overflow:4,difficulty:28})
    expect(knockoutDifficulty(7)).toBe(12)
    expect(knockoutDifficulty(7,'eletrico-ou-contusao')).toBe(17)
  })
  it('derives burst dispersion and Esquadrinhar limits from the published combat pages',()=>{
    expect(burstShotModifiers(3,3)).toEqual([0,-3,-6])
    expect(combatSquadroning(12,3)).toMatchObject({difficulty:17,successBonus:2})
    expect(combatSquadroning(12,9)).toMatchObject({successBonus:6})
    expect(combatSquadroning(12,20)).toMatchObject({rounds:9,successBonus:6,failedAttemptMaxRounds:6,failedAttemptMaxBonus:4})
  })
  it('derives shared NH, failed-member penalty and reflex bonus for synchronized combat',()=>{
    expect(synchronizedCombat([15,13],[true,true])).toEqual({difficulty:12,memberTestPenalty:-1,sharedCombatNh:14,reflexBonus:2,failures:0})
    expect(synchronizedCombat([15,13,12],[true,false,true])).toEqual({difficulty:13,memberTestPenalty:-1,sharedCombatNh:7,reflexBonus:3,failures:1})
  })
  it('applies the published damage types, firearm target modifiers and maneuver arithmetic',()=>{
    expect(combatDamage(7,2,'normal')).toEqual({afterReduction:5,finalDamage:5})
    expect(combatDamage(7,2,'perfurante').finalDamage).toBe(10)
    expect(combatDamage(7,2,'cortante').finalDamage).toBe(8)
    expect(firearmTargetModifiers).toEqual({emPe:0,deitado:-2,agachado:-1,correndo:-2,'em-combate':-1,andando:0,parado:1})
    expect(combatManeuverModifiers.investida).toMatchObject({minimumRunMeters:4,attack:1,damageBonus:3,defense:-4})
    expect(aimingBonus(1)).toBe(2);expect(aimingBonus(3)).toBe(3);expect(aimingBonus(9)).toBe(4)
    expect(arcStrikeModifiers(3)).toEqual({defenseBonus:3,damageReduction:2})
  })
})

describe('privation and recovery rules before the imported d20 appendix',()=>{
  it('uses the exact food, water and breath thresholds',()=>{
    expect(deprivationThresholds(11,10)).toEqual({foodHours:6,waterHours:3,repeatTestEveryHours:3,repeatTestPenalty:-1,faintAtFatigue:10})
    expect(heldBreath(10,1,true,2)).toEqual({actions:7,seconds:21,extendedTestDifficulty:25,extendedTestIncreaseEverySeconds:3})
  })
  it('keeps natural recovery modifiers and medical difficulties explicit',()=>{
    expect(naturalRecovery(4,{firstAidBonus:1,hungry:true,fatigueGainedToday:2})).toEqual({intervalHours:24,difficulty:16,modifier:-3,healthRecoveredOnSuccess:1,healthLostAfterTwoConsecutiveFailures:1})
    expect(medicalDifficulties(4,true)).toEqual({firstAidCleaning:14,surgeryForeignBody:20,stopInternalHemorrhage:19})
    expect(medicalDifficulties(4,false).stopInternalHemorrhage).toBe(29)
    expect(fatigueRecoveryMinutes(0)).toBe(0)
    expect(fatigueRecoveryMinutes(4)).toBe(11)
  })
  it('keeps the published Medicine amputation, Rastrear and Sacar Rápido values calculable',()=>{
    expect(amputationProcedure('pequeno',true)).toEqual({difficulty:20,healthDamage:10})
    expect(amputationProcedure('grande',false)).toEqual({difficulty:40,healthDamage:20})
    expect(trackingDifficulty(2,25,21,2,2)).toBe(19)
    expect(quickDrawDifficulty('pequeno')).toBe(15);expect(quickDrawDifficulty('medio')).toBe(18)
  })
})

describe('planar simulacrum rules',()=>{
  it('copies the three published mental attributes into their physical simulacrum counterparts',()=>expect(simulacrumPhysicalAttributes({porte:12,percepcao:14,inteligencia:16})).toEqual({vigor:12,agilidade:14,forca:16}))
})

describe('skills and points',()=>{
  it('keeps attribute cost linear without imposing an unpublished global cap',()=>{expect(attributeXp(make({attributes:{porte:21,forca:4,agilidade:10,vigor:10,inteligencia:10,percepcao:10}}))).toBe(50)})
  it('keeps every one of the 35 skills published on pages 57–67, with a description',()=>{
    const canonical=['acrobacia','adestrar','armas','arremesso','artes-marciais','atuar','avaliar','black-jack','briga','conducao','conhecimento-terreno','discernir','disfarce','esfera','esporte','etiqueta-alien','furtividade','idioma','intimidar','montar','natacao','persuadir','pilotar','poliorcetica','prestigiditacao','primeiros-socorros','observar','saber','ouvir','rastrear','rituais','sacar-rapido','sobrevivencia','sentir','tortura']
    expect(skills.map(([id])=>id).sort()).toEqual([...canonical].sort())
    expect(canonical.every(id=>skillDescriptions[id]?.trim())).toBe(true)
    expect(['armas','saber','idioma','atuar','conducao','pilotar','montar','conhecimento-terreno','esfera'].every(id=>skillSpecializationRules[id])).toBe(true)
  })
  it('matches the complete published cost table, including the two skills without a base attribute',()=>{const published={acrobacia:3,adestrar:2,armas:2,arremesso:2,'artes-marciais':3,atuar:2,avaliar:3,'black-jack':2,briga:1,conducao:2,'conhecimento-terreno':2,discernir:2,disfarce:3,esfera:3,esporte:2,'etiqueta-alien':3,furtividade:1,idioma:1,intimidar:2,montar:2,natacao:2,persuadir:2,pilotar:3,poliorcetica:2,prestigiditacao:3,'primeiros-socorros':1,observar:1,saber:2,ouvir:1,rastrear:3,rituais:3,'sacar-rapido':1,sobrevivencia:2,sentir:1,tortura:2};expect(Object.fromEntries(skills.map(([id,,attribute,cost])=>[id,cost]))).toEqual(published);expect(skills.find(([id])=>id==='idioma')?.[2]).toBe('nenhum');expect(skills.find(([id])=>id==='esfera')?.[2]).toBe('nenhum')})
  it('prices each weapon specialization and consumes the free skill pool first',()=>{const c=make({selectedSkills:['armas:pistola','armas:sniper'],skills:{'armas:pistola':3,'armas:sniper':2},skillCosts:{'armas:pistola':1,'armas:sniper':3}});expect(skillPointsSpent(c)).toBe(9);expect(skillCost(c)).toBe(0)})
  it('never lets an old saved skill cost turn a Medium skill into a Fácil one',()=>{const c=make({skills:{esporte:1},skillCosts:{esporte:1}});expect(skillPointCost(c,'esporte')).toBe(2);expect(skillPointsSpent(c)).toBe(2)})
  it('keeps the skill reserve separate from the initial XP budget',()=>{const base={age:27,attributes:{...defaultCharacter.attributes,inteligencia:11},skills:{esporte:5,observar:5,ouvir:5}};const normal=make({...base,startingXp:70});const campaign=make({...base,startingXp:160});expect(freeSkillPoints(normal)).toBe(23);expect(skillPointsSpent(normal)).toBe(20);expect(skillCost(normal)).toBe(0);expect(skillCost(campaign)).toBe(0);expect(remainingXp(campaign)-remainingXp(normal)).toBe(90)})
  it('offers every tabled weapon specialization with its published simple, medium or complex cost',()=>{const options=skillSpecializationRules.armas.options!;expect(options).toHaveLength(28);expect(options.find(x=>x.name==='Espada Curta / Punhal')?.cost).toBe(1);expect(options.find(x=>x.name==='Espada Bastarda')?.cost).toBe(3);expect(options.find(x=>x.name==='Machadinha')?.cost).toBe(2);expect(options.find(x=>x.name==='Canhão Laser')?.cost).toBe(3)})
  it('maps every ranged progression label to an actual published weapon specialization',()=>{
    const options=skillSpecializationRules.armas.options!.map(x=>x.name)
    expect(skillProgressions.armasAlcance[0].benefit).toContain('dano')
    expect(rangedWeapons.every(name=>options.includes(name))).toBe(true)
    expect(['Pistola Laser','Arco Longo','Metralhadora / Rifle de Assalto','Espingarda','Rifle Sniper','Canhão Laser'].every(name=>rangedWeapons.includes(name))).toBe(true)
  })
  it('preserves the initial XP ledger',()=>{const c=make({startingXp:70,attributes:{...defaultCharacter.attributes,porte:11}});expect(remainingXp(c)).toBe(60)})
  it('offers every normal initial-XP value and only the two published stronger exceptions',()=>{for(let xp=50;xp<=70;xp++)expect(isPublishedStartingXp(xp)).toBe(true);expect(isPublishedStartingXp(75)).toBe(true);expect(isPublishedStartingXp(80)).toBe(true);expect(isPublishedStartingXp(74)).toBe(false);expect(isPublishedStartingXp(81)).toBe(false)})
  it('rejects a saved sheet that contains an unpublished initial-XP value',()=>expect(validation(make({startingXp:74})).join(' ')).toContain('XP inicial'))
  it('grants Intelligence plus complete years after 15 as free skill points',()=>{const c=make({age:34,attributes:{...defaultCharacter.attributes,inteligencia:11}});expect(freeSkillPoints(c)).toBe(30)})
  it('adds +1 Montar for each three Adestrar graduations',()=>{const c=make({skills:{montar:1,adestrar:7}});expect(skillNh(c,'montar','porte')).toBe(8)})
  it('applies Arremesso Preciso as half Porte, rounded up, to the throw test',()=>{const c=make({attributes:{...defaultCharacter.attributes,porte:11},orderAbilities:['arremesso-preciso'],skills:{arremesso:1}});expect(skillNh(c,'arremesso','agilidade')).toBe(12)})
  it('applies confirmed load penalties only to skills marked [P]',()=>{const c=make({carriedWeight:8,skills:{acrobacia:2,observar:2}});expect(weightAffectedSkills.has('acrobacia')).toBe(true);expect(skillTestNh(c,'acrobacia','agilidade')).toBe(skillNh(c,'acrobacia','agilidade')-1);expect(skillTestNh(c,'observar','percepcao')).toBe(skillNh(c,'observar','percepcao'))})
  it('catalogs the published noncombat graduation unlocks',()=>{expect(skillProgressions.persuadir.find(x=>x.at===5)?.benefit).toContain('Interrogar');expect(skillProgressions.sobrevivencia.find(x=>x.at===3)?.benefit).toContain('velocidade normal');expect(skillProgressions.idioma.map(x=>x.at)).toEqual([1,2,3])})
  it('requires Avaliar to name its related Saber/Ofício and validates saved graduation requirements',()=>{
    const invalid=make({selectedSkills:['avaliar'],skills:{avaliar:1}})
    expect(validation(invalid).join(' ')).toContain('Avaliar exige definir o Saber ou Ofício relacionado')
    expect(validation(invalid).join(' ')).toContain('2 graduações')
    const valid=make({selectedSkills:['avaliar','saber:arte'],skills:{avaliar:2,'saber:arte':2},skillSpecializations:{avaliar:'Antiguidades','saber:arte':'Antiguidades'}})
    expect(validation(valid).join(' ')).not.toContain('Avaliar exige')
  })
  it('keeps Habilidade: Perícia bound to an actual selected skill when validating saved characters',()=>{
    const invalid=make({qualities:['habilidade-inata'],traitDetails:{'habilidade-inata':'armas:pistola'}})
    expect(validation(invalid).join(' ')).toContain('perícia treinada')
    const valid=make({qualities:['habilidade-inata'],selectedSkills:['armas:pistola'],traitDetails:{'habilidade-inata':'armas:pistola'}})
    expect(validation(valid).join(' ')).not.toContain('perícia treinada')
  })
  it('requires published specializations for skills that are specialized in the manual',()=>{
    const bare=make({selectedSkills:['armas'],skills:{armas:1}})
    expect(validation(bare).join(' ')).toContain('Armas exige especialização')
    const invented=make({selectedSkills:['armas:canhao-de-plasma'],skills:{'armas:canhao-de-plasma':1},skillSpecializations:{'armas:canhao-de-plasma':'Canhão de Plasma'}})
    expect(validation(invented).join(' ')).toContain('especialização não publicada')
    const valid=make({selectedSkills:['armas:pistola'],skills:{'armas:pistola':1},skillSpecializations:{'armas:pistola':'Pistola'}})
    expect(validation(valid).join(' ')).not.toContain('especialização não publicada')
  })
  it('rejects persisted Rituais above or without its published Saber: Ocultismo dependency',()=>{
    const invalid=make({selectedSkills:['rituais'],skills:{rituais:1}})
    expect(validation(invalid).join(' ')).toContain('Rituais exige ao menos 2 graduações')
    const over=make({selectedSkills:['rituais','saber:ocultismo'],skills:{rituais:3,'saber:ocultismo':2},skillSpecializations:{'saber:ocultismo':'Ocultismo'}})
    expect(validation(over).join(' ')).toContain('NH de Rituais não pode superar')
  })
})

describe('qualities and defects',()=>{
  it('keeps the complete canonical lists of published qualities and defects',()=>{expect(qualities.map(x=>x.id).sort()).toEqual(['audaz','visao-agucada','faro-agucado','audicao-agucada','sono-leve','equilibrista','ambidestria','atento','determinado','distorcer-realidade','duro-matar','vitalidade-extra','fadiga-extra','evasivo','fe-verdadeira','aliado','resoluto','mediunidade','poder-oculto','prontidao','visao-periferica','hipoalgia','percepcao-cegas','ysea','senso-direcao','senso-numerico','senso-perigo','sagaz','resistencia-magia','sorte','visao-noturna','habilidade-inata'].sort());expect(defects.map(x=>x.id).sort()).toEqual(['ganancia','inimigo','intolerancia','ma-reputacao','principio','juramento','dever','insanidade-leve','insanidade-media','insanidade-grave','covardia','fragil','protegido','cego','maneta','perneta','paraplegico','doenca-media','doenca-grave'].sort())})
  it('preserves the published Mental 25 triggers for Ganância and Covardia in their sheet descriptions',()=>{expect(defects.find(x=>x.id==='ganancia')?.description).toContain('25');expect(defects.find(x=>x.id==='covardia')?.description).toContain('1d rodadas')})
  it('prices Habilidade: Perícia from the chosen skill difficulty and grants only that specialization +3',()=>{const c=make({qualities:['habilidade-inata'],selectedSkills:['armas:pistola','armas:sniper'],skills:{'armas:pistola':1,'armas:sniper':1},skillCosts:{'armas:pistola':1,'armas:sniper':3},traitDetails:{'habilidade-inata':'armas:sniper'}});expect(traitsCost(c)).toBe(6);expect(skillNh(c,'armas:sniper','agilidade')-skillNh(c,'armas:pistola','agilidade')).toBe(3)})
  it('prices the published 2/4-point Inimigo and Juramento variants',()=>{const c=make({defects:['inimigo','juramento'],traitLevels:{inimigo:2,juramento:2},traitDetails:{inimigo:'grupo rival',juramento:'nunca abandonar um aliado'}});expect(traitsCost(c)).toBe(-8)})
  it('requires the selected insanity to be specified',()=>{expect(validation(make({defects:['insanidade-media']})).join(' ')).toContain('Insanidade Média')})
  it('uses the visually confirmed 2 XP value for Protegido and requires whom it protects',()=>{expect(defects.find(x=>x.id==='protegido')?.cost).toBe(-2);expect(validation(make({defects:['protegido']})).join(' ')).toContain('Protegido')})
  it('locks Percepção às Cegas until both published skill requirements are met',()=>{expect(qualityRequirement(make(),'percepcao-cegas')).toContain('Sentir e Ouvir');expect(qualityRequirement(make({skills:{sentir:5,ouvir:5}}),'percepcao-cegas')).toBeNull()})
  it('applies always-on keen-sense bonuses to their exact skills',()=>{const c=make({qualities:['visao-agucada','visao-periferica','audicao-agucada'],traitLevels:{'visao-agucada':2,'audicao-agucada':1}});expect(skillNh(c,'observar','percepcao')).toBe(13);expect(skillNh(c,'ouvir','percepcao')).toBe(8)})
  it('keeps Evasivo out of permanent Reflexes and exposes it only against the chosen opponent',()=>{const d=derived(make({qualities:['evasivo']}));expect(d.reflexes).toBe(7);expect(d.evasiveReflexes).toBe(9)})
  it('prices the doubled group variants of Aliado',()=>{expect(traitsCost(make({qualities:['aliado'],traitLevels:{aliado:4}}))).toBe(4);expect(traitsCost(make({qualities:['aliado'],traitLevels:{aliado:6}}))).toBe(16)})
  it('requires Ysea to identify the simulacrum attribute',()=>{expect(validation(make({qualities:['ysea']})).join(' ')).toContain('atributo +1');expect(validation(make({qualities:['ysea'],traitDetails:{ysea:'porte'}})).join(' ')).not.toContain('atributo +1')})
  it('applies exact Reflex fractions for physical limitations without inventing rounding',()=>{expect(derived(make({defects:['perneta']})).reflexes).toBeCloseTo(14/3);expect(derived(make({defects:['paraplegico']})).reflexes).toBe(3.5)})
  it('enforces only published trait limits and leaves per-level traits uncapped',()=>{expect(validation(make({qualities:['aliado'],traitLevels:{aliado:7}})).join(' ')).toContain('não existe');expect(validation(make({qualities:['determinado'],traitLevels:{determinado:50}})).join(' ')).not.toContain('não existe')})
  it('caps Duro de Matar at the three published extra health levels',()=>{expect(validation(make({qualities:['duro-matar'],traitLevels:{'duro-matar':3}})).join(' ')).not.toContain('não existe');expect(validation(make({qualities:['duro-matar'],traitLevels:{'duro-matar':4}})).join(' ')).toContain('não existe')})
})

describe('supernatural catalog',()=>{
  it('calculates the published default magic parameters, resistance boost and sustain check',()=>{expect(defaultMagicParameters(3)).toEqual({faithCost:3,actions:3,rangeMetersPerPorte:1});expect(magicResistanceIncrease(2,3)).toEqual({faithCost:6,difficultyBonus:6});expect(sustainMagicDifficulty(2,7)).toBe(19);expect(invocationResistanceBonus(make({attributes:{...defaultCharacter.attributes,porte:13}}),2)).toBe(5)})
  it('allows a Nephalim Mago Invocador to learn a non-gift spell through a funded Sphere',()=>{const c=make({raceId:'nephalim',racialChoices:['porte','forca'],orderIds:['mago-invocador'],orderId:'mago-invocador',selectedSkills:['esfera:entropia'],skillSpecializations:{'esfera:entropia':'Entropia'},skills:{'esfera:entropia':2},supernaturalChoices:['paralisar'],magicSphereBySpell:{paralisar:'Entropia'}});const issues=validation(c).join(' ');expect(issues).not.toContain('não está disponível');expect(issues).not.toContain('acima das')})
  it('contains all 106 transcribed spell entries without duplicate ids',()=>{expect(grimoire).toHaveLength(106);expect(new Set(grimoire.map(x=>x.id)).size).toBe(grimoire.length)})
  it('never marks a spell confirmed while a mandatory operational field is blank',()=>{for(const spell of grimoire.filter(x=>x.status==='confirmed')){expect(spell.faithCost,spell.id).toBeTruthy();expect(spell.castingTime,spell.id).toBeTruthy();expect(spell.duration,spell.id).toBeTruthy();expect(spell.range,spell.id).toBeTruthy()}})
  it('blocks Materializar Energia because its header and description contradict the casting time',()=>{const spell=grimoire.find(x=>x.id==='materializar-energia')!;expect(spell.status).toBe('incomplete');expect(spell.castingTime).toContain('Instantânea');expect(spell.castingTime).toContain('ação simples')})
  it('keeps every incomplete Grimoire entry blocked through the saved-sheet validator',()=>{
    const tarian={raceId:'tarian' as const,racialAllocation:{porte:6,forca:5,agilidade:4,vigor:3,inteligencia:2,percepcao:1}}
    for(const spell of grimoire.filter(spell=>spell.status==='incomplete')){
      expect(validation(make({...tarian,supernaturalChoices:[spell.id]})).join(' '),spell.name).toContain('regra incompleta')
    }
  })
  it('keeps every confirmed Grimoire entry free of the incomplete-source block',()=>{
    const tarian={raceId:'tarian' as const,racialAllocation:{porte:6,forca:5,agilidade:4,vigor:3,inteligencia:2,percepcao:1}}
    for(const spell of grimoire.filter(spell=>spell.status==='confirmed')){
      expect(validation(make({...tarian,supernaturalChoices:[spell.id]})).join(' '),spell.name).not.toContain('regra incompleta')
    }
  })
  it('preserves the complete confirmed source fields for Abençoar Arma and Acalmar',()=>{const bless=grimoire.find(x=>x.id==='abencoar-arma')!,calm=grimoire.find(x=>x.id==='acalmar')!;expect(bless.faithCost).toBe('2');expect(bless.range).toBe('Toque');expect(bless.methods).toEqual(['Oração','Habilidade Natural','Runas de Força']);expect(calm.status).toBe('confirmed');expect(calm.faithCost).toBe('2 (toque) ou 4 (área)');expect(calm.duration).toBe('Permanente')})
  it('uses the printed Porte value, not Diferença de Porte, for Aura Sagrada/Profana',()=>{const aura=grimoire.find(x=>x.id==='aura-sagrada')!;expect(aura.description).toContain('igual ao Porte do conjurador');expect(aura.description).not.toContain('Diferença de PRT')})
  it('keeps Desintegrar resistance scaling on Fé/Determinação rather than an invented PF label',()=>{const spell=grimoire.find(x=>x.id==='desintegrar')!;expect(spell.description).toContain('Fé/Determinação extras');expect(spell.description).not.toContain('PF extras')})
  it('keeps the printed raw Porte regeneration and Materializar Energia F/D wording',()=>{const regeneration=grimoire.find(x=>x.id==='regenerar')!,energy=grimoire.find(x=>x.id==='materializar-energia')!;expect(regeneration.description).toContain('1d + Porte por rodada');expect(regeneration.description).not.toContain('Diferença de PRT');expect(energy.description).toContain('3 pontos de Fé/Determinação')})
  it('calculates published Materializar Energia alteration costs and collision threshold',()=>{expect(materializeAlterationCost(3,'teleguiado')).toBe(5);expect(materializeAlterationCost(3,'lento')).toBe(1.5);expect(materializeAlterationCost(3,'multiplos',3)).toBe(6);expect(materializeAlterationCost(3,'rajada',2)).toBe(18);expect(embeddedMagicRequirement(2)).toEqual({mentalResistanceDifficulty:20,faithLossOnFailure:2});expect(materializationCollision(12,7)).toEqual({difficulty:20,continues:true,remainingDamage:5})})
  it('unlocks learnings for Tarians',()=>expect(unlockedSupernatural(make({raceId:'tarian'}))).toContain('Aprendizados'))
  it('exposes Uh-Nura natural powers without treating incomplete grimoire entries as purchases',()=>expect(unlockedSupernatural(make({raceId:'uh-nura'}))).toEqual(['Modo Invisível','Conexão Mental','Toque Espectral']))
  it('keeps an ordinary human without supernatural access',()=>expect(unlockedSupernatural(make()).length).toBe(0))
  it('exposes Changelin powers without inventing a spell-acquisition rule',()=>{const c=make({raceId:'changelin'});expect(unlockedSupernatural(c)).toEqual(['Essência Mágica','Glamour','Caminho para Paradísia']);expect(validation(make({raceId:'changelin',supernaturalChoices:[grimoire[0].id]})).join(' ')).toContain('não está disponível')})
  it('contains every explicitly listed Nephalim gift',()=>expect(nephalimGifts).toHaveLength(21))
  it('does not charge racial learning points as XP',()=>{const c=make({raceId:'nephalim',supernaturalChoices:['abencoar-arma']});expect(supernaturalCost(c)).toBe(0)})
  it('enforces the smaller Karinzed capacity and the Nephalim/Tarian formula in validation',()=>{expect(validation(make({raceId:'karinzed',supernaturalChoices:['afiar']})).join(' ')).toContain('capacidade 1');const gifts=nephalimGifts.map(x=>x.id);expect(validation(make({raceId:'nephalim',racialChoices:['porte','forca'],supernaturalChoices:gifts})).join(' ')).toContain('acima da capacidade')})
  it('requires a magic sphere and enforces its graduation budget',()=>{const spell=grimoire.find(x=>x.status!=='incomplete'&&x.level>0)!;const missing=make({orderId:'mago-invocador',supernaturalChoices:[spell.id]});expect(validation(missing).join(' ')).toContain('Escolha a Esfera');const over=make({orderId:'mago-invocador',selectedSkills:['esfera:fogo'],skills:{'esfera:fogo':Math.max(0,spell.level-1)},skillSpecializations:{'esfera:fogo':'Fogo'},supernaturalChoices:[spell.id],magicSphereBySpell:{[spell.id]:'Fogo'}});expect(validation(over).join(' ')).toContain('acima')})
  it('rejects a saved spell allocated to a Sphere that does not publish that spell',()=>{const c=make({orderId:'mago-invocador',selectedSkills:['esfera:fogo'],skills:{'esfera:fogo':3},skillSpecializations:{'esfera:fogo':'Fogo'},supernaturalChoices:['abencoar-arma'],magicSphereBySpell:{'abencoar-arma':'Fogo'}});expect(validation(c).join(' ')).toContain('não pertence à Esfera Fogo')})
  it('does not grant divine invocation from the Sacerdote Order without Fé Verdadeira',()=>expect(unlockedSupernatural(make({orderIds:['sacerdote'],orderId:'sacerdote'}))).not.toContain('Grimorium'))
  it('rejects spells injected into an ordinary human and incomplete source entries',()=>{const incomplete=grimoire.find(x=>x.status==='incomplete')!;expect(validation(make({supernaturalChoices:[incomplete.id]})).join(' ')).toContain('não está disponível');expect(validation(make({raceId:'tarian',racialAllocation:{porte:6,forca:5,agilidade:4,vigor:3,inteligencia:2,percepcao:1},supernaturalChoices:[incomplete.id]})).join(' ')).toContain('regra incompleta')})
})

describe('canonical catalog coverage',()=>{
  it('keeps Antagonist conditions out of playable race selection while retaining Kahje',()=>{const ids=races.map(race=>race.id);expect(ids).toContain('kahje');['frost','az-mirah','zumbi','esqueleto','receptor-vivo','lobisomem'].forEach(id=>expect(ids).not.toContain(id))})
  it('preserves the two contradictory Changelin Glamour cadences instead of choosing one',()=>{const changelin=races.find(race=>race.id==='changelin')!;expect(changelin.unlocks.join(' ')).toContain('primavera');expect(changelin.unlocks.join(' ')).toContain('6 horas')})
  it('prices multiple Orders in acquisition order as 5, 5, 10 and 15 XP',()=>{const c=make({orderIds:['combatente','lutador','atirador','sacerdote']});expect(orderCost(c)).toBe(35)})
  it('does not impose an unpublished cap on repeatable Order abilities',()=>{const c=make({orderIds:['combatente'],orderAbilities:['manobrista'],orderAbilityLevels:{manobrista:12}});expect(orderCost(c)).toBe(65);expect(validation(c).join(' ')).not.toContain('Manobrista excede')})
  it('contains Sem Ordem plus all 17 named Orders and abilities for every published order',()=>{expect(orders).toHaveLength(18);expect(orders.filter(x=>x.id!=='sem-ordem').every(x=>x.abilities.length>0)).toBe(true)})
  it('keeps the complete Order roster from pages 33–54',()=>expect(orders.map(order=>order.id).sort()).toEqual(['sem-ordem','combatente','lutador','atirador','sacerdote','vigilante','barbaro','mago-real','ladino','cacador','paladino','bardo','agente','shaman','militar','mago-invocador','emissario','shinobi'].sort()))
  it('keeps incomplete source rules explicitly marked',()=>{const owner=orders.find(x=>x.abilities.some(a=>a.status==='incomplete'))!,incomplete=owner.abilities.find(x=>x.status==='incomplete')!;expect(orderRequirement(make({orderIds:[owner.id]}),incomplete.id)).toContain('incompleta')})
  it('never lets a confirmed Order ability escape its owning Order',()=>{
    for(const order of orders)for(const ability of order.abilities.filter(a=>a.status!=='incomplete')){
      expect(orderRequirement(make(),ability.id),`${order.name}: ${ability.name}`).toContain(order.name)
    }
  })
  it('blocks every Order ability whose source is incomplete, even for its owner',()=>{
    for(const order of orders)for(const ability of order.abilities.filter(a=>a.status==='incomplete')){
      expect(orderRequirement(make({orderIds:[order.id],orderId:order.id}),ability.id),`${order.name}: ${ability.name}`).toContain('incompleta')
    }
  })
  it('catalogs all 56 Hunter Limites and marks the source stubs instead of silently omitting them',()=>{expect(hunterPowers).toHaveLength(56);expect(hunterPowers.some(x=>x.status==='incomplete')).toBe(true)})
  it('keeps every incomplete Hunter Limite blocked and every confirmed one outside that block',()=>{
    for(const power of hunterPowers){
      const issues=validation(make({raceId:'hunter',supernaturalChoices:[power.id]})).join(' ')
      if(power.status==='incomplete')expect(issues,power.name).toContain('regra incompleta')
      else expect(issues,power.name).not.toContain('regra incompleta')
    }
  })
  it('prices confirmed Hunter power levels and Mimetismo combinations',()=>{expect(supernaturalCost(make({raceId:'hunter',supernaturalChoices:['pirocinese'],supernaturalDetails:{pirocinese:'criar'}}))).toBe(20);expect(supernaturalCost(make({raceId:'hunter',supernaturalChoices:['mimetismo'],supernaturalDetails:{mimetismo:'adquirir:otico'}}))).toBe(45)})
  it('keeps Criocinese selectable at its three published levels while flagging the copied text',()=>{expect(hunterPowers.find(x=>x.id==='criocinese')?.status).toBe('confirmed');expect(hunterPowerVariants.criocinese.map(x=>x.cost)).toEqual([10,15,20]);expect(hunterPowers.find(x=>x.id==='criocinese')?.description).toContain('errata oficial')})
  it('keeps Hidrocinese selectable at its three published levels while flagging the copied text',()=>{expect(hunterPowers.find(x=>x.id==='hidrocinese')?.status).toBe('confirmed');expect(hunterPowerVariants.hidrocinese.map(x=>x.cost)).toEqual([10,15,20]);expect(hunterPowers.find(x=>x.id==='hidrocinese')?.description).toContain('errata oficial')})
  it('prices the published +2 evolution of Vincular',()=>{expect(supernaturalCost(make({raceId:'hunter',supernaturalChoices:['vincular'],supernaturalDetails:{vincular:'basico'}}))).toBe(25);expect(supernaturalCost(make({raceId:'hunter',supernaturalChoices:['vincular'],supernaturalDetails:{vincular:'evolucao'}}))).toBe(27)})
  it('requires narrative definitions explicitly demanded by confirmed Hunter powers',()=>{expect(validation(make({raceId:'hunter',supernaturalChoices:['absorver-emocao']})).join(' ')).toContain('emoção');expect(validation(make({raceId:'hunter',supernaturalChoices:['velocidade-ampliada']})).join(' ')).toContain('fraqueza');expect(validation(make({raceId:'hunter',supernaturalChoices:['voo'],supernaturalDetails:{voo:'controle gravitacional'}})).join(' ')).not.toContain('origem do voo')})
  it('requires a valid variant for configurable Hunter powers',()=>{expect(validation(make({raceId:'hunter',supernaturalChoices:['mimetismo']})).join(' ')).toContain('variante válida');expect(validation(make({raceId:'hunter',supernaturalChoices:['mimetismo'],supernaturalDetails:{mimetismo:'assimilar:tacito'}})).join(' ')).not.toContain('variante válida')})
  it('preserves the operational formulas from the audited Hunter power pages',()=>{
    expect(hunterPowers.find(x=>x.id==='gravitocinese')?.description).toContain('5 × Porte kg')
    expect(hunterPowers.find(x=>x.id==='ventriloquismo')?.description).toContain('(Porte ×2) +3')
    expect(hunterPowers.find(x=>x.id==='discernimento')?.description).toContain('Persuadir contra Discernir')
    expect(hunterPowers.find(x=>x.id==='criar-vortex')?.description).toContain('10 + diâmetro')
    expect(hunterPowers.find(x=>x.id==='ignicao')?.description).toContain('inconsciência ou morte')
  })
  it('calculates the published Gravitocinese, Eletrocinese and Vórtex thresholds',()=>{expect(gravitokinesisParameters(12,4,2)).toEqual({minimumFaithToUse:3,maximumAreaSquareMeters:12,baseResistanceDifficulty:15,extraResistanceDifficulty:2,extraFaithCost:2,controlWeightKg:120});expect(electrokinesisResistanceDifficulty(6)).toBe(19);expect(vortexParameters(12,8,10)).toEqual({maximumDiameter:12,diameter:8,extraFaithCost:0,maintenanceMentalDifficulty:18,targetResistanceDifficulty:21})})
  it('catalogs every 48 published mundane entry and every named magical artifact',()=>{expect(equipment).toHaveLength(48);expect(equipment.map(item=>item.id).sort()).toEqual(['espada-curta','espada-longa','espada-duas-maos','espada-bastarda','faca','machado','machadinha','machado-duplo','katana','foice-pequena','foice-grande','lanca','dardo-corpo','porrete','dardo','funda','arco-longo','arco-curto','revolver','pistola','submetralhadora','rifle-assalto','espingarda','sniper','bazuca','pistola-laser','rifle-laser','canhao-laser','roupa-grossa','jaqueta-couro','corselete-tecido','corselete-couro','cota-malha','armadura-escamas','armadura-placas','armadura-completa','kevlar','kevlar-reforcado','broquel','escudo','escudo-corpo','violao','guitarra','servico-1','servico-2','servico-3','servico-4','servico-5'].sort());expect(magicalEquipment).toHaveLength(18)})
  it('keeps every named magical artifact rather than silently dropping entries with incomplete statistics',()=>expect(magicalEquipment.map(item=>item.id).sort()).toEqual(['rebeliao','yamato','agni-rudra','osiris','cerberus','lanca-destino','livro-nomes-mortos','arma-entidade','colar-contas','armas-elementais','filha-anarquia','desbravadora','manto-desconhecido','vingadora-sagrada','lamina-cain','esmagadora-almas','lamento-floresta','arma-servico'].sort()))
  it('retains the complete published operation text for Filha da Anarquia',()=>{const item=magicalEquipment.find(x=>x.id==='filha-anarquia')!;expect(item.notes).toContain('Proteger');expect(item.notes).toContain('Ferir Alma (10 XP)');expect(item.notes).toContain('Chicote Radial (10 XP)');expect(item.notes).toContain('Última Esperança')})
  it('retains Desbravadora transformations and its seven published daily magic limits',()=>{const item=magicalEquipment.find(x=>x.id==='desbravadora')!;expect(item.notes).toContain('Chicote Longo +5 Flamejante');expect(item.notes).toContain('Morte Mágica 1×');expect(item.notes).toContain('DIF 15 + Diferença de PRT')})
  it('retains every published Manto do Desconhecido active and activated ability',()=>{const item=magicalEquipment.find(x=>x.id==='manto-desconhecido')!;for(const term of ['Esticar','Envolver','Passo Espiritual','Massa Alterada','Fortalecer','Regenerar'])expect(item.notes).toContain(term)})
  it('retains full level progression and curses of the published divine and profane blades',()=>{expect(magicalEquipment.find(x=>x.id==='vingadora-sagrada')?.notes).toContain('N5');expect(magicalEquipment.find(x=>x.id==='lamina-cain')?.notes).toContain('1d3 FID');expect(magicalEquipment.find(x=>x.id==='esmagadora-almas')?.notes).toContain('Plano Abissal')})
  it('retains Lamento rules and preserves the two missing Arma de Serviço forms as incomplete',()=>{expect(magicalEquipment.find(x=>x.id==='lamento-floresta')?.notes).toContain('Inimigo da Natureza');const item=magicalEquipment.find(x=>x.id==='arma-servico')!;expect(item.status).toBe('incomplete');expect(item.notes).toContain('Explosão/lança-granadas e Carga/lança-foguetes não têm dano ou alcance publicados')})
  it('catalogs the ten named magical enhancements without inventing acquisition or effect rules',()=>{expect(magicalEnhancements.map(item=>item.name)).toEqual(['Regenerar','RD','Profana','Elétrica','Flamejante','Congelante','Sagrada','Drenar Determinação','Drenar Saúde','Drenar Força']);expect(magicalEnhancements.every(item=>item.status==='incomplete')).toBe(true)})
  it('catalogs the two weighted objects published on page 80',()=>{expect(equipment.find(x=>x.id==='violao')?.weight).toBe(.7);expect(equipment.find(x=>x.id==='guitarra')?.weight).toBe(2)})
  it('keeps published equipment weight intervals as intervals instead of inventing a single total',()=>expect(equipmentWeightBounds(equipment,['espada-curta','faca','violao'])).toEqual({minimum:5.7,maximum:9.7,hasUnknown:false}))
  it('preserves published weapon weight ranges and the two Dardo classifications',()=>{expect(equipment.find(x=>x.id==='espada-duas-maos')?.weightRange).toBe('15–19 kg');expect(equipment.find(x=>x.id==='dardo-corpo')?.complexity).toBe('Média');expect(equipment.find(x=>x.id==='dardo')?.complexity).toBe('Simples')})
  it('catalogs blank-priced services as visible but incomplete source entries',()=>{const services=equipment.filter(x=>x.id.startsWith('servico-'));expect(services).toHaveLength(5);expect(services.every(x=>x.status==='incomplete')).toBe(true)})
  it('calculates load bands without inventing the two truncated table cells',()=>{expect(encumbrance(make({carriedWeight:2})).level).toBe('Nenhuma carga');expect(encumbrance(make({carriedWeight:4})).status).toBe('incomplete');expect(encumbrance(make({carriedWeight:8})).penalty).toContain('−1');expect(encumbrance(make({carriedWeight:15})).status).toBe('incomplete');expect(encumbrance(make({carriedWeight:25})).penalty).toContain('−4')})
  it('locks Tiro Duplo until Experiente is owned',()=>expect(orderRequirement(make({orderId:'atirador'}),'tiro-duplo')).toContain('Experiente'))
  it('preserves the distinct published difficulty reductions for Combatente and Atirador',()=>{
    expect(orders.find(x=>x.id==='combatente')?.abilities.find(x=>x.id==='experiente')?.description).toContain('Reduz em 5')
    expect(orders.find(x=>x.id==='atirador')?.abilities.find(x=>x.id==='experiente-atirador')?.description).toContain('Reduz em 4')
  })
  it('keeps the Agente Ofensivo penalty distinct from other repeatable attacks',()=>{
    const ofensivo=orders.find(x=>x.id==='agente')?.abilities.find(x=>x.id==='ofensivo-agente')
    expect(ofensivo?.description).toContain('−1')
    expect(ofensivo?.repeatable).toBe(true)
  })
  it('does not unlock an ability from an Order the character has not joined',()=>expect(orderRequirement(make({orderIds:['combatente']}),'precisao')).toContain('Atirador'))
  it('checks weapon complexity for Experiente instead of accepting any NH 15 weapon',()=>{const simple=make({orderIds:['atirador'],selectedSkills:['armas:pistola'],skills:{'armas:pistola':10},skillCosts:{'armas:pistola':1}});const complex=make({orderIds:['atirador'],selectedSkills:['armas:sniper'],skills:{'armas:sniper':10},skillCosts:{'armas:sniper':3}});expect(orderRequirement(simple,'experiente-atirador')).toBeNull();expect(orderRequirement(complex,'experiente-atirador')).toContain('Complexa NH 21')})
  it('uses the lower Defensivo threshold for Agente while retaining the higher Experiente threshold',()=>{const c=make({orderIds:['agente'],selectedSkills:['armas:pistola'],skills:{'armas:pistola':7},skillCosts:{'armas:pistola':1}});expect(orderRequirement(c,'defensivo-agente')).toBeNull();expect(orderRequirement(c,'experiente-agente')).toContain('Simples NH 15')})
  it('requires another Militar ability for Equipe, not an ability from another Order',()=>{expect(orderRequirement(make({orderIds:['militar','combatente'],orderAbilities:['manobrista']}),'equipe')).toContain('Militar');expect(orderRequirement(make({orderIds:['militar'],orderAbilities:['foco-missao']}),'equipe')).toBeNull()})
  it('treats every listed multi-prerequisite as cumulative rather than accepting only the first one',()=>{
    const barbarian=make({orderIds:['barbaro'],attributes:{...defaultCharacter.attributes,forca:12,vigor:10}})
    expect(orderRequirement(barbarian,'resistente-barbaro')).toContain('Vigor 12')
    const bardo=make({orderIds:['bardo'],attributes:{...defaultCharacter.attributes,porte:11},skills:{atuar:7}})
    expect(orderRequirement(bardo,'fortalecer')).toContain('Porte 12')
    const shinobi=make({orderIds:['shinobi'],attributes:{...defaultCharacter.attributes,percepcao:13,agilidade:12}})
    expect(orderRequirement(shinobi,'arremesso-preciso')).toContain('Agilidade 13')
    const emissario=make({orderIds:['emissario'],orderAbilities:['adaptado'],attributes:{...defaultCharacter.attributes,porte:15,inteligencia:14}})
    expect(orderRequirement(emissario,'andarilho-horizonte')).toContain('Inteligência 15')
  })
  it('retains every concrete Sangue Frio combat outcome in the published catalog text',()=>{
    const sangueFrio=orders.find(x=>x.id==='militar')?.abilities.find(x=>x.id==='sangue-frio')?.description||''
    ;['relançar 2d6','+1 ataque','+50% dano','1d3+1 RD','+1 aleatório','sexto resultado não foi impresso'].forEach(effect=>expect(sangueFrio).toContain(effect))
  })
  it('requires one distinct published Emissário device for every purchase',()=>{const incomplete=make({orderIds:['emissario'],orderAbilities:['tecnologia-alien'],orderAbilityLevels:{'tecnologia-alien':2},orderAbilityDetails:{'tecnologia-alien':'Acelerador de Movimento'}});expect(validation(incomplete).join(' ')).toContain('2 opções válidas');const valid=make({orderIds:['emissario'],orderAbilities:['tecnologia-alien'],orderAbilityLevels:{'tecnologia-alien':2},orderAbilityDetails:{'tecnologia-alien':'Acelerador de Movimento|Controle Tecnológico'}});expect(validation(valid).join(' ')).not.toContain('opções válidas')})
  it('rejects duplicate Adaptado types and repeat levels above their published limits',()=>{const duplicate=make({orderIds:['emissario'],orderAbilities:['adaptado'],orderAbilityLevels:{adaptado:2},orderAbilityDetails:{adaptado:'Fogo/Calor|Fogo/Calor'}});expect(validation(duplicate).join(' ')).toContain('opções válidas');const over=make({orderIds:['emissario'],orderAbilities:['adaptado'],orderAbilityLevels:{adaptado:7},orderAbilityDetails:{adaptado:'Fogo/Calor|Frio/Gelo|Ácido|Efeitos Mentais|Eletricidade|Radiação|Fogo/Calor'}});expect(validation(over).join(' ')).toContain('máximo de 6')})
  it('limits Método de Invocação to the two additional published methods',()=>{const valid=make({orderIds:['mago-invocador'],orderAbilities:['metodo'],orderAbilityLevels:{metodo:2},orderAbilityDetails:{metodo:'Lírico|Rúnico'}});expect(validation(valid).join(' ')).not.toContain('opções válidas');const invalid=make({orderIds:['mago-invocador'],orderAbilities:['metodo'],orderAbilityLevels:{metodo:2},orderAbilityDetails:{metodo:'Lírico|Lírico'}});expect(validation(invalid).join(' ')).toContain('opções válidas')})
  it('flags saved abilities whose Order was removed',()=>expect(validation(make({orderIds:['combatente'],orderAbilities:['precisao']})).join(' ')).toContain('Atirador'))
  it('implements the published Shinobi Sentidos Aflorados levels',()=>{const locked=make({orderIds:['shinobi'],attributes:{...defaultCharacter.attributes,percepcao:11}});expect(orderRequirement(locked,'sentidos-aflorados')).toContain('Percepção 12');const c=make({orderIds:['shinobi'],orderAbilities:['sentidos-aflorados'],orderAbilityLevels:{'sentidos-aflorados':3},attributes:{...defaultCharacter.attributes,percepcao:12}});expect(skillNh(c,'observar','percepcao')).toBe(10);expect(derived(c).reflexes).toBe(11);expect(orderRequirement(c,'mascara-shinobi')).toContain('Arremesso Preciso')})
})
