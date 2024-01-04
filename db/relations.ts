import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getLinks(groupId: number) {
  const links = await prisma.list.findMany({
    where: {
      groupId,
    },
    select: {
      items: {
        select: {
          linkTo: {
            select: {
              itemId: true,
              relatedId: true,
            },
          },
        },
      },
    },
  })

  const items = links.flatMap((entry) => entry.items)

  return items.flatMap((entry) => entry.linkTo)
}

export { getLinks }
