import { objOf, pipe } from 'ramda'
import { getLink } from '~/db/relations'
import { getQueryId } from '~/server/query'

export default defineEventHandler(
  async (event) =>
    await pipe(getQueryId, objOf('id'), getLink)(getQuery(event)),
)
