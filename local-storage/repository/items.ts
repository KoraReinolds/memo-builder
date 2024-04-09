import type { TMemoItemsDB } from '../types'
import { ARepository } from './repository'

export class ItemsRepo extends ARepository<TMemoItemsDB> {
  getTable() {
    return this.db.items
  }
}
