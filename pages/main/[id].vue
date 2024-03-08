<template>
  <GroupData
    v-if="openedLists && openedItems && openedLinks"
    :list="openedLists"
    :items="openedItems"
    :links="openedLinks"
    @add-links="saveNewLinks"
    @delete-links="deleteLinks"
    @new-list="addNewList"
  >
    <template
      #items="{
        linkModeSelected,
        selectItem,
        selectedItems,
        filteredItems,
        itemList,
      }"
    >
      <ItemList
        v-if="linkModeSelected[itemList.id]"
        v-model="linkModeSelected[itemList.id]"
        :name="itemList.name"
        :items="filteredItems(openedItems, itemList.id)"
        :selected-items="selectedItems"
        @new-item="(name) => addNewItem(itemList.id, name)"
        @remove-list="removeList(itemList.id)"
        @select-item="selectItem"
        @remove-item="removeItem"
      />
    </template>
  </GroupData>
</template>

<script setup lang="ts">
  import { useList } from '~/adapters/lists/useList'
  import type { IItem } from '~/core/items/types'
  import type { Links } from '~/core/links/types'

  const router = useRouter()
  const groupId = +router.currentRoute.value.params.id

  const { lists: openedLists } = useList(groupId)




  const openedLists = ref<IList[] | null>(
    groupId ? await getListsByGroupId(+groupId) : null,
  )
  const openedItems = ref<IItem[] | null>(
    groupId ? await getItemsById(+groupId) : null,
  )
  const links = ref<[number, number][]>(
    groupId ? await getLinksById(+groupId) : [],
  )

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
      console.warn('saveNewLinks error')
    }

    newLinks.forEach((newLinkPair) => links.value.push(newLinkPair))
  }

  async function getLinksById(id: number) {
    const { data, error } = await useFetch(`/api/links?groupId=${id}`)

    if (error.value) {
      console.warn('getLinksById error')
    }

    if (data.value) {
      const entries: [number, number][] = data.value.map((entry) => [
        entry.itemId,
        entry.relatedId,
      ])
      return entries
    }

    return []
  }

  async function getListsById(id: number) {
    const { data, error } = await useFetch(`/api/lists?groupId=${id}`)

    if (error.value) {
      console.warn('getListsById error')
    }

    return data.value
  }

  async function getItemsById(id: number) {
    const { data, error } = await useFetch(`/api/items/${id}`)

    if (error.value) {
      console.warn('getItemsById error')
    }

    return data.value
  }

  async function removeList(id: number) {
    const { error } = await useFetch('/api/lists', {
      method: 'delete',
      body: { lists: [id] },
    })

    if (error.value) {
      console.warn('removeList error')
    }

    openedLists.value =
      openedLists.value?.filter((list) => list.id !== id) || null
  }

  async function removeItem(id: number) {
    const { error } = await useFetch('/api/items', {
      method: 'delete',
      body: { items: [id] },
    })

    if (error.value) {
      console.warn('removeItem error')
    }

    openedItems.value =
      openedItems.value?.filter((item) => item.id !== id) || null
  }

  async function addNewList(name: string) {
    const { data: newList, error } = await useFetch('/api/lists', {
      method: 'put',
      body: { name, groupId },
    })

    if (error.value) {
      console.warn('addNewList error')
    }

    if (newList.value) {
      openedLists.value = [...(openedLists.value || []), newList.value]
    }
  }

  async function addNewItem(listId: number, data: string) {
    const { data: newItem, error } = await useFetch('/api/items', {
      method: 'put',
      body: { listId, data },
    })

    if (error.value) {
      console.warn('addNewItem error')
    }

    if (newItem.value) {
      openedItems.value?.push(newItem.value)
    }
  }
</script>
