import { juxt, pipe } from 'ramda'
import { getOrCreateUser } from '~/db/users'
import { getQueryEmail, getQueryId, getQueryName } from '~/server/query'

export default defineEventHandler(async (event) => {
  return await pipe(
    juxt([getQueryId, getQueryName, getQueryEmail]),
    ([id, name, email]) => ({ id, name, email }),
    getOrCreateUser,
  )(getQuery(event))
})
