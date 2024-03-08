import { PrismaClient } from '@prisma/client'
import type { IHasID } from '~/core/id/types'

const prisma = new PrismaClient()

interface IGroup {
  name: string
}

interface ICreateGroupParams extends IGroup {
  userId: number
}
export const getGroupsByUserId = async (where: IHasID) =>
  (
    await prisma.user.findUnique({
      where,
      include: {
        groups: {
          where: {
            deleted: false,
          },
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  )?.groups

export const getGroups = async (where: Partial<IGroup> & IHasID) =>
  await prisma.group.findMany({
    where,
    select: {
      id: true,
      name: true,
    },
  })

export const getGroup = async (where: IHasID) =>
  await prisma.group.findUniqueOrThrow({ where })

export const createGroup = async (data: ICreateGroupParams & Partial<IHasID>) =>
  await prisma.group.create({ data })

export const hideGroups = async (ids: number[]) =>
  await prisma.group.updateMany({
    where: { id: { in: ids } },
    data: { deleted: true },
  })

export const deleteGroups = async (ids: number[]) =>
  await prisma.group.deleteMany({ where: { id: { in: ids } } })

export const getOrCreateGroup = async (params: ICreateGroupParams & IHasID) => {
  try {
    return await getGroup(params)
  } catch (e) {
    return await createGroup(params)
  }
}
