import { pipe } from 'ramda'
import { deleteGroups } from '~/db/groups'
import { getQueryGroups } from '~/server/query'

export default defineEventHandler(
  async (event) => await pipe(getQueryGroups, deleteGroups)(readBody(event)),
)
