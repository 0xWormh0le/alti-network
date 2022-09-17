import UI_STRINGS from './ui-strings'
import { isValidAppId, isValidAppDesc, isValidDomain } from 'util/helpers'

export const validateRequiredField: ValidateFn = (value) => {
  if (value.length === 0) {
    return UI_STRINGS.VALIDATION.REQUIRED
  } else {
    return null
  }
}

export const validateRegexField: (regExp: RegExp) => ValidateFn = (regExp) => (value) => {
  const pattern = new RegExp(regExp)
  if (pattern.test(value)) {
    return null
  } else {
    return UI_STRINGS.VALIDATION.INVALID
  }
}

export const validateDomainField: ValidateFn = (value) => {
  if (isValidDomain(value)) {
    return null
  } else {
    return UI_STRINGS.VALIDATION.INVALID
  }
}

export const validateAppIdField: ValidateFn = (value) => {
  if (isValidAppId(value)) {
    return null
  } else {
    return UI_STRINGS.VALIDATION.INVALID
  }
}

export const validateAppDescField: ValidateFn = (value) => {
  if (isValidAppDesc(value)) {
    return null
  } else {
    return UI_STRINGS.VALIDATION.INVALID
  }
}

export const validateIntegerBetweenField: (min: number, max: number) => ValidateFn = (min, max) => (value) => {
  const num = parseInt(value, 10)
  if (Number.isNaN(num) || num % 1 !== 0) {
    return UI_STRINGS.VALIDATION.INTEGER
  } else if (num < min) {
    return UI_STRINGS.VALIDATION.GREATER_THAN(min - 1)
  } else if (num > max) {
    return UI_STRINGS.VALIDATION.LESS_THAN(max + 1)
  } else {
    return null
  }
}
