import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function getGroupsByUserId(id: number) {
  const groups = await prisma.group.findMany({
    where: {
      userId: id,
    },
    select: {
      id: true,
      name: true,
    }
  })

  return groups
}

export { getGroupsByUserId }