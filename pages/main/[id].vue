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
</template>

<script setup lang="ts">
  import {
    useSelectedItems,
    type SelectedItemUI,
  } from '~/adapters/items/useSelectedItems'
  import { useRelation } from '~/adapters/links/useRelation'
  import { useList } from '~/adapters/lists/useList'

  const router = useRouter()
  const groupId = +router.currentRoute.value.params.id

  const { lists, createNewList, removeList } = useList(groupId)

  const { links, getNewLinks, getRemovedLinks, createLinks, removeLinks } =
    useRelation(groupId)

  const {
    newSelectedIds,
    newSelectedItems,
    idsListToSelectedAdapter,
    clearSelected,
  } = useSelectedItems(lists)

  const selectedItemId = ref<number | null>(null)

  const associatedLinks = computed(() => [
    ...(links.value?.get(selectedItemId.value || -1) || []),
  ])

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
