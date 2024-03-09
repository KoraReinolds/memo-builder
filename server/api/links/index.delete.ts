import { pipe } from 'ramda'
import { hideLinks } from '~/db/relations'
import { getQueryLinks } from '~/server/query'

export default defineEventHandler(
  async (event) => await pipe(getQueryLinks, hideLinks)(await readBody(event)),
)
