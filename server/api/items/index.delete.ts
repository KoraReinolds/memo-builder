import { deleteItems } from '~/db/items'

export default defineEventHandler(async (event) => {
  const { items } = await readBody(event)

  if (!Array.isArray(items) || items.some((id) => !Number.isInteger(+id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'items data is not integer array or defined',
    })
  }

  return await deleteItems(items)
})
