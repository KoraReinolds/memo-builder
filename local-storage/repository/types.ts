import type { IMemoDB } from '../types'

export interface IRepo<T extends IMemoDB<any>> {
  getByid(ids: number[]): Promise<(T | undefined)[]>
  getByGroupId(groupId: number): Promise<T[]>
  create(items: T[]): void
}
