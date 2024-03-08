import { pipe } from 'ramda'
import { getListsByGroupId } from '~/db/lists'
import { getQueryId } from '~/server/query'

export default defineEventHandler(
  async (event) => await pipe(getQueryId, getListsByGroupId)(getQuery(event)),
)
