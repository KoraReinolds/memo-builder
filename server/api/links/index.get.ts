import { pipe } from 'ramda'
import { getLinks } from '~/db/relations'
import { getQueryId } from '~/server/query'

export default defineEventHandler(
  async (event) => await pipe(getQueryId, getLinks)(getQuery(event)),
)
