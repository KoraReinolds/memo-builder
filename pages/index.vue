<template>
  <div
    v-for="group in groups"
    :key="group.id"
  >
    {{ group.name }}
  </div>
  <div>
    <input
      v-model="newName"
      type="text"
    > 
    <button @click="createNewGroup(newName)">Create</button>
  </div>
</template>

<script setup lang="ts">
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

  async function createNewGroup(name: string) {
    const { error } = await useFetch(
      '/api/groups',
      {
        method: 'put',
        body: { name },
        pick: ['name', 'id'],
      }
    )

    if (error.value) {
      console.warn('createNewGroup error')
    }

    groups.value = await getGroups()
    newName.value = ''
  }

</script>
