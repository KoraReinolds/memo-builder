<template>
  <div class="flex justify-between">
    <div>
      <div>
        <span>
          {{ name }}
        </span>
        <UButton @click="$emit('removeList')">Del</UButton>
      </div>
      <div
        v-for="item in listItems"
        :key="item.id"
        :class="{ 'bg-lime-500': isHighlight(item.id) }"
      >
        <label :for="`item-data-${item.id}`">
          {{ item.id }}
          <ResizedInput v-model="item.data" />
        </label>
        <UInput
          :id="`item-data-${item.id}`"
          v-model="selected[item.id]"
          type="checkbox"
          @change="$emit('selectItem', item.id)"
        />
        <UButton @click="removeItem(item.id)">Del</UButton>
      </div>
      <UInput
        v-model="newItem"
        type="text"
        placeholder="New Item"
      />
      <UButton @click="addNewItem">Add Item</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue'
  import { useItemStore } from '~/adapters/items/useItemStore'
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

  const { items, createNewItem, removeItem, getItemsByListId } = useItemStore()

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
~/adapters/items/useItemStore
