import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getListsOfGroup(groupId: number) {
  const lists = await prisma.list.findMany({
    where: {
      groupId,
    },
    select: {
      id: true,
      name: true,
    },
  })

  return lists
}

export { getListsOfGroup }
