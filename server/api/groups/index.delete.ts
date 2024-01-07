import { deleteGroups } from '~/db/groups'

export default defineEventHandler(async (event) => {
  const { groups } = await readBody(event)

  if (!Array.isArray(groups) || groups.some((id) => !Number.isInteger(+id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'groups data is not integer array or defined',
    })
  }

  return await deleteGroups(groups)
})
