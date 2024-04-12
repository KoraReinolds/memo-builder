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

interface IGetItemsByGroupIdParams
  extends Partial<
    IHasID & {
      groupId: number
    }
  > {}

interface IGetItemsByListIdParams
  extends Partial<
    IHasID & {
      listId: number
    }
  > {}

export const getItemsByGroupId = async (where: IGetItemsByGroupIdParams) => {
  const chainsWithItems = await prisma.chain.findMany({
    where: {
      list: {
        groupId: where.groupId,
      },
      deleted: false,
    },
    include: {
      items: {
        select: {
          order: true,
          item: {
            select: {
              data: true,
            },
          },
        },
      },
    },
  })

  return chainsWithItems.map(({ id, items, listId }) => ({
    id,
    listId,
    data: items
      .sort((a, b) => a.order - b.order)
      .map(({ item }) => item.data)
      .join(' '),
  }))
}

export const getItems = async (where: IGetItemsByListIdParams) => {
  const chainsWithItems = await prisma.chain.findMany({
    where: {
      ...where,
      deleted: false,
    },
    include: {
      items: {
        select: {
          order: true,
          item: {
            select: {
              data: true,
            },
          },
        },
      },
    },
  })

  return chainsWithItems.map(({ id, items }) => ({
    id,
    data: items
      .sort((a, b) => a.order - b.order)
      .map(({ item }) => item.data)
      .join(' '),
  }))
}

export const getItem = async (where: IHasID) => {
  const chainWithItems = await prisma.chain.findUniqueOrThrow({
    where,
    include: {
      items: {
        select: {
          order: true,
          item: {
            select: {
              data: true,
            },
          },
        },
      },
    },
  })

  return {
    id: chainWithItems.id,
    data: chainWithItems.items
      .sort((a, b) => a.order - b.order)
      .map(({ item }) => item.data)
      .join(' '),
  }
}

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

  return {
    ...(await createChain({
      listId,
      itemIds,
    })),
    data,
  }
}

export const deleteItems = pipe(idsArrayDelete, prisma.item.deleteMany)

export const getOrCreateItem = async (params: IItemCreateParams & IHasID) => {
  try {
    return await getItem(params)
  } catch (e) {
    return await createItem(params)
  }
}
