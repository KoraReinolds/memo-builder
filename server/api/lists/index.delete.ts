import { pipe } from 'ramda'
import { deleteLists } from '~/db/lists'
import { getQueryIds } from '~/server/query'

export default defineEventHandler(
  async (event) => await pipe(getQueryIds, deleteLists)(readBody(event)),
)
