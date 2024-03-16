import { indexBy, prop } from 'ramda'
import type { IHasID } from '~/core/id/types'

export const toIdMap = <T extends IHasID>(arr: T[]): Record<string, T> =>
  indexBy(prop('id'), arr)
