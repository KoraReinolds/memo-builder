import { juxt, pipe } from 'ramda'
import { getOrCreateGroup } from '~/db/groups'
import { getQueryId, getQueryName, getQueryUserId } from '~/server/query'

export default defineEventHandler(async (event) => {
  return await pipe(
    juxt([getQueryId, getQueryName, getQueryUserId]),
    ([id, name, userId]) => ({ id, name, userId }),
    getOrCreateGroup,
  )(getQuery(event))
})
