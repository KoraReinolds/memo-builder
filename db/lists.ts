import { PrismaClient } from '@prisma/client'
import type { IHasID } from '~/core/id/types'

const prisma = new PrismaClient()

type ICreateListParams = {
  groupId: number
  name: string
}

export const getList = async (where: IHasID) =>
  await prisma.list.findUniqueOrThrow({ where })

export const getListsOfGroup = async (groupId: number) =>
  await prisma.list.findMany({
    where: {
      groupId,
    },
  })

export const createList = async (data: ICreateListParams) =>
  await prisma.list.create({ data })

export const deleteLists = async (data: number[]) =>
  await prisma.list.deleteMany({
    where: {
      OR: data.map((id) => ({ id })),
    },
  })

export const getOrCreateList = async (params: ICreateListParams & IHasID) => {
  try {
    return await getList(params)
  } catch (e) {
    return await createList(params)
  }
}
