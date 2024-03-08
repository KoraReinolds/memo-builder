import { pipe } from 'ramda'
import { getLinksByGroupId } from '~/db/relations'
import { getQueryGroupId } from '~/server/query'

export default defineEventHandler(
  async (event) =>
    await pipe(getQueryGroupId, getLinksByGroupId)(getQuery(event)),
)
