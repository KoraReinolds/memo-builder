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
        @click="$emit('removeItem', item.id)"
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
  import type { SelectedItemUI } from '~/adapters/items/useSelectedItems'
  import type { IItem } from '~/core/items/types'

  const props = defineProps<{
    name: string
    selectedItems: SelectedItemUI
    modelValue: Record<string, boolean>
    listId: number
    items: IItem[]
  }>()

  const emits = defineEmits<{
    newItem: [name: string]
    removeItem: [id: number]
    removeList: []
    selectItem: [id: number]
    'update:modelValue': [selected: Record<string, boolean>]
  }>()

  const listItems = computed(() =>
    props.items.filter(({ listId }) => listId === props.listId),
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
    emits('newItem', newItem.value)
    newItem.value = ''
  }
</script>
