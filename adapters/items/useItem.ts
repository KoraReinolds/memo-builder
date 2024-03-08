import type { IItem } from '~/core/items/types'

export const useItem = (listId: number) => {
  const items = ref<IItem[] | null>(null)

  const getItemsByListId = async (listId: number) => {
    const { data, error } = await useFetch(
      `/api/items/by-list?listId=${listId}`,
    )

    if (error.value) {
      console.warn(`${getItemsByListId.name} error`, error.value)
    }

    return data.value
  }

  const addItem = (item: IItem | null) => {
    if (item && items.value) items.value.push(item)
  }

  const createNewItem = async (listId: number, data: string) => {
    const { data: newItems, error } = await useFetch('/api/items', {
      method: 'put',
      body: { listId, data },
    })

    if (error.value) {
      console.warn(`${createNewItem.name} error`, error.value)
    }

    addItem(newItems.value)
  }

  getItemsByListId(listId).then(
    (dbItems) =>
      (items.value = dbItems
        ? dbItems.map((item) => ({ ...item, listId }))
        : null),
  )

  return {
    items,
    createNewItem,
  }
}
