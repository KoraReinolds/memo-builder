import Dexie from 'dexie'
import type { IStorage } from './types'

export const db = new Dexie('memo') as Dexie & IStorage

db.version(1).stores({
  links: '++id,data,groupId',
  lists: '++id,data,groupId',
  items: '++id,data,groupId',
})
