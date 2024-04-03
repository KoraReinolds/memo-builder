<template>
  <div class="my-4 flex w-[200px] flex-col gap-2">
    <div class="flex w-full gap-2">
      <span
        class="w-full"
        v-text="name"
      />
      <UButton
        color="red"
        @click="$emit('removeList')"
        v-text="'Del'"
      />
    </div>

    <div
      v-for="item in listItems"
      :key="item.id"
      class="flex w-full gap-2"
    >
      <UCheckbox
        :model-value="isHighlight(item.id)"
        class="w-full"
        @update:model-value="selected[item.id] = !selected[item.id]"
        @change="$emit('selectItem', item.id)"
      >
        <template #label>
          <div class="flex gap-2">
            <span class="">{{ item.id }}</span>
            <span
              :class="{ 'bold italic text-green-500': isHighlight(item.id) }"
              >{{ item.data }}</span
            >
          </div>
        </template>
      </UCheckbox>
      <UButton
        color="red"
        @click="removeItem(item.id)"
        v-text="'Del'"
      />
    </div>
    <UInput
      v-model="newItem"
      type="text"
      placeholder="New Item"
    />
    <UButton
      @click="addNewItem"
      v-text="'Add Item'"
    />
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
    return !!(+props.selectedItems[id] ^ +selected.value[id])
  }

  const addNewItem = () => {
    createNewItem(props.listId, newItem.value)
    newItem.value = ''
  }
</script>
