import { getGroupsByUserId } from "~/db/groups"

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)

  if (!id || !Number.isInteger(+id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'id is required',
    })
  }

  return await getGroupsByUserId(+id)

})
