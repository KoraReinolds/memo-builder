import { PrismaClient } from '@prisma/client'
import { pipe } from 'ramda'
import { idsArrayDelete } from './lib'
import type { IHasID } from '~/core/id/types'

const prisma = new PrismaClient()

interface ICreateChainParams {
  listId: number
  itemIds: number[]
  // items: {
  //   id: number
  //   index: number
  // }[]
}

export const getChain = async (where: IHasID) =>
  await prisma.chain.findUniqueOrThrow({ where })

export const createChain = async ({ listId, itemIds }: ICreateChainParams) => {
  const chain = await prisma.chain.create({
    data: {
      listId,
      items: {
        create: itemIds.map((id) => ({
          item: {
            connect: { id },
          },
        })),
      },
    },
  })

  Promise.all(
    itemIds.map((itemId, order) =>
      prisma.itemChain.update({
        where: {
          itemId_chainId: {
            itemId,
            chainId: chain.id,
          },
        },
        data: {
          order,
        },
      }),
    ),
  )

  return chain
}

export const deleteChain = pipe(idsArrayDelete, prisma.chain.deleteMany)

export const hideChains = async (ids: number[]) =>
  await prisma.chain.updateMany({
    where: { id: { in: ids } },
    data: { deleted: true },
  })

export const getOrCreateChain = async (params: ICreateChainParams & IHasID) => {
  try {
    return await getChain(params)
  } catch (e) {
    return await createChain(params)
  }
}
