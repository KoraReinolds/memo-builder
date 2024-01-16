import { getUserById } from '~/db/users'

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)

  if (!id || !Number.isInteger(+id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'id is not integer or defined',
    })
  }

  return await getUserById(+id)
})
