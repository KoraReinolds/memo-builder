<template>
  <div class="flex justify-between">
    <div
      v-for="itemList in list"
      :key="itemList.id"
    >
      <span>
        {{ itemList.name }}
      </span>
      <div
        v-for="item in filteredItems(items, itemList.id)"
        :key="item.id"
      >
        {{ item.data }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue'
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

  function filteredItems(items: IItem[], id: number) {
    return items.filter((entry) => entry.listId === id)
  }
</script>
