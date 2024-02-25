import { objOf, pipe } from 'ramda'
import { createItem } from '~/db/items'
import { getQueryData } from '~/server/query'

export default defineEventHandler(
  async (event) =>
    await pipe(getQueryData, objOf('data'), createItem)(readBody(event)),
)
