import { pipe } from 'ramda'
import { deleteLinks } from '~/db/relations'
import { getQueryIds } from '~/server/query'

export default defineEventHandler(
  async (event) => await pipe(getQueryIds, deleteLinks)(readBody(event)),
)
