import { pipe } from 'ramda'
import { getLinksByItems } from '~/db/relations'
import { getQueryIds } from '~/server/query'

export default defineEventHandler(
  async (event) => await pipe(getQueryIds, getLinksByItems)(getQuery(event)),
)
