import { map, objOf, pipe } from 'ramda'

export const idsArrayDelete = pipe(
  map((id: number) => ({ id })),
  objOf('OR'),
  objOf('where'),
)
