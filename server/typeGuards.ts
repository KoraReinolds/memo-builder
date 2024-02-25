import { complement } from 'ramda'

export const isNumber = (num: any): num is number =>
  num && Number.isInteger(+num)

export const isNotNumber = complement(isNumber)

export const isId = isNumber

export const isString = (value: any): value is string =>
  typeof value === 'string' && value.trim() !== ''

export const isEmail = (email: any): email is string =>
  isString(email) && email.includes('@')

export const isNumberList = (array: any): array is number[] =>
  !Array.isArray(array) || array.some(isNotNumber)
