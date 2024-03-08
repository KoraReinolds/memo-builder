import { ifElse, identity } from 'ramda'
import { isEmail, isId, isLinks, isNumberList, isString } from './typeGuards'
import {
  invalidEmailError,
  invalidIdsListError,
  invalidIdError,
  invalidNameError,
  invalidUserIdError,
  invalidDataError,
  invalidListIdError,
  invalidGroupIdError,
  invalidLinksError,
} from './errors'

export const validateId = ifElse(isId, identity, invalidIdError)

export const validateListId = ifElse(isId, identity, invalidListIdError)

export const validateUserId = ifElse(isId, identity, invalidUserIdError)

export const validateName = ifElse(isString, identity, invalidNameError)

export const validateEmail = ifElse(isEmail, identity, invalidEmailError)

export const validateIds = ifElse(isNumberList, identity, invalidIdsListError)

export const validateData = ifElse(isString, identity, invalidDataError)

export const validateGroupId = ifElse(isId, identity, invalidGroupIdError)

export const validateLinks = ifElse(isLinks, identity, invalidLinksError)
