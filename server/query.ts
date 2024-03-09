import { map, pipe, prop } from 'ramda'
import {
  validateEmail,
  validateId,
  validateName,
  validateUserId,
  validateListId,
  validateData,
  validateIds,
  validateGroupId,
  validateLinks,
} from './validation'

const getProp = (str: string) => (obj: Record<string, string>) =>
  prop(str, obj) || prop(str.toLowerCase(), obj)

export const getQueryId = pipe(prop('id'), validateId, Number)
export const getQueryUserId = pipe(getProp('userId'), validateUserId, Number)
export const getQueryGroupId = pipe(getProp('groupId'), validateGroupId, Number)
export const getQueryListId = pipe(getProp('listId'), validateListId, Number)
export const getQueryName = pipe(prop('name'), validateName)
export const getQueryEmail = pipe(prop('email'), validateEmail)
export const getQueryIds = pipe(prop('ids'), validateIds, map(Number))
export const getQueryData = pipe(prop('data'), validateData)
export const getQueryLinks = pipe(prop('links'), validateLinks)
