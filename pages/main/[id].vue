<template>
  <GroupData
    v-if="openedGroup && openedItems"
    :list="openedGroup"
    :items="openedItems"
  />
</template>

<script setup lang="ts">
  import type { IItem, IList } from '~/interfaces/IGroup'

  const router = useRouter()
  const groupId = router.currentRoute.value.params.id
  const openedGroup = ref<IList[] | null>(
    groupId ? await getGroupById(+groupId) : null,
  )
  const openedItems = ref<IItem[] | null>(
    groupId ? await getItemsById(+groupId) : null,
  )

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
</script>
