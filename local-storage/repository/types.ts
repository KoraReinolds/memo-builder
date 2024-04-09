import type { IMemoDB } from '../types'

export interface IRepo<T extends IMemoDB<any>> {
  getByid(ids: number[]): Promise<(T | undefined)[]>
  create(items: T[]): void
}
