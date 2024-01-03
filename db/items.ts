import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getItemsOfGroup(groupId: number) {
  const items = await prisma.list.findMany({
    where: {
      groupId,
    },
    select: {
      items: {
        select: {
          id: true,
          data: true,
        },
      },
    },
  })

  return items.flatMap((entry) => entry.items)
}

export { getItemsOfGroup }
