<template>
  <div
    v-for="item in list"
    :key="item.id"
  >
    {{ item.name }}
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { IList } from '~/interfaces/IGroup'

defineProps({
  list: {
    type: Object as PropType<IList[]>,
    required: true,
  } 
})
</script>