<template>
  <GroupList
    v-if="groups"
    :groups="groups"
    @open="openGroup"
  />
  <div>
    <input
      v-model="newName"
      type="text"
    />
    <button @click="createNewGroup(newName)">Create</button>
  </div>
  <NuxtPage
    v-if="openedGroup && openedItems"
    :list="openedGroup"
    :items="openedItems"
  />
</template>

<script setup lang="ts">
  import type { IItem, IList } from '~/interfaces/IGroup'

  const router = useRouter()
  const newName = ref('')
  const groups = ref(await getGroups())
  const groupId = router.currentRoute.value.params.id
  const openedGroup = ref<IList[] | null>(
    groupId ? await getGroupById(+groupId) : null,
  )
  const openedItems = ref<IItem[] | null>(
    groupId ? await getItemsById(+groupId) : null,
  )
  const userId = 1

  async function getGroups() {
    const { data, error } = await useFetch(`/api/groups?id=${userId}`)

    if (error.value) {
      console.warn('GetGroups error')
    }

    return data.value
  }

  async function createNewGroup(name: string) {
    const { error } = await useFetch('/api/groups', {
      method: 'put',
      body: { name },
      pick: ['name', 'id'],
    })

    if (error.value) {
      console.warn('createNewGroup error')
    }

    groups.value = await getGroups()
    newName.value = ''
  }

  async function openGroup(id: number) {
    openedGroup.value = await getGroupById(id)
    openedItems.value = await getItemsById(id)
  }

  async function getGroupById(id: number) {
    const { data, error } = await useFetch(`/api/groups/${id}`)

    if (error.value) {
      console.warn('getGroupById error')
    }

    router.push({
      name: 'main-id',
      params: { id },
    })

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
