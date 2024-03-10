import type { IItem } from '../items/types'

interface IAssociationSettings {
  listId: number
  count: number
}

export interface ICountRange {
  min: number
  max: number
}

interface ISuggestionSettings {
  listId: number
  count: number | ICountRange
  totalCount: number
}

export type Validator = (items: IItem[], result: IItem[]) => boolean

export interface IMemoConfig {
  associations: IAssociationSettings
  suggestions: ISuggestionSettings
  validator?: Validator
}
