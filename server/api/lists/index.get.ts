import { objOf, pipe } from 'ramda'
import { getList } from '~/db/lists'
import { getQueryId } from '~/server/query'

export default defineEventHandler(
  async (event) =>
    await pipe(getQueryId, objOf('id'), getList)(getQuery(event)),
)
