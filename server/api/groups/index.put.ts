import { juxt, pipe } from 'ramda'
import { createGroup } from '~/db/groups'
import { getQueryName, getQueryUserId } from '~/server/query'

export default defineEventHandler(
  async (event) =>
    await pipe(juxt([getQueryName, getQueryUserId]), ([name, userId]) =>
      createGroup({ name, userId }),
    )(readBody(event)),
)
