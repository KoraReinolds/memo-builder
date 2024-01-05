import { getListsOfGroup } from '~/db/lists'

export default defineEventHandler(async (event) => {
  const { groupId } = getQuery(event)

  if (!groupId || !Number.isInteger(+groupId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'groupId is not integer or defined',
    })
  }

  return await getListsOfGroup(+groupId)
})
