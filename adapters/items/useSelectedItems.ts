import type { IList } from '~/core/lists/types'

export type SelectedItemUI = Record<string, boolean>

export const useSelectedItems = (lists: Ref<IList[] | null>) => {
  const getSelectedInitialValue = (lists: IList[] | null) => {
    if (!lists) return {}
    return Object.fromEntries(lists.map((entry) => [entry.id, {}]))
  }

  const newSelectedItems = ref<Record<string, SelectedItemUI>>(
    getSelectedInitialValue(lists.value),
  )

  const clearSelected = () => {
    newSelectedItems.value = getSelectedInitialValue(lists.value)
  }

  const idsListToSelectedAdapter = (ids: number[] | string[]): SelectedItemUI =>
    Object.fromEntries(ids.map((id) => [id, true]))

  watch(
    () => lists.value,
    (lists) => {
      newSelectedItems.value = getSelectedInitialValue(lists)
    },
  )

  return { newSelectedItems, idsListToSelectedAdapter, clearSelected }
}
