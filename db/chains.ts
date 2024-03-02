import { PrismaClient } from '@prisma/client'
import { pipe } from 'ramda'
import { idsArrayDelete } from './lib'
import type { IHasID } from '~/core/id/types'

const prisma = new PrismaClient()

interface ICreateChainParams {
  listId: number
  itemIds: number[]
}

export const getChain = async (where: IHasID) =>
  await prisma.chain.findUniqueOrThrow({ where })

export const createChain = async ({ listId, itemIds }: ICreateChainParams) =>
  await prisma.chain.create({
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

export const deleteChain = pipe(idsArrayDelete, prisma.chain.deleteMany)

export const getOrCreateChain = async (params: ICreateChainParams & IHasID) => {
  try {
    return await getChain(params)
  } catch (e) {
    return await createChain(params)
  }
}
