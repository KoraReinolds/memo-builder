import type { ID, IHasID } from '~/interfaces/IHasID'

interface IRepository {
  select<T extends IHasID>(items: T[], ids: ID[]): T[]
  add<T extends IHasID>(items: T[], newItems: T[]): T[]
  remove<T extends IHasID>(items: T[], ids: ID[]): T[]
  edit<T extends IHasID>(items: T[], ids: ID[], apply: (item: T) => T): T[]
}

export type { IRepository }
