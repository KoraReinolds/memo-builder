import type { TMemoLinksDB } from '../types'
import { ARepository } from './repository'
import type { Links } from '~/core/links/types'

export class LinksRepo extends ARepository<TMemoLinksDB> {
  update(key: number, data: Links) {
    return this.getTable().bulkUpdate([
      { key, changes: { data: JSON.parse(JSON.stringify(data)) } },
    ])
  }

  async sync(groupId: number, items?: Links | null): Promise<void> {
    if (!items) return
    const item = (await this.getByGroupId(groupId))[0]
    if (item) this.update(item.id, items)
    else this.create([{ groupId, data: items }])
  }

  getTable() {
    return this.db.links
  }
}
