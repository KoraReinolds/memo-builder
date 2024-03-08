import { PrismaClient } from '@prisma/client'
import { pipe } from 'ramda'
import { idsArrayDelete } from './lib'
import type { IHasID } from '~/core/id/types'

const prisma = new PrismaClient()

export interface IDBRelation {
  id: number
  relatedId: number
  chainId: number
}

export const getLink = async (where: IHasID): Promise<IDBRelation> =>
  await prisma.chainRelation.findUniqueOrThrow({ where })

export const getLinksByItems = async (ids: number[]): Promise<IDBRelation[]> =>
  await prisma.chainRelation.findMany({
    where: {
      OR: [
        {
          chainId: {
            in: ids,
          },
        },
        {
          relatedId: {
            in: ids,
          },
        },
      ],
    },
    select: {
      id: true,
      relatedId: true,
      chainId: true,
    },
  })

export const getLinksByGroupId = async (
  groupId: number,
): Promise<IDBRelation[]> =>
  (
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

export const createLinks = async (data: [number, number][]) =>
  await prisma.chainRelation.createMany({
    data: data.map((pair) => ({
      chainId: pair[0],
      relatedId: pair[1],
    })),
  })

export const deleteLinks = pipe(idsArrayDelete, prisma.chainRelation.deleteMany)
