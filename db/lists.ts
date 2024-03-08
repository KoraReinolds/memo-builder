import { PrismaClient } from '@prisma/client'
import type { IHasID } from '~/core/id/types'

const prisma = new PrismaClient()

type ICreateListParams = {
  groupId: number
  name: string
}

export const getList = async (where: IHasID) =>
  await prisma.list.findUniqueOrThrow({ where: { ...where, deleted: false } })

export const getListsByGroupId = async (groupId: number) =>
  await prisma.list.findMany({
    where: {
      groupId,
      deleted: false,
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

export const hideLists = async (ids: number[]) =>
  await prisma.list.updateMany({
    where: { id: { in: ids } },
    data: { deleted: true },
  })

export const getOrCreateList = async (params: ICreateListParams & IHasID) => {
  try {
    return await getList(params)
  } catch (e) {
    return await createList(params)
  }
}
