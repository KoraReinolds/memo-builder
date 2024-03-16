import type { IItem } from '~/core/items/types'

export const fromTheSameList = (
  ids: number[],
  items: Record<string, IItem>,
) => {
  const listIds = ids.map((id) => items[id]?.listId)

  return listIds.length === new Set(listIds).size
}
