import type { TMemoListsDB } from '../types'
import { ARepository } from './repository'
import type { IList } from '~/core/lists/types'

export class ListsRepo extends ARepository<TMemoListsDB> {
  update(key: number, data: IList[]) {
    return this.getTable().bulkUpdate([
      { key, changes: { data: JSON.parse(JSON.stringify(data)) } },
    ])
  }

  async sync(groupId: number, items?: IList[] | null): Promise<void> {
    if (!items) return
    const item = (await this.getByGroupId(groupId))[0]
    if (item) this.update(item.id, items)
    else this.create([{ groupId, data: items }])
  }

  getTable() {
    return this.db.lists
  }
}
