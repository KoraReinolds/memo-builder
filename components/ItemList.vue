<template>
  <div class="flex justify-between">
    <div>
      <span>
        {{ name }}
      </span>
      <div
        v-for="item in items"
        :key="item.id"
      >
        {{ item.data }}
      </div>
      <input
        v-model="newItem"
        type="text"
        placeholder="New Item"
      />
      <button @click="addNewItem">Add Item</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue'
  import type { IItem } from '~/interfaces/IGroup'

  defineProps({
    name: {
      type: String,
      required: true,
    },
    items: {
      type: Object as PropType<IItem[]>,
      required: true,
    },
  })

  const emits = defineEmits<{
    newItem: [name: string]
  }>()

  const newItem = ref('')

  function addNewItem() {
    emits('newItem', newItem.value)
    newItem.value = ''
  }
</script>
