<template>
  <GroupData
    v-if="openedGroup && openedItems && openedLinks"
    :list="openedGroup"
    :items="openedItems"
    :links="openedLinks"
    @new-item="addNewItem"
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
  const openedLinks = ref<Links | null>(
    groupId ? await getLinksById(+groupId) : null,
  )

  async function getLinksById(id: number) {
    const { data, error } = await useFetch(`/api/links?groupId=${id}`)

    console.log(data.value, error.value)
    if (error.value) {
      console.warn('getLinksById error')
    }

    if (data.value) {
      const entries = data.value.map((entry) => [entry.itemId, entry.relatedId])
      const res: Links = new Map()
      const addEl = (key: number, val: number) => {
        const link = res.get(key)
        if (link) link.push(val)
        else res.set(key, [val])
      }
      entries.forEach(([first, second]) => {
        addEl(first, second)
        addEl(second, first)
      })
      console.log(res)
      return res
    }

    return null
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
