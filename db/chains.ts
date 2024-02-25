import { PrismaClient } from '@prisma/client'
import { objOf, pipe } from 'ramda'
import { idsArrayDelete } from './lib'
import type { IItem } from './items'
import type { IHasID } from '~/core/id/types'

const prisma = new PrismaClient()

interface ICreateChainParams {
  listId: number
  items?: IItem[]
}

export const getChain = async (where: IHasID) =>
  await prisma.chain.findUniqueOrThrow({ where })

export const createChain = async ({ listId, items }: ICreateChainParams) =>
  await prisma.chain.create({
    data: {
      listId,
      items: objOf('create')(items),
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
