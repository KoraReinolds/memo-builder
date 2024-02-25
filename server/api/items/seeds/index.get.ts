import { juxt, pipe } from 'ramda'
import { getOrCreateItem } from '~/db/items'
import { getQueryData, getQueryId } from '~/server/query'

export default defineEventHandler(async (event) => {
  return await pipe(
    juxt([getQueryId, getQueryData]),
    ([id, data]) => ({ id, data }),
    getOrCreateItem,
  )(getQuery(event))
})
