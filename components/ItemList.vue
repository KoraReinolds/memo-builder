<template>
  <div class="flex justify-between">
    <div>
      <span>
        {{ name }}
      </span>
      <div
        v-for="item in items"
        :key="item.id"
        :class="{ 'bg-lime-500': selectedItems.some((id) => id === item.id) }"
        @click="$emit('selectItem', item.id)"
      >
        {{ item.data }} = {{ item.id }}= {{ selectedItems }}
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
    selectedItems: {
      type: Array as PropType<number[]>,
      required: true,
    },
    items: {
      type: Object as PropType<IItem[]>,
      required: true,
    },
  })

  const emits = defineEmits<{
    newItem: [name: string]
    selectItem: [id: number]
  }>()

  const newItem = ref('')

  function addNewItem() {
    emits('newItem', newItem.value)
    newItem.value = ''
  }
</script>
