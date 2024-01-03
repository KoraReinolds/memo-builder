import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getItemsOfGroup(groupId: number) {
  const items = await prisma.list.findMany({
    where: {
      groupId,
    },
    select: {
      items: true,
    },
  })

  return items.flatMap((entry) => entry.items)
}

type AddNewItemParams = {
  listId: number
  data: string
}

async function addNewItemToList(data: AddNewItemParams) {
  const item = await prisma.item.create({
    data,
  })

  return item
}

export { getItemsOfGroup, addNewItemToList }
