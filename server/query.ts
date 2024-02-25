import { pipe, prop } from 'ramda'
import {
  validateEmail,
  validateGroups,
  validateId,
  validateName,
  validateUserId,
} from './validation'

export const getQueryId = pipe(prop('id'), validateId, Number)
export const getQueryUserId = pipe(prop('userId'), validateUserId, Number)
export const getQueryName = pipe(prop('name'), validateName)
export const getQueryEmail = pipe(prop('email'), validateEmail)
export const getQueryGroups = pipe(prop('groups'), validateGroups)
