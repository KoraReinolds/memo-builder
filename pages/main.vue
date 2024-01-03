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
    v-if="openedGroup"
    :list="openedGroup"
  />
</template>

<script setup lang="ts">
  import type { IList } from '~/interfaces/IGroup'

  const newName = ref('')
  const groups = ref(await getGroups())
  const openedGroup = ref<IList[] | null>(null)
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
    const { data, error } = await useFetch(`/api/groups/${id}`)

    if (error.value) {
      console.warn('openGroup error')
    }

    const router = useRouter()
    router.push({
      name: 'main-id',
      params: { id },
    })

    openedGroup.value = data.value
  }
</script>
