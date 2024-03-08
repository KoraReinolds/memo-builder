<template>
  <button @click="saveChanges">Save</button>
  <div class="flex justify-between">
    <div
      v-for="itemList in list"
      :key="itemList.id"
    >
      <slot
        name="items"
        :link-mode-selected="linkModeSelected"
        :select-item="selectItem"
        :selected-items="selectedItems"
        :filtered-items="filteredItems"
        :item-list="itemList"
      ></slot>
    </div>
    <div>
      <input
        v-model="newListName"
        type="text"
      />
      <button @click="createNewList">Add List</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue'
  import type { IItem } from '~/core/items/types'
  import type { Links } from '~/core/links/types'
  import type { IList } from '~/core/lists/types'

  const props = defineProps({
    list: {
      type: Object as PropType<IList[]>,
      required: true,
    },
    links: {
      type: Object as PropType<Links>,
      required: true,
    },
  })

  const emits = defineEmits<{
    newList: [name: string]
    addLinks: [data: [number, number][]]
    deleteLinks: [data: [number, number][]]
  }>()

  watch(
    () => props.list,
    () => {
      linkModeSelected.value = getLinkModeSelectedInitialValue()
    },
  )

  const newListName = ref()

  function createNewList() {
    emits('newList', newListName.value)
    newListName.value = ''
  }

  function saveChanges() {
    if (!selectedItem.value) return

    const groupedLinks = Object.entries(linkModeSelected.value).filter(
      (entry) => +entry[0] !== selectedItem.value?.listId,
    )
    const links = groupedLinks
      .map((entry) => Object.keys(entry[1]))
      .flat()
      .map((str) => +str)

    function idToPairs(rootId: number, listId: number[]) {
      const linksPairs: [number, number][] = []
      listId.forEach((id) => {
        linksPairs.push([id, rootId])
        linksPairs.push([rootId, id])
      })
      return linksPairs
    }

    const newLinks = links.filter((id) => !selectedItems.value.includes(+id))
    const newLinksPairs = idToPairs(selectedItem.value.id, newLinks)
    if (newLinksPairs.length) emits('addLinks', newLinksPairs)

    const deletedLinks = links.filter((id) => selectedItems.value.includes(+id))
    const deletedLinksPairs = idToPairs(selectedItem.value.id, deletedLinks)
    if (deletedLinksPairs.length) emits('deleteLinks', deletedLinksPairs)

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
