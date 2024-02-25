import { objOf, pipe } from 'ramda'
import { getGroups } from '~/db/groups'
import { getQueryId } from '~/server/query'

export default defineEventHandler(
  async (event) =>
    await pipe(getQueryId, objOf('id'), getGroups)(getQuery(event)),
)
