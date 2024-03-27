<template>
  <button @click="saveChanges">Save</button>
  <div class="flex justify-between">
    <div
      v-for="itemList in lists"
      :key="itemList.id"
    >
      <ItemData
        v-model="newSelectedItems[itemList.id]"
        :name="itemList.name"
        :selected-items="selectedItems"
        :list-id="itemList.id"
        @remove-list="removeList(itemList.id)"
        @select-item="selectItem"
      />
    </div>
    <CreateNewList @new-list="createNewList" />
  </div>
  <hr />
  <Memo
    v-if="memoSettings"
    :items="items"
    :links="links"
    :config="memoSettings"
  ></Memo>
  <memo-widget />
</template>

<script setup lang="ts">
  import { MyVueElement } from 'memo-widget'
  import { useItemStore } from '~/adapters/items/useItemStore'
  import {
    useSelectedItems,
    type SelectedItemUI,
  } from '~/adapters/items/useSelectedItems'
  import { useRelation } from '~/adapters/links/useRelation'
  import { useList } from '~/adapters/lists/useList'
  import type { IMemoConfig } from '~/core/memo/types'
  import { fromTheSameList } from '~/useCases/items/fromTheSameList'
  import { toIdMap } from '~/useCases/lib/pairs'
  import { getAllPairs } from '~/useCases/links/allPairs'

  customElements.define('memo-widget', MyVueElement)

  const router = useRouter()
  const groupId = +router.currentRoute.value.params.id

  const { items } = useItemStore()

  const itemsIdMap = computed(() => toIdMap(items))

  const { lists, createNewList, removeList } = useList(groupId)

  const { links, getNewLinks, getRemovedLinks, createLinks, removeLinks } =
    useRelation(groupId)

  const memoSettings = computed<IMemoConfig | undefined>(() =>
    lists.value && lists.value.length > 1
      ? {
          associations: { count: 5, listId: lists.value?.[2].id || 0 },
          suggestions: {
            count: { min: 1, max: 2 },
            listId: lists.value?.[0].id || 0,
            totalCount: 4,
          },
        }
      : undefined,
  )

  const {
    newSelectedIds,
    newSelectedItems,
    idsListToSelectedAdapter,
    clearSelected,
  } = useSelectedItems(lists)

  const selectedItemId = ref<number | null>(null)

  const associatedIds = computed(
    () => links.value[`${selectedItemId.value}`] || [],
  )

  const selectedItems = computed<SelectedItemUI>(() =>
    idsListToSelectedAdapter(associatedIds.value),
  )

  const cancelSeleting = () => {
    clearSelected()
    selectedItemId.value = null
  }

  const selectItem = (itemId: number) => {
    if (itemId === selectedItemId.value) {
      cancelSeleting()
    } else if (selectedItemId.value === null) {
      selectedItemId.value = itemId
    } else {
      //  change links
    }
  }

  const saveNewLinks = () => {
    const newLinks = getNewLinks(newSelectedIds.value, associatedIds.value)

    const newPairs = getAllPairs(newLinks).filter((pair) =>
      fromTheSameList(pair, itemsIdMap.value),
    )

    if (newPairs.length) createLinks(newPairs)
  }

  const saveRemovedLinks = () => {
    if (!selectedItemId.value) return

    const removedLinks = getRemovedLinks(
      associatedIds.value,
      newSelectedIds.value,
    )
    removedLinks.push(selectedItemId.value)

    const deletedPairs = getAllPairs(removedLinks).filter((pair) =>
      fromTheSameList(pair, itemsIdMap.value),
    )
    if (deletedPairs.length) removeLinks(deletedPairs)
  }

  const saveChanges = () => {
    if (!selectedItemId.value) return

    saveNewLinks()
    saveRemovedLinks()
    cancelSeleting()
  }
</script>
