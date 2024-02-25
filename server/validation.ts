import { ifElse, identity } from 'ramda'
import { isEmail, isId, isNumberList, isString } from './typeGuards'
import {
  invalidEmailError,
  invalidGroupsError,
  invalidIdError,
  invalidNameError,
  invalidUserIdError,
  invalidDataError,
} from './errors'

export const validateId = ifElse(isId, identity, invalidIdError)

export const validateUserId = ifElse(isId, identity, invalidUserIdError)

export const validateName = ifElse(isString, identity, invalidNameError)

export const validateEmail = ifElse(isEmail, identity, invalidEmailError)

export const validateIds = ifElse(isNumberList, identity, invalidGroupsError)

export const validateData = ifElse(isString, identity, invalidDataError)
