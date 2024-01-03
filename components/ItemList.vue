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
</script>
