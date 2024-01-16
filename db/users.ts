import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getUserById(id: number) {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  })

  return user
}

type newUserParams = {
  name: string
  email: string
}

async function createUser(data: newUserParams) {
  const user = await prisma.user.create({ data })

  return user
}

export { createUser, getUserById }
