export type AttributeKey = 'porte' | 'forca' | 'agilidade' | 'vigor' | 'inteligencia' | 'percepcao'
export type RaceId = 'humano' | 'hunter' | 'nephalim' | 'tarian' | 'anao' | 'elfo' | 'meio-elfo' | 'uh-nura' | 'espirito' | 'karinzed' | 'changelin' | 'kahje'
export type StepId = 'identidade' | 'raca' | 'atributos' | 'ordem' | 'pericias' | 'tracos' | 'equipamento' | 'sobrenatural' | 'resumo'

export interface Character {
  name: string
  player: string
  age: number
  concept: string
  startingXp: number
  raceId: RaceId
  raceConfirmed: boolean
  racialChoices: AttributeKey[]
  racialAllocation: Partial<Record<AttributeKey, number>>
  raceOptions: Record<string, string>
  attributes: Record<AttributeKey, number>
  orderId: string | null
  orderConfirmed: boolean
  orderIds: string[]
  orderAbilities: string[]
  orderAbilityLevels: Record<string, number>
  orderAbilityDetails: Record<string, string>
  selectedSkills: string[]
  skills: Record<string, number>
  skillSpecializations: Record<string, string>
  skillCosts: Record<string, number>
  qualities: string[]
  defects: string[]
  traitLevels: Record<string, number>
  traitDetails: Record<string, string>
  antecedents: { appearance: string; resources: number; literacy: number; renown: number }
  peculiarities: string[]
  equipment: string[]
  carriedWeight: number
  supernaturalChoices: string[]
  supernaturalDetails: Record<string, string>
  magicSphereBySpell: Record<string, string>
}

export interface CatalogItem {
  id: string; name: string; description: string; cost: number
  requirements?: string[]; page?: number
  status?: 'confirmed' | 'incomplete'; repeatable?: boolean
}
