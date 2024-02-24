import { PrismaClient } from '@prisma/client'
import type { IHasID } from '~/core/id/types'

const prisma = new PrismaClient()

interface IUser {
  name: string
  email: string
}

export const getUser = async (where: Partial<IUser> & IHasID) =>
  await prisma.user.findUniqueOrThrow({ where })

export const createUser = async (data: IUser) =>
  await prisma.user.create({ data })

export const getOrCreateUser = async (params: IUser & IHasID) => {
  try {
    return await getUser(params)
  } catch (e) {
    return await createUser(params)
  }
}
