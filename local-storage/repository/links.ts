import type { TMemoLinksDB } from '../types'
import { ARepository } from './repository'

export class LinksRepo extends ARepository<TMemoLinksDB> {
  getTable() {
    return this.db.links
  }
}
