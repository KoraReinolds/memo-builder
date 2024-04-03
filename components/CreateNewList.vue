<template>
  <div>
    <UInput
      v-model="newListName"
      type="text"
    />
    <UButton @click="createNewList">Add List</UButton>
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
