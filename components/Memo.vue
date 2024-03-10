<template>
  <div>
    <div>{{ association }}</div>
    <div>{{ suggestions }}</div>
    <button @click="start">Start</button>
  </div>
</template>

<script setup lang="ts">
  import type { IItem } from '~/core/items/types'
  import type { IMemoConfig } from '~/core/memo/types'
  import { randomSort } from '~/lib'

  const props = defineProps<{
    items: IItem[]
    links: Record<string, number[]>
    config: IMemoConfig
  }>()

  const associationMap = computed(() =>
    Object.fromEntries(props.items.map((item) => [item.id, item])),
  )

  const isAssociationItem = (item: IItem | null) =>
    item && item.listId === props.config.associations.listId

  const isSuggestionItem = (item: IItem | null) =>
    item && item.listId === props.config.suggestions.listId

  const associationItems = computed(() =>
    props.items.filter(isAssociationItem).sort(randomSort),
  )

  const association = ref<IItem | null>()
  const suggestions = ref<IItem[] | null>()

  const start = () => {
    association.value = associationItems.value.pop()
    if (association.value) {
      suggestions.value = props.links[association.value.id]
        ?.map((id) => associationMap.value[id])
        .filter(isSuggestionItem)
    }
  }

  const hotkey = (event: KeyboardEvent) => {
    if (event.code === 'KeyS') start()
  }

  onMounted(() => window.addEventListener('keydown', hotkey))
  onBeforeUnmount(() => window.removeEventListener('keydown', hotkey))
</script>
