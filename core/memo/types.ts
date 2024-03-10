interface IAssociationSettings {
  listId: number
  count: number
}

interface ISuggestionSettings {
  listId: number
  count: number
}

export interface IMemoConfig {
  associations: IAssociationSettings
  suggestions: ISuggestionSettings
  validator?: (answer: string) => boolean
}
