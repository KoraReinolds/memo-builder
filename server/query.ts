import { pipe, prop } from 'ramda'
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

export const getQueryId = pipe(prop('id'), validateId, Number)
export const getQueryUserId = pipe(prop('userid'), validateUserId, Number)
export const getQueryGroupId = pipe(prop('groupid'), validateGroupId, Number)
export const getQueryListId = pipe(prop('listid'), validateListId, Number)
export const getQueryName = pipe(prop('name'), validateName)
export const getQueryEmail = pipe(prop('email'), validateEmail)
export const getQueryIds = pipe(prop('ids'), validateIds)
export const getQueryData = pipe(prop('data'), validateData)
export const getQueryLinks = pipe(prop('links'), validateLinks)
