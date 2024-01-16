import { createUser } from '~/db/users'

export default defineEventHandler(async (event) => {
  const { name, email } = await readBody(event)

  if (!name || typeof name !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'name is required',
    })
  }

  if (!email || typeof name !== 'string' || !name.includes('@')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'email is not valid',
    })
  }

  return await createUser({ name, email })
})
