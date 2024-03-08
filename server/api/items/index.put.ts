import { juxt, pipe } from 'ramda'
import { createItem } from '~/db/items'
import { getQueryData, getQueryListId } from '~/server/query'

export default defineEventHandler(
  async (event) =>
    await pipe(juxt([getQueryData, getQueryListId]), ([data, listId]) =>
      createItem({ data, listId }),
    )(await readBody(event)),
)
