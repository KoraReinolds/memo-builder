import { saveNewLinks } from '~/db/relations'

export default defineEventHandler(async (event) => {
  const { links } = await readBody(event)

  if (
    !Array.isArray(links) ||
    !links.every((link) => !Number.isInteger(+link))
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'links data is not integer array or defined',
    })
  }

  return await saveNewLinks(links)
})
