import type { TMemoItemsDB } from '../types'
import { ARepository } from './repository'
import type { IItem } from '~/db/items'

export class ItemsRepo extends ARepository<TMemoItemsDB> {
  update(key: number, data: IItem[]) {
    return this.getTable().bulkUpdate([{ key, changes: { data } }])
  }

  getTable() {
    return this.db.items
  }
}
