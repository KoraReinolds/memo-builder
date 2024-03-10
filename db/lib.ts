import { map, objOf, pipe } from 'ramda'
import type { ICountRange } from '~/core/memo/types'

export const idsArrayDelete = pipe(
  map((id: number) => ({ id })),
  objOf('OR'),
  objOf('where'),
)

export const getRandomValueFromRange = (range: ICountRange): number =>
  Math.round(Math.random() * (range.max - range.min) + range.min)
