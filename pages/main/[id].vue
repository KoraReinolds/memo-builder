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
  <div>
    {{ newSelectedItems }}
  </div>
  <div>
    {{ selectedItems }}
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

  const { links, getNewLinks, getRemovedLinks } = useRelation(groupId)

  const {
    newSelectedIds,
    newSelectedItems,
    idsListToSelectedAdapter,
    clearSelected,
  } = useSelectedItems(lists)

  const selectedItemId = ref<number | null>(null)

  const associatedLinks = computed(
    () => links.value?.get(selectedItemId.value || -1) || [],
  )

  const selectedItems = computed<SelectedItemUI>(() =>
    idsListToSelectedAdapter(associatedLinks.value),
  )

  const mode = ref<'default' | 'links'>('default')

  const selectItem = (itemId: number) => {
    if (itemId === selectedItemId.value) {
      mode.value = 'default'
    } else if (selectedItemId.value === null) {
      mode.value = 'links'
      selectedItemId.value = itemId
    } else {
      //  change links
    }
  }
  const finishLinksMode = () => {
    clearSelected()
    selectedItemId.value = null
  }

  watch(mode, (_, oldValue) => {
    if (oldValue === 'links') {
      finishLinksMode()
    }
  })

  const saveChanges = () => {
    if (!selectedItemId.value) return

    const removedLinks = getRemovedLinks(
      associatedLinks.value,
      newSelectedIds.value,
    )

    const newLinks = getNewLinks(newSelectedIds.value, associatedLinks.value)

    const idToPairs = (rootId: number, listId: number[]) => {
      const linksPairs: [number, number][] = []
      listId.forEach((id) => {
        linksPairs.push([id, rootId])
        linksPairs.push([rootId, id])
      })
      return linksPairs
    }

    const newLinksPairs = idToPairs(selectedItemId.value, newLinks)
    if (newLinksPairs.length) saveNewLinks(newLinksPairs)

    const deletedLinksPairs = idToPairs(selectedItemId.value, removedLinks)
    if (deletedLinksPairs.length) deleteLinks(deletedLinksPairs)

    mode.value = 'default'
  }

  async function deleteLinks(deletedLinks: [number, number][]) {
    const { error } = await useFetch('/api/links', {
      method: 'delete',
      body: {
        links: deletedLinks,
      },
    })

    if (error.value) {
      console.warn('deleteLinks error')
    }

    links.value = links.value.filter(
      (linkPair) =>
        deletedLinks.find(
          (deletedLinkPair) =>
            linkPair.toString() === deletedLinkPair.toString(),
        ) === undefined,
    )
  }

  async function saveNewLinks(newLinks: [number, number][]) {
    const { error } = await useFetch('/api/links', {
      method: 'put',
      body: {
        links: newLinks,
      },
    })

    if (error.value) {
      console.warn(`${saveNewLinks.name} error`, error.value)
    }

    newLinks.forEach((newLinkPair) => links.value.push(newLinkPair))
  }
</script>
