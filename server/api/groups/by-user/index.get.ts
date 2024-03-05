import { objOf, pipe } from 'ramda'
import { getGroupsByUserId } from '~/db/groups'
import { getQueryUserId } from '~/server/query'

export default defineEventHandler(
  async (event) =>
    await pipe(getQueryUserId, objOf('id'), getGroupsByUserId)(getQuery(event)),
)
