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

export type { IGroup, IList, IItem }
