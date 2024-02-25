export const throwError = (statusCode: number, statusMessage: string) => {
  throw createError({
    statusCode,
    statusMessage,
  })
}

export const invalidIdError = () =>
  throwError(400, 'id is not integer or defined')

export const invalidUserIdError = () =>
  throwError(400, 'userId is not integer or defined')

export const invalidNameError = () => throwError(400, 'Name is required')

export const invalidEmailError = () => throwError(400, 'Email is not valid')

export const invalidGroupsError = () =>
  throwError(400, 'Groups data is not integer array or defined')
