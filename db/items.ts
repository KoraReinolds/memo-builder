import { PrismaClient } from '@prisma/client'
import { map, objOf, pipe, prop, split } from 'ramda'
import { idsArrayDelete } from './lib'
import { createChain } from './chains'
import type { IHasID } from '~/core/id/types'

const prisma = new PrismaClient()

export interface IItem {
  data: string
}

interface IItemCreateParams extends IItem {
  listId: number
}

export const getItems = async (where: Partial<IItem> & IHasID) =>
  await prisma.item.findMany({ where })

export const getItem = async (where: IHasID) =>
  await prisma.item.findUniqueOrThrow({ where })

export const createItem = async ({ data, listId }: IItemCreateParams) => {
  const itemsData = pipe(split(' '), map(objOf('data')))(data)

  await prisma.item.createMany({
    data: itemsData,
    skipDuplicates: true,
  })

  const itemIds = map(
    prop('id'),
    await prisma.item.findMany({
      where: {
        data: {
          in: itemsData.map((item) => item.data),
        },
      },
      select: {
        id: true,
      },
    }),
  )

  return await createChain({
    listId,
    itemIds,
  })
}

export const deleteItems = pipe(idsArrayDelete, prisma.item.deleteMany)

export const getOrCreateItem = async (params: IItemCreateParams & IHasID) => {
  try {
    return await getItem(params)
  } catch (e) {
    return await createItem(params)
  }
}
