import type { TMemoItemsDB } from '../types'
import { ARepository } from './repository'
import type { IItem } from '~/db/items'

export class ItemsRepo extends ARepository<TMemoItemsDB> {
  update(key: number, data: IItem[]) {
    return this.getTable().bulkUpdate([
      { key, changes: { data: JSON.parse(JSON.stringify(data)) } },
    ])
  }

  async sync(groupId: number, items?: IItem[] | null): Promise<void> {
    if (!items) return
    const item = (await this.getByGroupId(groupId))[0]
    if (item) this.update(item.id, items)
    else this.create([{ groupId, data: items }])
  }

  getTable() {
    return this.db.items
  }
}
