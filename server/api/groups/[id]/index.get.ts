import { getListsOfGroup } from '~/db/lists'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id || !Number.isInteger(+id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'groupId is not integer or defined',
    })
  }

  return await getListsOfGroup(+id)
})
