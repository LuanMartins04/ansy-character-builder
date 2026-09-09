export const skillProgressions:Record<string,{at:number;benefit:string}[]>={
  armasBrancas:[{at:6,benefit:'+1 dano'},{at:12,benefit:'+1 aparar'},{at:18,benefit:'+2 dano'},{at:24,benefit:'+1 aparar'},{at:30,benefit:'+2 dano e +1 ataque'},{at:36,benefit:'+2 aparar e +1 ataque'},{at:42,benefit:'+3 dano, +2 aparar e +2 ataques'}],
  armasAlcance:[{at:6,benefit:'+1 dano'},{at:12,benefit:'+1 ao mirar por ação'},{at:18,benefit:'+2 dano'},{at:24,benefit:'+1 ao mirar por ação'},{at:30,benefit:'+2 dano e +1 ataque'},{at:36,benefit:'+2 ao mirar e +1 ataque'},{at:42,benefit:'+3 dano, +2 ao mirar e +2 ataques'}],
  'artes-marciais':[{at:4,benefit:'+1 dano'},{at:8,benefit:'+2 dano e +1 aparar'},{at:12,benefit:'+3 dano e +2 aparar'},{at:16,benefit:'+4 dano, +3 aparar e +1 ataque'},{at:20,benefit:'+5 dano, +3 aparar e +2 ataques'},{at:28,benefit:'+6 dano, +4 aparar e +2 ataques'},{at:32,benefit:'+7 dano, +4 aparar e +3 ataques'},{at:36,benefit:'+8 dano, +5 aparar e +3 ataques'}],
  briga:[{at:6,benefit:'+1 dano'},{at:12,benefit:'+1 dano e +1 aparar'},{at:18,benefit:'+2 dano e +1 aparar'},{at:24,benefit:'+2 dano e +1 ataque'},{at:30,benefit:'+2 dano, +2 aparar e +1 ataque'},{at:36,benefit:'+2 dano, +2 aparar e +2 ataques'},{at:42,benefit:'+3 dano, +2 aparar e +2 ataques'}],
  persuadir:[{at:5,benefit:'libera Interrogar; teste contra Resistência Mental, com bônus situacionais de +1 a +3, +2 por vínculo relevante ou +5 por Protegido'}],
  sobrevivencia:[{at:3,benefit:'recupera Saúde em velocidade normal em ambientes selvagens; abaixo disso, recupera à metade'}],
  idioma:[{at:1,benefit:'decifra e entende partes básicas com Inteligência 18'},{at:2,benefit:'compreende o idioma por completo, exceto fundamentos complexos'},{at:3,benefit:'fala como nativo e compreende fundamentos primordiais'}],
}
// Uses the exact specialization labels from `skillSpecializationRules.armas`.
// This is deliberately label-based because the sheet stores an independent
// specialization instance (for example, `armas:<timestamp>`), not an item id.
export const rangedWeapons=['Dardo (alcance)','Funda / Estilingue','Revólver','Pistola','Pistola Laser','Arco Longo','Arco Curto','Submetralhadora','Metralhadora / Rifle de Assalto','Espingarda','Rifle Laser','Rifle Sniper','Bazuca','Canhão Laser']
