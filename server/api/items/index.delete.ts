import { pipe } from 'ramda'
import { hideChains } from '~/db/chains'
import { getQueryIds } from '~/server/query'

export default defineEventHandler(
  async (event) => await pipe(getQueryIds, hideChains)(await readBody(event)),
)
