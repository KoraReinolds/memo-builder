import { PrismaClient } from '@prisma/client'
import { pipe } from 'ramda'
import { idsArrayDelete } from './lib'
import type { IHasID } from '~/core/id/types'

const prisma = new PrismaClient()

type IItem = {
  data: string
}

export const getItems = async (where: Partial<IItem> & IHasID) =>
  await prisma.item.findMany({ where })

export const getItem = async (where: IHasID) =>
  await prisma.item.findUniqueOrThrow({ where })

export const createItem = async (data: IItem) =>
  await prisma.item.create({ data })

export const deleteItems = pipe(idsArrayDelete, prisma.item.deleteMany)

export const getOrCreateItem = async (params: IItem & IHasID) => {
  try {
    return await getItem(params)
  } catch (e) {
    return await createItem(params)
  }
}
