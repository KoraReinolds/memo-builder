import type { Table } from 'dexie'
import type { Links } from '~/core/links/types'
import type { IList } from '~/core/lists/types'
import type { IItem } from '~/db/items'

export interface IMemoDB<T> {
  id?: number
  groupId: number
  data: T
}

export type TMemoLinksDB = IMemoDB<Links>
export type TMemoListsDB = IMemoDB<IList>
export type TMemoItemsDB = IMemoDB<IItem>

export type TGetDBType<T> = T extends IMemoDB<infer U> ? U : never

export interface IStorage {
  links: Table<TMemoLinksDB>
  lists: Table<TMemoListsDB>
  items: Table<TMemoItemsDB>
}
