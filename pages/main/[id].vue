<template>
  <button @click="saveChanges">Save</button>
  <div class="flex justify-between">
    <div
      v-for="itemList in lists"
      :key="itemList.id"
    >
      <ItemData
        v-if="newSelectedItems[itemList.id]"
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
    :items="items"
    :links="links"
    :config="memoSettings"
  ></Memo>
</template>

<script setup lang="ts">
  import { useItem } from '~/adapters/items/useItem'
  import {
    useSelectedItems,
    type SelectedItemUI,
  } from '~/adapters/items/useSelectedItems'
  import { useRelation } from '~/adapters/links/useRelation'
  import { useList } from '~/adapters/lists/useList'
  import type { IMemoConfig } from '~/core/memo/types'

  const router = useRouter()
  const groupId = +router.currentRoute.value.params.id

  const { items } = useItem()

  const { lists, createNewList, removeList } = useList(groupId)

  const { links, getNewLinks, getRemovedLinks, createLinks, removeLinks } =
    useRelation(groupId)

  const listsKeys = computed(() => Object.keys(lists.value || {}))

  const memoSettings: IMemoConfig = {
    associations: { count: 5, listId: +listsKeys.value[2] },
    suggestions: {
      count: { min: 1, max: 2 },
      listId: +listsKeys.value[1],
      totalCount: 4,
    },
  }

  const {
    newSelectedIds,
    newSelectedItems,
    idsListToSelectedAdapter,
    clearSelected,
  } = useSelectedItems(lists)

  const selectedItemId = ref<number | null>(null)

  const associatedLinks = computed(
    () => links.value[`${selectedItemId.value}`] || [],
  )

  const selectedItems = computed<SelectedItemUI>(() =>
    idsListToSelectedAdapter(associatedLinks.value),
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

  const saveChanges = () => {
    if (!selectedItemId.value) return

    const removedLinks = getRemovedLinks(
      associatedLinks.value,
      newSelectedIds.value,
    )

    const newLinks = getNewLinks(newSelectedIds.value, associatedLinks.value)

    const idToPairs = (rootId: number, listId: number[]) => {
      const linksPairs: [number, number][] = []
      listId
        .filter((id) => id !== rootId)
        .forEach((id) => {
          linksPairs.push([id, rootId])
        })
      return linksPairs
    }

    const newLinksPairs = idToPairs(selectedItemId.value, newLinks)
    if (newLinksPairs.length) createLinks(newLinksPairs)

    const deletedLinksPairs = idToPairs(selectedItemId.value, removedLinks)
    if (deletedLinksPairs.length) removeLinks(deletedLinksPairs)

    cancelSeleting()
  }
</script>
