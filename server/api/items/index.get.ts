import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function getItems() {
  const items = await prisma.item.findMany({
    include: {
      linkTo: {
        select: {
          relatedId: true,
        },
      },
    }
  })

  return items.map(item => ({
    ...item,
    linkTo: item.linkTo.map(rel => rel.relatedId)
  }))
}

export default defineEventHandler(async (event) => {
  return await getItems()
})
