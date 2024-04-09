import Dexie, { type Table } from 'dexie'
import type { IMemoDB } from './types'
import type { Links } from '~/core/links/types'
import type { IItem } from '~/db/items'
import type { IList } from '~/core/lists/types'

export class MemoDB extends Dexie {
  links!: Table<IMemoDB<Links>>
  lists!: Table<IMemoDB<IList>>
  items!: Table<IMemoDB<IItem>>

  constructor() {
    super('memo')
    this.version(1).stores({
      links: '++id, data',
      lists: '++id, data',
      items: '++id, data',
    })
  }
}

export const db = new MemoDB()
