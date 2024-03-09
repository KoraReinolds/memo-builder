<template>
  <div>
    <input
      v-model="newListName"
      type="text"
    />
    <button @click="createNewList">Add List</button>
  </div>
</template>

<script setup lang="ts">
  const emits = defineEmits<{
    newList: [name: string]
  }>()

  const newListName = ref()

  const createNewList = () => {
    emits('newList', newListName.value)
    newListName.value = ''
  }
</script>
