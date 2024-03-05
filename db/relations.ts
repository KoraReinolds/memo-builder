import { PrismaClient } from '@prisma/client'
import { pipe } from 'ramda'
import { idsArrayDelete } from './lib'
import type { IHasID } from '~/core/id/types'

const prisma = new PrismaClient()

export const getLink = async (where: IHasID) =>
  await prisma.chainRelation.findUniqueOrThrow({ where })

export const getLinks = async (groupId: number) => {
  return (
    await prisma.group.findMany({
      where: {
        id: groupId,
      },
      include: {
        list: {
          include: {
            chains: {
              select: {
                linkTo: {
                  select: {
                    id: true,
                    chainId: true,
                    relatedId: true,
                  },
                },
              },
            },
          },
        },
      },
    })
  )
    .flatMap(({ list }) => list)
    .flatMap(({ chains }) => chains)
    .flatMap(({ linkTo }) => linkTo)
}

export const createLinks = async (data: [number, number][]) =>
  await prisma.chainRelation.createMany({
    data: data.map((pair) => ({
      chainId: pair[0],
      relatedId: pair[1],
    })),
  })

export const deleteLinks = pipe(idsArrayDelete, prisma.chainRelation.deleteMany)
