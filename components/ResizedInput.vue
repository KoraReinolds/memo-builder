<template>
  <span class="relative">
    <span aria-hidden="true">
      {{ modelValue }}
    </span>
    <input
      ref="input"
      class="absolute right-0 w-full"
      :value="modelValue"
      type="text"
      @input="changeValue"
    />
  </span>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const emit = defineEmits<{
    'update:modelValue': [value: String]
  }>()

  defineProps({
    modelValue: {
      type: String,
      required: true,
    },
  })

  const input = ref<HTMLInputElement | null>(null)

  const changeValue = (e: Event) => {
    const target = e.target as HTMLInputElement
    emit('update:modelValue', target.value)
  }
</script>
