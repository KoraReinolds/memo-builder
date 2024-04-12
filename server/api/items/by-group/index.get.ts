import { objOf, pipe } from 'ramda'
import { getItemsByGroupId } from '~/db/items'
import { getQueryGroupId } from '~/server/query'

export default defineEventHandler(
  async (event) =>
    await pipe(
      getQueryGroupId,
      objOf('groupId'),
      getItemsByGroupId,
    )(getQuery(event)),
)
