import { getLinks } from '~/db/relations'

export default defineEventHandler(async (event) => {
  const { groupId } = getQuery(event)

  if (!groupId || !Number.isInteger(+groupId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'groupId is required',
    })
  }

  return await getLinks(+groupId)
})
