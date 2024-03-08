import type { IList } from '~/core/lists/types'

export const useList = (groupId: number) => {
  const getListsByGroupId = async (id: number) => {
    const { data, error } = await useFetch(`/api/lists/by-group?id=${id}`)

    if (error.value) {
      console.warn(`${getListsByGroupId.name} error`, error.value)
    }

    return data.value
  }

  const lists = ref<IList[] | null>(null)

  getListsByGroupId(groupId).then((res) => (lists.value = res))

  return {
    lists,
  }
}
