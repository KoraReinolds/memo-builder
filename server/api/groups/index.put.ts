import { createGroup } from '~/db/groups'

export default defineEventHandler(async (event) => {
  const { name } = await readBody(event)

  if (!name || typeof name !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'name is required',
    })
  }

  const userId = 1

  return await createGroup({ name, userId })
})
