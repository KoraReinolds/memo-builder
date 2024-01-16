import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type newUserParams = {
  name: string
  email: string
}

async function createUser(data: newUserParams) {
  const user = await prisma.user.create({ data })

  return user
}

export { createUser }
