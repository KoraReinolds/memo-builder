<template>
  <UButton @click="saveChanges">Save</UButton>

  <my-widget
    v-if="memoSettings"
    class="mx-auto flex max-w-lg items-center justify-center"
    :items="items"
    :links="links"
    :config="memoSettings"
  ></my-widget>

  <hr />

  <div class="flex justify-between">
    <div
      v-for="itemList in lists"
      :key="itemList.id"
    >
      <ItemData
        v-model="newSelectedItems[itemList.id]"
        :name="itemList.name"
        :items="items"
        :selected-items="selectedItems"
        :list-id="itemList.id"
        @remove-list="removeList(itemList.id)"
        @select-item="selectItem"
        @new-item="createNewItem(itemList.id, $event)"
        @remove-item="removeItem"
      />
    </div>
    <CreateNewList @new-list="createNewList" />
  </div>
</template>

<script setup lang="ts">
  import { Widget } from 'memo-widget'
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
  import { db } from '~/local-storage/db'
  import { ItemsRepo } from '~/local-storage/repository/items'
  import { useItem } from '~/adapters/items/useItem'

  if (!customElements.get('my-widget'))
    customElements.define('my-widget', Widget)

  const router = useRouter()
  const groupId = +router.currentRoute.value.params.id

  const repo = new ItemsRepo(db)

  const itemsIdMap = computed(() => toIdMap(items.value))

  const { lists, createNewList, removeList } = useList(groupId)

  const { links, getNewLinks, getRemovedLinks, createLinks, removeLinks } =
    useRelation(groupId)

  const { items, createNewItem, removeItem, getItemsByGroupId } = useItem()

  items.value = (await getItemsByGroupId(groupId)) || []

  watch(
    () => items.value,
    () => repo.sync(groupId, items.value),
    { immediate: true },
  )

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
