import type { TMemoListsDB } from '../types'
import { ARepository } from './repository'

export class ListsRepo extends ARepository<TMemoListsDB> {
  getTable() {
    return this.db.lists
  }
}
