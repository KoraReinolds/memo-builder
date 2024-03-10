import { difference, intersection } from 'ramda'
import type { Links } from '~/core/links/types'
import type { RelationPair } from '~/db/relations'

export const useRelation = (groupId: number) => {
  const _links = ref<Links>(new Map())

  const links = computed<Record<string, number[]>>(() =>
    Object.fromEntries(
      [..._links.value.entries()].map(([id, set]) => [id, [...set]]),
    ),
  )

  const addLinksByItemsIds = async (ids: number[]) => {
    const params = new URLSearchParams()
    ids.forEach((id) => params.append('ids', id.toString()))

    const { data, error } = await useFetch(
      `/api/links/by-items?${params.toString()}`,
    )

    if (error.value) {
      console.warn(`${addLinksByItemsIds.name} error`, error.value)
    }

    addRelations(data.value)
  }

  const getLinksByGroupId = async (groupId: number) => {
    const { data, error } = await useFetch(
      `/api/links/by-group?groupId=${groupId}`,
    )

    if (error.value) {
      console.warn(`${getLinksByGroupId.name} error`, error.value)
    }

    return data.value
  }

  const addRelation = (res: Links, key: number, val: number) => {
    const link = res.get(key)
    if (link) link.add(val)
    else res.set(key, new Set([val]))
  }

  const removeRelations = (pairs: RelationPair[]) => {
    pairs.forEach(([key, val]) => {
      _links.value.get(key)?.delete(val)
      _links.value.get(val)?.delete(key)
    })
  }

  const addRelations = (pairs: RelationPair[] | null) => {
    if (!pairs) return

    const res = _links.value

    pairs?.forEach(([first, second]) => {
      addRelation(res, first, second)
      addRelation(res, second, first)
    })
  }

  const getRemovedLinks = intersection

  const getNewLinks = difference

  getLinksByGroupId(groupId).then(addRelations)

  const createLinks = async (newLinks: [number, number][]) => {
    const { error } = await useFetch('/api/links', {
      method: 'put',
      body: {
        links: newLinks,
      },
    })

    if (error.value) {
      console.warn(`${createLinks.name} error`, error.value)
    }

    addRelations(newLinks)
  }

  const removeLinks = async (links: [number, number][]) => {
    const { error } = await useFetch('/api/links', {
      method: 'delete',
      body: {
        links,
      },
    })

    if (error.value) {
      console.warn(`${removeLinks.name} error`, error.value)
    }

    removeRelations(links)
  }

  return {
    links,
    getRemovedLinks,
    getNewLinks,
    createLinks,
    addLinksByItemsIds,
    removeLinks,
  }
}
