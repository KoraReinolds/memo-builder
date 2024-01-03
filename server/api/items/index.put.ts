import { addNewItemToList } from '~/db/items'

export default defineEventHandler(async (event) => {
  const { data, listId } = await readBody(event)

  if (!data || !listId || !Number.isInteger(+listId)) {
    throw createError({
      statusCode: 400,
      statusMessage: !data
        ? 'data is required'
        : 'listId is not integer or defined',
    })
  }

  return await addNewItemToList({ data, listId })
})
