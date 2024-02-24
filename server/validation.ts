import { ifElse, identity } from 'ramda'
import { isEmail, isId, isString } from './typeGuards'
import { invalidEmailError, invalidIdError, invalidNameError } from './errors'

export const validateId = ifElse(isId, identity, invalidIdError)

export const validateName = ifElse(isString, identity, invalidNameError)

export const validateEmail = ifElse(isEmail, identity, invalidEmailError)
