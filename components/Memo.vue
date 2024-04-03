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
      <UInput
        :id="`memo-${item.id}`"
        v-model="selectedSuggestions[item.id]"
        type="checkbox"
      />
    </div>

    <UButton @click="start">Start</UButton>
    <UButton @click="next">Next</UButton>
    <UButton @click="reload">Reload</UButton>

    <div>associationItems: {{ associationItems.length }}</div>
    <div>suggestionItems: {{ suggestionItems.length }}</div>
    <div>pressedKeys: {{ pressedKeys }}</div>
  </div>
</template>

<script setup lang="ts">
  import type { SelectedItemUI } from '~/adapters/items/useSelectedItems'
  import { useKeyboard } from '~/adapters/keyboard/useKeyboard'
  import type { IItem } from '~/core/items/types'
  import type { ICountRange, IMemoConfig, Validator } from '~/core/memo/types'
  import { getRandomValueFromRange } from '~/db/lib'
  import { isNumber } from '~/server/typeGuards'
  import { toIdMap } from '~/useCases/lib/pairs'
  import { randomSort } from '~/useCases/lib/randomSort'

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

  const defaultValidator: Validator = ({ items }, result) =>
    toString(items) === toString(result)

  const validate = props.config.validator || defaultValidator

  const isAssociationItem = (item: IItem | null) =>
    item && item.listId === props.config.associations.listId

  const isSuggestionItem = (item: IItem | null) =>
    item && item.listId === props.config.suggestions.listId

  const itemsIdMap = computed(() => toIdMap(props.items))

  const associationMap = computed(() =>
    toIdMap(props.items.filter(isAssociationItem)),
  )

  const suggestionMap = computed(() =>
    toIdMap(props.items.filter(isSuggestionItem)),
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
      .map(([id]) => itemsIdMap.value[id]),
  )
  const rightResult = ref<IItem[]>([])

  const { pressedKeys, pressedKey } = useKeyboard()

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
    console.log(
      validate(
        {
          items: rightResult.value,
          keys: pressedKeys.value,
        },
        selectedItems.value,
      ),
    )

    if (association.value) {
      const associatedLinks = associationLinks.value[association.value.id]

      if (!associatedLinks) return

      clear()

      const rightLinks = getRandomValueFromRange(suggestionCountRange.value)
      rightResult.value = associatedLinks
        .sort(randomSort)
        .slice(0, rightLinks)
        .map((id) => itemsIdMap.value[id])

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

  watch(
    () => pressedKey.value,
    (pressedKey) => {
      const { code } = pressedKey || {}

      if (code === 'KeyS') start()
      if (code === 'KeyN') next()
      if (code === 'KeyR') reload()
      if (code === 'KeyA') again()
    },
  )
</script>
~/useCases/lib/randomSort
