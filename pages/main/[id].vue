<template>
  <GroupData
    v-if="openedGroup && openedItems && openedLinks"
    :list="openedGroup"
    :items="openedItems"
    :links="openedLinks"
    @new-item="addNewItem"
    @add-links="saveNewLinks"
    @delete-links="deleteLinks"
  />
</template>

<script setup lang="ts">
  import type { IItem, IList, Links } from '~/interfaces/IGroup'

  const router = useRouter()
  const groupId = router.currentRoute.value.params.id
  const openedGroup = ref<IList[] | null>(
    groupId ? await getGroupById(+groupId) : null,
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
    const { data, error } = await useFetch('/api/links', {
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
    const { data, error } = await useFetch('/api/links', {
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

  async function getGroupById(id: number) {
    const { data, error } = await useFetch(`/api/groups/${id}`)

    if (error.value) {
      console.warn('getGroupById error')
    }

    return data.value
  }

  async function getItemsById(id: number) {
    const { data, error } = await useFetch(`/api/items/${id}`)

    if (error.value) {
      console.warn('getItemsById error')
    }

    console.log(data.value)
    return data.value
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
