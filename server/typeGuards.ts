import { complement } from 'ramda'

export const isNumber = (num: any): num is number =>
  num && Number.isInteger(+num)

export const isNotNumber = complement(isNumber)

export const isId = isNumber

export const isString = (value: any): value is string =>
  typeof value === 'string' && value.trim() !== ''

export const isEmail = (email: any): email is string =>
  isString(email) && email.includes('@')

export const isArray = (array: any): array is any[] => Array.isArray(array)

export const isNumberList = (array: any): array is number[] =>
  isArray(array) && array.every(isNumber)

export const isLinks = (array: any): array is [number, number][] =>
  isArray(array) && array.every(isNumberList)
