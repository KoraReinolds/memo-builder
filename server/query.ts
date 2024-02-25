import { pipe, prop } from 'ramda'
import {
  validateEmail,
  validateId,
  validateName,
  validateUserId,
  validateData,
  validateIds,
} from './validation'

export const getQueryId = pipe(prop('id'), validateId, Number)
export const getQueryUserId = pipe(prop('userId'), validateUserId, Number)
export const getQueryName = pipe(prop('name'), validateName)
export const getQueryEmail = pipe(prop('email'), validateEmail)
export const getQueryIds = pipe(prop('ids'), validateIds)
export const getQueryData = pipe(prop('data'), validateData)
