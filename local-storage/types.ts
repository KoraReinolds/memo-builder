import type { EntityTable } from 'dexie'
import type { Links } from '~/core/links/types'
import type { IList } from '~/core/lists/types'
import type { IItem } from '~/db/items'

export interface IMemoDB<T> {
  id: number
  groupId: number
  data: T
}

export type TMemoLinksDB = IMemoDB<Links>
export type TMemoListsDB = IMemoDB<IList[]>
export type TMemoItemsDB = IMemoDB<IItem[]>

export type TGetDBType<T> = T extends IMemoDB<infer U> ? U : never

export interface IStorage {
  links: EntityTable<TMemoLinksDB, 'id'>
  lists: EntityTable<TMemoListsDB, 'id'>
  items: EntityTable<TMemoItemsDB, 'id'>
}
