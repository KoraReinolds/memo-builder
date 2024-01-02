<template>
  <div
    v-for="group in groups"
    :key="group.id"
  >
    {{ group.name }}
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import { type IGroup } from '../interfaces/IGroup'

defineProps({
  groups: {
    type: Array as PropType<IGroup[]>,
    required: true,
  }
})
</script>
