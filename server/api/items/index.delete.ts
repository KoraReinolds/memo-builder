import { pipe } from 'ramda'
import { deleteItems } from '~/db/items'
import { getQueryIds } from '~/server/query'

export default defineEventHandler(
  async (event) => await pipe(getQueryIds, deleteItems)(readBody(event)),
)
