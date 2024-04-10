import Dexie, { type Table } from 'dexie'
import type { IMemoDB, IStorage } from './types'
import type { Links } from '~/core/links/types'
import type { IItem } from '~/db/items'
import type { IList } from '~/core/lists/types'

export class MemoDB extends Dexie implements IStorage {
  links!: Table<IMemoDB<Links>>
  lists!: Table<IMemoDB<IList>>
  items!: Table<IMemoDB<IItem>>

  constructor() {
    super('memo')
    this.version(1).stores({
      links: '++id,data,groupId',
      lists: '++id,data,groupId',
      items: '++id,data,groupId',
    })
  }
}

export const db = new MemoDB()
