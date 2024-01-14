import type { IRepository } from './types'
import type { ID, IHasID } from '~/interfaces/IHasID'

const select = <T extends IHasID>(items: T[], ids: ID[]): T[] =>
  items.filter((item) => ids.includes(item.id))

const add = <T extends IHasID>(items: T[], newItems: T[]): T[] =>
  items.concat(newItems)

const remove = <T extends IHasID>(items: T[], ids: ID[]): T[] =>
  items.filter((item) => !ids.includes(item.id))

const edit = <T extends IHasID>(
  items: T[],
  ids: ID[],
  apply: (item: T) => T,
): T[] => items.map((item) => (ids.includes(item.id) ? apply(item) : item))

const repository: IRepository = {
  select,
  add,
  remove,
  edit,
}

export { repository }
