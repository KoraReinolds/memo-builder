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
        v-for="item in listItems"
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
        <button @click="removeItem(item.id)">Del</button>
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
  import { useItem } from '~/adapters/items/useItem'
  import type { SelectedItemUI } from '~/adapters/items/useSelectedItems'

  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
    selectedItems: {
      type: Object as PropType<SelectedItemUI>,
      required: true,
    },
    modelValue: {
      type: Object as PropType<Record<string, boolean>>,
      required: true,
    },
    listId: {
      type: Number,
      required: true,
    },
  })

  const emits = defineEmits<{
    newItem: [name: string]
    removeList: []
    selectItem: [id: number]
    'update:modelValue': [selected: Record<string, boolean>]
  }>()

  const { items, createNewItem, removeItem, getItemsByListId } = useItem()

  getItemsByListId(props.listId)

  const listItems = computed(() =>
    items.filter(({ listId }) => listId === props.listId),
  )

  const selected = computed({
    get() {
      return props.modelValue
    },
    set(value) {
      emits('update:modelValue', value)
    },
  })

  const newItem = ref('')

  const isHighlight = (id: number) => {
    return +props.selectedItems[id] ^ +selected.value[id]
  }

  const addNewItem = () => {
    createNewItem(props.listId, newItem.value)
    newItem.value = ''
  }
</script>
