<template>
  <GroupList
    v-if="groups"
    :groups="groups"
    @open="openGroup"
    @remove="removeGroup"
  />
  <div>
    <input
      v-model="newName"
      type="text"
    />
    <button @click="createNewGroup(newName)">Create</button>
  </div>
  <NuxtPage />
</template>

<script setup lang="ts">
  const router = useRouter()
  const newName = ref('')
  const userId = 1

  const getGroups = async () => {
    const { data, error } = await useFetch(
      `/api/groups/by-user?userid=${userId}`,
    )

    if (error.value) {
      console.warn('GetGroups error', error.value)
    }

    return data.value
  }

  const groups = ref(await getGroups())

  const removeGroup = async (id: number) => {
    const { error } = await useFetch('/api/groups', {
      method: 'delete',
      body: { ids: [id] },
    })

    if (error.value) {
      console.warn('removeGroup error', error.value)
    }

    groups.value = groups.value?.filter((group) => group.id !== id) || null
  }

  const createNewGroup = async (name: string) => {
    const { error } = await useFetch('/api/groups', {
      method: 'put',
      body: { name, userId },
      pick: ['name', 'id'],
    })

    if (error.value) {
      console.warn('createNewGroup error', error.value)
    }

    groups.value = await getGroups()
    newName.value = ''
  }

  const openGroup = (id: number) => {
    router.push({
      name: 'main-id',
      params: { id },
    })
  }
</script>
