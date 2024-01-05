import { createList } from '~/db/lists'

export default defineEventHandler(async (event) => {
  const { groupId, name } = await readBody(event)

  if (!name || typeof name !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'name is required',
    })
  }

  if (!groupId || !Number.isInteger(+groupId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'groupId is not integer or defined',
    })
  }

  return await createList({ name, groupId: +groupId })
})
