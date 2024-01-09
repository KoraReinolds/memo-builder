<template>
  <div class="flex justify-between">
    <div>
      <div>
        <span>
          {{ name }}
        </span>
        <button @click="$emit('removeList')">Del</button>
      </div>
      <div
        v-for="item in items"
        :key="item.id"
        :class="{ 'bg-lime-500': isHighlight(item.id) }"
      >
        <label :for="`${item.id}`">
          <ResizedInput v-model="item.data" />
        </label>
        <input
          :id="`${item.id}`"
          v-model="selected[item.id]"
          type="checkbox"
          @change="$emit('selectItem', item.id)"
        />
        <button @click="$emit('removeItem', item.id)">Del</button>
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

  const props = defineProps({
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
    modelValue: {
      type: Object as PropType<Record<string, boolean>>,
      required: true,
    },
  })

  const emits = defineEmits<{
    newItem: [name: string]
    removeItem: [id: number]
    removeList: []
    selectItem: [id: number]
    'update:modelValue': [selected: Record<string, boolean>]
  }>()

  const selected = computed({
    get() {
      return props.modelValue
    },
    set(value) {
      emits('update:modelValue', value)
    },
  })

  const newItem = ref('')

  function isHighlight(id: number) {
    return +props.selectedItems.includes(id) ^ +selected.value[id]
  }

  function addNewItem() {
    emits('newItem', newItem.value)
    newItem.value = ''
  }
</script>
