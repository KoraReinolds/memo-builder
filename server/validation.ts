import { pipe, prop } from 'ramda'

export const isId = (id: any): id is number => id && Number.isInteger(+id)

export const validateId = (id: any) => {
  if (isId(id)) {
    return id
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: 'id is not integer or defined',
    })
  }
}

export const getQueryId = pipe(prop('id'), validateId, Number)

export const isString = (value: any): value is string => {
  return typeof value === 'string' && value.trim() !== ''
}
