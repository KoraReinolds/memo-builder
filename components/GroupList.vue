<template>
  <div
    v-for="group in groups"
    :key="group.id"
    class="mb-2 flex gap-2"
  >
    <UButton
      class="w-[400px]"
      color="gray"
      variant="solid"
      @click="$emit('open', group.id)"
      v-text="group.name"
    />
    <UButton
      color="red"
      @click="$emit('remove', group.id)"
      v-text="'Del'"
    />
  </div>
</template>

<script setup lang="ts">
  import { type PropType } from 'vue'
  import type { IGroup } from '~/core/groups/types'

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
