import { PrismaClient } from '@prisma/client'
import { pipe } from 'ramda'
import { idsArrayDelete } from './lib'
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

export const createGroup = async (data: ICreateGroupParams & IHasID) =>
  await prisma.group.create({ data })

export const deleteGroups = pipe(idsArrayDelete, prisma.group.deleteMany)

export const getOrCreateGroup = async (params: ICreateGroupParams & IHasID) => {
  try {
    return await getGroup(params)
  } catch (e) {
    return await createGroup(params)
  }
}
