import { difference, intersection } from 'ramda'
import type { Links } from '~/core/links/types'
import type { IDBRelation } from '~/db/relations'

export const useRelation = (groupId: number) => {
  const links = ref<Links | null>(null)

  const getLinksByItemsIds = async (ids: number[]) => {
    const params = new URLSearchParams()
    ids.forEach((id) => params.append('ids', id.toString()))

    const { data, error } = await useFetch(
      `/api/links/by-items?${params.toString()}`,
    )

    if (error.value) {
      console.warn(`${getLinksByItemsIds.name} error`, error.value)
    }

    return data.value
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

  const dbRelationAdapter = (dbRelation: IDBRelation[]) => {
    const res: Links = new Map()

    const addEl = (key: number, val: number) => {
      const link = res.get(key)
      if (link) link.push(val)
      else res.set(key, [val])
    }

    const links = dbRelation.map((link) => [link.chainId, link.relatedId])

    links.forEach(([first, second]) => {
      addEl(first, second)
      addEl(second, first)
    })

    return res
  }

  const getRemovedLinks = intersection

  const getNewLinks = difference

  getLinksByGroupId(groupId).then(
    (dbRelation) => (links.value = dbRelationAdapter(dbRelation || [])),
  )

  return {
    links,
    getRemovedLinks,
    getNewLinks,
  }
}
