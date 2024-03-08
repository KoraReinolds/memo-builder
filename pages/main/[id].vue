<template>
  <GroupData
    v-if="openedLists && openedLinks"
    :list="openedLists"
    :links="openedLinks"
    @add-links="saveNewLinks"
    @delete-links="deleteLinks"
    @new-list="createNewList"
  >
    <template
      #items="{ linkModeSelected, selectItem, selectedItems, itemList }"
    >
      <ItemList
        v-if="linkModeSelected[itemList.id]"
        v-model="linkModeSelected[itemList.id]"
        :name="itemList.name"
        :selected-items="selectedItems"
        :list-id="itemList.id"
        @remove-list="removeList(itemList.id)"
        @select-item="selectItem"
      />
    </template>
  </GroupData>
</template>

<script setup lang="ts">
  import { useList } from '~/adapters/lists/useList'
  import type { Links } from '~/core/links/types'

  const router = useRouter()
  const groupId = +router.currentRoute.value.params.id

  const { lists: openedLists, createNewList, removeList } = useList(groupId)

  const links = ref<[number, number][]>([])
  // groupId ? await getLinksById(+groupId) : [],

  const openedLinks = computed(() => {
    const res: Links = new Map()
    const addEl = (key: number, val: number) => {
      const link = res.get(key)
      if (link) link.push(val)
      else res.set(key, [val])
    }
    links.value.forEach(([first, second]) => {
      addEl(first, second)
      addEl(second, first)
    })
    return res
  })

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
