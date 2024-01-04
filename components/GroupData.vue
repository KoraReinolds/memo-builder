<template>
  <button @click="saveChanges">Save</button>
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

  const emits = defineEmits<{
    newItem: [id: number, name: string]
    addLinks: [data: [number, number][]]
  }>()

  function saveChanges() {
    if (!selectedItem.value) return

    const groupedLinks = Object.entries(linkModeSelected.value).filter(
      (entry) => +entry[0] !== selectedItem.value?.listId,
    )
    const links = groupedLinks
      .map((entry) => Object.keys(entry[1]))
      .flat()
      .map((str) => +str)
    const newLinks = links.filter((id) => !selectedItems.value.includes(+id))
    const linksPairs: [number, number][] = []
    const rootId = selectedItem.value.id
    newLinks.forEach((id) => {
      linksPairs.push([id, rootId])
      linksPairs.push([rootId, id])
    })
    emits('addLinks', linksPairs)
    mode.value = 'default'
  }

  function finishLinksMode() {
    linkModeSelected.value = getLinkModeSelectedInitialValue()
    selectedItemId.value = null
  }

  function getLinkModeSelectedInitialValue() {
    return Object.fromEntries(props.list.map((entry) => [entry.id, {}]))
  }

  const linkModeSelected = ref<Record<string, Record<string, boolean>>>(
    getLinkModeSelectedInitialValue(),
  )

  const mode = ref<'default' | 'links'>('default')

  function selectItem(itemId: number) {
    if (itemId === selectedItemId.value) {
      mode.value = 'default'
    } else if (selectedItemId.value === null) {
      mode.value = 'links'
      selectedItemId.value = itemId
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

  const selectedItemId = ref<number | null>(null)
  const selectedItem = computed(() => {
    return props.items.find((item) => item.id === selectedItemId.value)
  })
  const selectedItems = computed(() => {
    if (!selectedItemId.value) return []
    else return props.links.get(selectedItemId.value) || []
  })
</script>
