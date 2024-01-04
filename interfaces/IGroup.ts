interface IGroup {
  id: number
  name: string
}

interface IList {
  id: number
  name: string
}

interface IItem {
  id: number
  data: string
  listId: number
}

type Links = Map<number, number[]>

export type { IGroup, IList, IItem, Links }
