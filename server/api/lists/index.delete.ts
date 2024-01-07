import { deleteLists } from '~/db/lists'

export default defineEventHandler(async (event) => {
  const { lists } = await readBody(event)

  if (!Array.isArray(lists) || lists.some((id) => !Number.isInteger(+id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'lists data is not integer array or defined',
    })
  }

  return await deleteLists(lists)
})
