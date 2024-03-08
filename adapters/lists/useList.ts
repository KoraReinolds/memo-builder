import type { IList } from '~/core/lists/types'

export const useList = (groupId: number) => {
  const lists = ref<IList[] | null>(null)

  const addList = (list: IList | null) => {
    if (list && lists.value) lists.value.push(list)
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

  getListsByGroupId(groupId).then((res) => (lists.value = res))

  return {
    lists,
    createNewList,
  }
}
