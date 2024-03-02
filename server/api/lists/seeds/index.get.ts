import { juxt, pipe } from 'ramda'
import { getOrCreateList } from '~/db/lists'
import { getQueryGroupId, getQueryId, getQueryName } from '~/server/query'

export default defineEventHandler(async (event) => {
  return await pipe(
    juxt([getQueryId, getQueryName, getQueryGroupId]),
    ([id, name, groupId]) => ({ id, name, groupId }),
    getOrCreateList,
  )(getQuery(event))
})
