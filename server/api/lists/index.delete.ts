import { pipe } from 'ramda'
import { hideLists } from '~/db/lists'
import { getQueryIds } from '~/server/query'

export default defineEventHandler(
  async (event) => await pipe(getQueryIds, hideLists)(await readBody(event)),
)
