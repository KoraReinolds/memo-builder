import { objOf, pipe } from 'ramda'
import { getUser } from '~/db/users'
import { getQueryId } from '~/server/query'

export default defineEventHandler(
  async (event) =>
    await pipe(getQueryId, objOf('id'), getUser)(getQuery(event)),
)
