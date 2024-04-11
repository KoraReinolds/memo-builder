import type { IMemoDB } from '../types'

export interface IRepo<T extends IMemoDB<any>> {
  getByGroupId(groupId: number): Promise<T[]>
  create(items: T[]): void
}
