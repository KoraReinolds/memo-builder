import { pipe } from 'ramda'
import { hideGroups } from '~/db/groups'
import { getQueryIds } from '~/server/query'

export default defineEventHandler(async (event) =>
  pipe(getQueryIds, hideGroups)(await readBody(event)),
)
