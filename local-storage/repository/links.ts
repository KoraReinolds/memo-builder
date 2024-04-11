import type { TMemoLinksDB } from '../types'
import { ARepository } from './repository'
import type { Links } from '~/core/links/types'

export class LinksRepo extends ARepository<TMemoLinksDB> {
  update(key: number, data: Links) {
    return this.getTable().bulkUpdate([{ key, changes: { data } }])
  }

  getTable() {
    return this.db.links
  }
}
