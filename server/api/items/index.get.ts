import { objOf, pipe } from 'ramda'
import { getItem } from '~/db/items'
import { getQueryId } from '~/server/query'

export default defineEventHandler(
  async (event) =>
    await pipe(getQueryId, objOf('id'), getItem)(getQuery(event)),
)
