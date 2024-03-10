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
}

export interface IMemoConfig {
  associations: IAssociationSettings
  suggestions: ISuggestionSettings
  validator?: (answer: string) => boolean
}
