import { pipe } from 'ramda'
import { getListsOfGroup } from '~/db/lists'
import { getQueryId } from '~/server/query'

export default defineEventHandler(
  async (event) => await pipe(getQueryId, getListsOfGroup)(getQuery(event)),
)
