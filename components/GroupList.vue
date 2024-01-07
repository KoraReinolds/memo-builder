<template>
  <div
    v-for="group in groups"
    :key="group.id"
  >
    <span @click="$emit('open', group.id)">
      {{ group.name }}
    </span>
    <button @click="$emit('remove', group.id)">Del</button>
  </div>
</template>

<script setup lang="ts">
  import { type PropType } from 'vue'
  import { type IGroup } from '../interfaces/IGroup'

  defineProps({
    groups: {
      type: Array as PropType<IGroup[]>,
      required: true,
    },
  })

  defineEmits<{
    open: [number]
    remove: [number]
  }>()
</script>
