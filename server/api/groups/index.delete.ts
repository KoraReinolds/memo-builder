import { pipe } from 'ramda'
import { deleteGroups } from '~/db/groups'
import { getQueryIds } from '~/server/query'

export default defineEventHandler(
  async (event) => await pipe(getQueryIds, deleteGroups)(readBody(event)),
)
