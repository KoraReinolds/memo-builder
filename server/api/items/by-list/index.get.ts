import { objOf, pipe } from 'ramda'
import { getItems } from '~/db/items'
import { getQueryListId } from '~/server/query'

export default defineEventHandler(
  async (event) =>
    await pipe(getQueryListId, objOf('listId'), getItems)(getQuery(event)),
)
