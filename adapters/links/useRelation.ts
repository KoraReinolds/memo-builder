import { difference, intersection, map } from 'ramda'
import type { Links } from '~/core/links/types'
import type { RelationPair } from '~/db/relations'
import { db } from '~/local-storage/db'
import { LinksRepo } from '~/local-storage/repository/links'

const repo = new LinksRepo(db)

export const useRelation = (groupId: number) => {
  type NotRepeatableLinks = Record<number, Set<number>>

  const _links = ref<NotRepeatableLinks>({})

  const links = computed<Links>(() => map((v) => [...v], _links.value))

  watch(
    () => links.value,
    (links) => repo.sync(groupId, links),
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

  const addRelation = (res: NotRepeatableLinks, key: number, val: number) => {
    const link = res[key]
    if (link) link.add(val)
    else res[key] = new Set([val])
  }

  const removeRelations = (pairs: RelationPair[]) => {
    pairs.forEach(([key, val]) => {
      _links.value[key]?.delete(val)
      _links.value[val]?.delete(key)
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
