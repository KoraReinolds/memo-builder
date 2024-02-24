import { juxt, pipe, zipObj } from 'ramda'
import { createUser } from '~/db/users'
import { getQueryEmail, getQueryName } from '~/server/query'

export default defineEventHandler(
  async (event) =>
    await pipe(
      juxt([getQueryName, getQueryEmail]),
      zipObj(['name', 'email']),
      createUser,
    )(readBody(event)),
)
