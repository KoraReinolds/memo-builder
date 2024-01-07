import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getGroupsByUserId(id: number) {
  const groups = await prisma.group.findMany({
    where: {
      userId: id,
    },
    select: {
      id: true,
      name: true,
    },
  })

  return groups
}

async function getGroupByName(name: string) {
  const group = await prisma.group.findFirst({
    where: {
      name,
    },
  })

  return group
}

type CreateGroupParams = {
  userId: number
  name: string
}

async function createGroup(data: CreateGroupParams) {
  const group = await prisma.group.create({ data })

  return group
}

async function deleteGroups(data: number[]) {
  const count = await prisma.group.deleteMany({
    where: {
      OR: data.map((id) => ({ id })),
    },
  })

  return count
}

export { getGroupsByUserId, createGroup, getGroupByName, deleteGroups }
