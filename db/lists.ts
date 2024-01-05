import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getListsOfGroup(groupId: number) {
  const lists = await prisma.list.findMany({
    where: {
      groupId,
    },
  })

  return lists
}

type AddListParams = {
  groupId: number
  name: string
}

async function createList(data: AddListParams) {
  const list = await prisma.list.create({ data })

  return list
}

export { createList, getListsOfGroup }
