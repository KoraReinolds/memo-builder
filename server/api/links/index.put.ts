import { pipe } from 'ramda'
import { createLinks } from '~/db/relations'
import { getQueryLinks } from '~/server/query'

export default defineEventHandler(
  async (event) =>
    await pipe(getQueryLinks, createLinks)(await readBody(event)),
)
