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

export const invalidIdsListError = () =>
  throwError(400, 'ids is not list or contain not numbers')

export const invalidDataError = () => throwError(400, 'Data is required')

export const invalidListIdError = () =>
  throwError(400, 'listId is not integer or defined')

export const invalidGroupIdError = () =>
  throwError(400, 'groupId is not integer or defined')

export const invalidLinksError = () => throwError(400, 'links are invalid')
