<template>
  <div class="flex justify-between">
    <div
      v-for="itemList in list"
      :key="itemList.id"
    >
      <ItemList
        :name="itemList.name"
        :items="filteredItems(items, itemList.id)"
        @new-item="(name) => $emit('newItem', itemList.id, name)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue'
  import ItemList from '~/components/ItemList.vue'
  import type { IItem, IList } from '~/interfaces/IGroup'

  defineProps({
    list: {
      type: Object as PropType<IList[]>,
      required: true,
    },
    items: {
      type: Object as PropType<IItem[]>,
      required: true,
    },
  })

  defineEmits<{
    newItem: [id: number, name: string]
  }>()

  function filteredItems(items: IItem[], id: number) {
    return items.filter((entry) => entry.listId === id)
  }
</script>
