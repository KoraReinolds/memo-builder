import { pipe } from 'ramda'
import { getUserById } from '~/db/users'
import { getQueryId } from '~/server/validation'

export default defineEventHandler(async (event) => {
  return await pipe(getQueryId, getUserById)(getQuery(event))
})
