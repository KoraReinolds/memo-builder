import type { IList } from '~/core/lists/types'

export const useSelectedItems = (lists: Ref<IList[] | null>) => {
  const getSelectedInitialValue = (lists: IList[] | null) => {
    if (!lists) return {}
    return Object.fromEntries(lists.map((entry) => [entry.id, {}]))
  }

  const selectedItems = ref<Record<string, Record<string, boolean>>>(
    getSelectedInitialValue(lists.value),
  )

  watch(
    () => lists.value,
    (lists) => {
      selectedItems.value = getSelectedInitialValue(lists)
    },
  )

  return { selectedItems }
}
