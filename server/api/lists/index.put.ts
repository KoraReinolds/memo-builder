import { juxt, pipe } from 'ramda'
import { createList } from '~/db/lists'
import { getQueryGroupId, getQueryName } from '~/server/query'

export default defineEventHandler(
  async (event) =>
    await pipe(juxt([getQueryName, getQueryGroupId]), ([name, groupId]) =>
      createList({ name, groupId }),
    )(readBody(event)),
)
