import type { EntityTable, InsertType } from 'dexie'
import type { IMemoDB, IStorage, TGetDBType } from '../types'
import type { IRepo } from './types'

export abstract class ARepository<T extends IMemoDB<any>> implements IRepo<T> {
  constructor(protected db: IStorage) {}

  getByGroupId(groupId: number) {
    return this.getTable().where({ groupId }).toArray()
  }

  create(items: InsertType<T, 'id'>[]): void {
    this.getTable().bulkAdd(JSON.parse(JSON.stringify(items)))
  }

  abstract sync(groupId: number, items: TGetDBType<T>): Promise<void>

  abstract update(key: number, data: TGetDBType<T>): Promise<number>

  abstract getTable(): EntityTable<T, 'id'>
}
