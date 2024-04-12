import type { IItem } from '~/core/items/types'

export const useItem = () => {
  const items = ref<IItem[]>([])

  const getItemsByGroupId = async (groupId: number) => {
    const { data, error } = await useFetch(
      `/api/items/by-group?groupId=${groupId}`,
    )

    if (error.value) {
      console.warn(`${getItemsByGroupId.name} error`, error.value)
    }

    return data.value
  }

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

  const removeItemById = (id: number) => {
    if (items.value) items.value = items.value.filter((item) => item.id !== id)
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

  const removeItem = async (id: number) => {
    const { error } = await useFetch('/api/items', {
      method: 'delete',
      body: { ids: [id] },
    })

    if (error.value) {
      console.warn(`${removeItem.name} error`, error.value)
    }

    removeItemById(id)
  }

  return {
    items,
    getItemsByListId,
    getItemsByGroupId,
    addItem,
    removeItemById,
    createNewItem,
    removeItem,
  }
}
