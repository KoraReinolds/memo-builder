import type { Table } from 'dexie'
import type { IMemoDB, IStorage } from '../types'
import type { IRepo } from './types'

export abstract class ARepository<T extends IMemoDB<any>> implements IRepo<T> {
  constructor(protected db: IStorage) {}

  getByid(ids: number[]) {
    return this.getTable().bulkGet(ids)
  }

  create(items: T[]): void {
    this.getTable().bulkAdd(items)
  }

  abstract getTable(): Table<T>
}
