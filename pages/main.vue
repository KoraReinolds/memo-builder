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
  const groups = ref(await getGroups())
  const userId = 1

  async function getGroups() {
    const { data, error } = await useFetch(`/api/groups?id=${userId}`)

    if (error.value) {
      console.warn('GetGroups error')
    }

    return data.value
  }

  async function removeGroup(id: number) {
    console.log(id)
    const { error } = await useFetch('/api/groups', {
      method: 'delete',
      body: { groups: [id] },
    })

    if (error.value) {
      console.warn('removeGroup error')
    }

    groups.value = groups.value?.filter((group) => group.id !== id) || null
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

  function openGroup(id: number) {
    router.push({
      name: 'main-id',
      params: { id },
    })
  }
</script>
