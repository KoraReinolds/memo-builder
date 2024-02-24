export const isId = (id: any): id is number => id && Number.isInteger(+id)

export const isString = (value: any): value is string => {
  return typeof value === 'string' && value.trim() !== ''
}

export const isEmail = (email: any): email is string => {
  return isString(email) && email.includes('@')
}
