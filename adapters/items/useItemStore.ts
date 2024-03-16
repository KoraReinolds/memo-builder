import type { IItem } from '~/core/items/types'

export const useItemStore = defineStore('items', () => {
  const items = ref<IItem[]>([])

  const getItemsByListId = async (listId: number) => {
    const { data, error } = await useFetch(
      `/api/items/by-list?listId=${listId}`,
    )

    if (error.value) {
      console.warn(`${getItemsByListId.name} error`, error.value)
    }

    const newItems = (data.value || []).map((item) => ({ ...item, listId }))
    newItems.forEach((item) => items.value.push(item))
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
    addItem,
    removeItemById,
    createNewItem,
    removeItem,
  }
})
