<template>
  <div class="flex justify-between">
    <div
      v-for="itemList in list"
      :key="itemList.id"
    >
      <ItemList
        v-model="linkModeSelected[itemList.id]"
        :name="itemList.name"
        :items="filteredItems(items, itemList.id)"
        :selected-items="selectedItems"
        @new-item="(name) => $emit('newItem', itemList.id, name)"
        @select-item="selectItem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue'
  import ItemList from '~/components/ItemList.vue'
  import type { IItem, IList, Links } from '~/interfaces/IGroup'

  const props = defineProps({
    list: {
      type: Object as PropType<IList[]>,
      required: true,
    },
    items: {
      type: Object as PropType<IItem[]>,
      required: true,
    },
    links: {
      type: Object as PropType<Links>,
      required: true,
    },
  })

  defineEmits<{
    newItem: [id: number, name: string]
  }>()

  function finishLinksMode() {
    linkModeSelected.value = getLinkModeSelectedInitialValue()
    selectedItem.value = null
  }

  function getLinkModeSelectedInitialValue() {
    return Object.fromEntries(props.list.map((entry) => [entry.id, {}]))
  }

  const linkModeSelected = ref<Record<string, Record<string, boolean>>>(
    getLinkModeSelectedInitialValue(),
  )

  const mode = ref<'default' | 'links'>('default')

  function selectItem(itemId: number) {
    if (itemId === selectedItem.value) {
      mode.value = 'default'
    } else if (selectedItem.value === null) {
      mode.value = 'links'
      selectedItem.value = itemId
    } else {
      console.log('changeLinks')
    }
  }

  watch(mode, (_, oldValue) => {
    if (oldValue === 'links') {
      finishLinksMode()
    }
  })

  function filteredItems(items: IItem[], id: number) {
    return items.filter((entry) => entry.listId === id)
  }

  const selectedItem = ref<number | null>(null)
  const selectedItems = computed(() => {
    if (!selectedItem.value) return []
    else return props.links.get(selectedItem.value) || []
  })
</script>
