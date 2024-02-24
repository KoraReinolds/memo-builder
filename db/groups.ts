import { PrismaClient } from '@prisma/client'
import { map, objOf, pipe } from 'ramda'
import type { IHasID } from '~/core/id/types'

const prisma = new PrismaClient()

interface IGroup {
  name: string
}

interface ICreateGroupParams extends IGroup {
  userId: number
}

export const getGroups = async (where: Partial<IGroup> & IHasID) =>
  await prisma.group.findMany({
    where,
    select: {
      id: true,
      name: true,
    },
  })

export const getGroup = async (where: IGroup & IHasID) =>
  await prisma.group.findUniqueOrThrow({ where })

export const createGroup = async (data: ICreateGroupParams) =>
  await prisma.group.create({ data })

export const deleteGroups = async (data: number[]) =>
  await pipe(
    map((id: number) => ({ id })),
    objOf('OR'),
    objOf('where'),
    prisma.group.deleteMany,
  )(data)

export const getOrCreateGroup = async (params: ICreateGroupParams & IHasID) => {
  try {
    return await getGroup(params)
  } catch (e) {
    return await createGroup(params)
  }
}
