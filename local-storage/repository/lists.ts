import type { TMemoListsDB } from '../types'
import { ARepository } from './repository'
import type { IList } from '~/core/lists/types'

export class ListsRepo extends ARepository<TMemoListsDB> {
  update(key: number, data: IList[]) {
    return this.getTable().bulkUpdate([{ key, changes: { data } }])
  }

  getTable() {
    return this.db.lists
  }
}
