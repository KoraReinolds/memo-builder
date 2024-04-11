import type { IList } from '~/core/lists/types'
import { db } from '~/local-storage/db'
import { ListsRepo } from '~/local-storage/repository/lists'

const repo = new ListsRepo(db)

export const useList = (groupId: number) => {
  const lists = ref<IList[] | null>(null)

  watch(
    () => lists.value,
    (lists) => repo.sync(groupId, lists),
  )

  const addList = (list: IList | null) => {
    if (list && lists.value) lists.value.push(list)
  }

  const removeListById = (id: number) => {
    if (lists.value) lists.value = lists.value.filter((list) => list.id !== id)
  }

  const createNewList = async (name: string) => {
    const { data, error } = await useFetch('/api/lists', {
      method: 'put',
      body: { name, groupId },
    })

    if (error.value) {
      console.warn(`${createNewList.name} error`, error.value)
    }

    addList(data.value)
  }

  const getListsByGroupId = async (id: number) => {
    const { data, error } = await useFetch(`/api/lists/by-group?id=${id}`)

    if (error.value) {
      console.warn(`${getListsByGroupId.name} error`, error.value)
    }

    return data.value
  }

  const removeList = async (id: number) => {
    const { error } = await useFetch('/api/lists', {
      method: 'delete',
      body: { ids: [id] },
    })

    if (error.value) {
      console.warn(`${removeList.name} error`, error.value)
    }

    removeListById(id)
  }

  const mapToList = ({ id, name }: { id: number; name: string }) => ({
    id,
    name,
  })

  getListsByGroupId(groupId).then(
    (res) => (lists.value = res?.map(mapToList) || null),
  )

  return {
    lists,
    createNewList,
    removeList,
  }
}
