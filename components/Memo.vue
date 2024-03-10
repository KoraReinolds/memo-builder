<template>
  <div>
    {{ selectedSuggestions }}
    <div>{{ association?.data }}</div>
    {{ suggestions }}
    <div
      v-for="item in suggestions"
      :key="item.id"
    >
      <label :for="`memo-${item.id}`">
        <ResizedInput v-model="item.data" />
      </label>
      <input
        :id="`memo-${item.id}`"
        v-model="selectedSuggestions[item.id]"
        type="checkbox"
      />
    </div>

    <button @click="start">Start</button>
    <button @click="next">Next</button>
    <button @click="reload">Reload</button>

    <div>associationItems: {{ associationItems.length }}</div>
    <div>suggestionItems: {{ suggestionItems.length }}</div>
  </div>
</template>

<script setup lang="ts">
  import type { SelectedItemUI } from '~/adapters/items/useSelectedItems'
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

  const toString = (items: IItem[]) =>
    JSON.stringify(items.sort().map((item) => item.id))

  const validate =
    props.config.validator ||
    ((items: IItem[], result: IItem[]) => toString(items) === toString(result))

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

  const allAssociationItems = computed(() =>
    Object.values(associationMap.value).filter((item) =>
      hasLinks(item, suggestionCountRange.value.min),
    ),
  )

  const associationItems = ref<IItem[]>([])

  const reloadAssociations = () =>
    (associationItems.value = allAssociationItems.value
      .sort(randomSort)
      .splice(0, props.config.associations.count))

  const suggestionItems = computed(() => Object.values(suggestionMap.value))

  const index = ref(-1)
  const association = computed<IItem | null>(
    () => associationItems.value[index.value],
  )
  const suggestions = ref<IItem[]>([])
  const selectedSuggestions = ref<SelectedItemUI>({})
  const selectedItems = computed<IItem[]>(() =>
    Object.entries(selectedSuggestions.value)
      .filter(([_, res]) => !!res)
      .map(([id]) => itemsMap.value[id]),
  )
  const rightResult = ref<IItem[]>([])

  const start = () => {
    reloadAssociations()
    next()
  }
  const again = () => {
    index.value = -1
    clear()
  }

  const reload = () => {
    reloadAssociations()
    again()
  }

  const clear = () => {
    suggestions.value = []
    selectedSuggestions.value = {}
  }

  const next = () => {
    index.value += 1
    console.log(validate(rightResult.value, selectedItems.value))

    if (association.value) {
      const associatedLinks = associationLinks.value[association.value.id]

      if (!associatedLinks) return

      clear()

      const rightLinks = getRandomValueFromRange(suggestionCountRange.value)
      rightResult.value = associatedLinks
        .sort(randomSort)
        .slice(0, rightLinks)
        .map((id) => itemsMap.value[id])

      rightResult.value.forEach((item) => suggestions.value?.push(item))

      const extraLinks = props.config.suggestions.totalCount - rightLinks
      suggestionItems.value
        .filter((item) => !associatedLinks.includes(item.id))
        .sort(randomSort)
        .slice(0, extraLinks)
        .forEach((item) => suggestions.value?.push(item))

      suggestions.value?.sort(randomSort)
    } else {
      again()
    }
  }

  const hotkey = (event: KeyboardEvent) => {
    if (event.code === 'KeyS') start()
    if (event.code === 'KeyN') next()
    if (event.code === 'KeyR') reload()
    if (event.code === 'KeyA') again()
  }

  onMounted(() => window.addEventListener('keydown', hotkey))
  onBeforeUnmount(() => window.removeEventListener('keydown', hotkey))
</script>
