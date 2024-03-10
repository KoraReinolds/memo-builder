<template>
  <div>
    <div>{{ association }}</div>
    <div>{{ suggestions }}</div>

    <button @click="start">Start</button>
    <button @click="next">Next</button>

    <div>associationItems: {{ associationItems.length }}</div>
    <div>suggestionItems: {{ suggestionItems.length }}</div>
  </div>
</template>

<script setup lang="ts">
  import type { IItem } from '~/core/items/types'
  import type { ICountRange, IMemoConfig } from '~/core/memo/types'
  import { getRandomValueFromRange } from '~/db/lib'
  import { randomSort } from '~/lib'
  import { isNumber } from '~/server/typeGuards'

  const props = defineProps<{
    items: IItem[]
    links: Record<string, number[]>
    config: IMemoConfig
  }>()

  const suggestionCountRange = computed<ICountRange>(() => {
    const count = props.config.suggestions.count
    return isNumber(count)
      ? {
          min: count,
          max: count,
        }
      : count
  })

  const isAssociationItem = (item: IItem | null) =>
    item && item.listId === props.config.associations.listId

  const isSuggestionItem = (item: IItem | null) =>
    item && item.listId === props.config.suggestions.listId

  const mapItems = (items: IItem[]) =>
    Object.fromEntries(items.map((item) => [item.id, item]))

  const itemsMap = computed(() => mapItems(props.items))

  const associationMap = computed(() =>
    mapItems(props.items.filter(isAssociationItem)),
  )

  const suggestionMap = computed(() =>
    mapItems(props.items.filter(isSuggestionItem)),
  )

  const getSuggestionById = (id: number) => suggestionMap.value[id]

  const associationLinks = computed(() =>
    Object.fromEntries(
      Object.entries(props.links).map(([id, links]) => [
        id,
        links.filter(getSuggestionById),
      ]),
    ),
  )
  const hasLinks = (item: IItem | null, count: number = 1) =>
    item && (associationLinks.value[item.id]?.length || 0) >= count

  const associationItems = computed(() =>
    Object.values(associationMap.value)
      .filter((item) => hasLinks(item, suggestionCountRange.value.min))
      .sort(randomSort)
      .splice(0, props.config.associations.count),
  )

  const suggestionItems = computed(() => Object.values(suggestionMap.value))

  const association = ref<IItem | null>()
  const suggestions = ref<IItem[] | null>()

  const start = () => {
    next()
  }

  const next = () => {
    association.value = associationItems.value.pop()
    if (association.value) {
      const associatedLinks = associationLinks.value[association.value.id]

      if (!associatedLinks) return

      const rightLinks = getRandomValueFromRange(suggestionCountRange.value)
      suggestions.value = associatedLinks
        .sort(randomSort)
        .slice(0, rightLinks)
        .map((id) => itemsMap.value[id])
      const extraLinks = props.config.suggestions.totalCount - rightLinks
      suggestionItems.value
        .filter((item) => !associatedLinks.includes(item.id))
        .sort(randomSort)
        .slice(0, extraLinks)
        .forEach((item) => suggestions.value?.push(item))

      suggestions.value.sort(randomSort)
    } else {
      suggestions.value = null
    }
  }

  const hotkey = (event: KeyboardEvent) => {
    if (event.code === 'KeyS') start()
    if (event.code === 'KeyN') next()
  }

  onMounted(() => window.addEventListener('keydown', hotkey))
  onBeforeUnmount(() => window.removeEventListener('keydown', hotkey))
</script>
