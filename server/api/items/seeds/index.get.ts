import { juxt, pipe } from 'ramda'
import { getOrCreateItem } from '~/db/items'
import { getQueryData, getQueryId, getQueryListId } from '~/server/query'

export default defineEventHandler(async (event) => {
  return await pipe(
    juxt([getQueryId, getQueryData, getQueryListId]),
    ([id, data, listId]) => ({ id, data, listId }),
    getOrCreateItem,
  )(getQuery(event))
})
