import { pipe, prop } from 'ramda'
import { validateEmail, validateId, validateName } from './validation'

export const getQueryId = pipe(prop('id'), validateId, Number)
export const getQueryName = pipe(prop('name'), validateName)
export const getQueryEmail = pipe(prop('email'), validateEmail)
