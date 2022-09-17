import { useState, useEffect, useRef, useCallback, RefObject } from 'react'

type ValidateInputHook = (
  validate: ValidateFn[] | ValidateFn,
  defaultValue?: string
) => {
  inputRef: RefObject<HTMLInputElement>
  validate: () => void
  error?: string
  isDirty: boolean
  isValid: boolean
}

const useValidateInput: ValidateInputHook = (validateFn, defaultValue = '') => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [error, setError] = useState<string | undefined>(undefined)

  const [isDirty, setIsDirty] = useState(false)

  const isValid = error === undefined

  const _validate = useCallback(
    (value: string) => {
      if (Array.isArray(validateFn)) {
        for (const fn of validateFn) {
          const err = fn(value)
          if (err) {
            return err
          }
        }
        return null
      } else {
        return validateFn(value)
      }
    },
    [validateFn]
  )

  useEffect(() => {
    setError(_validate(defaultValue) ?? undefined)
  }, [defaultValue, _validate])

  const validate = useCallback(() => {
    setIsDirty(true)
    setError(() => {
      if (inputRef.current) {
        return _validate(inputRef.current.value) ?? undefined
      } else {
        return undefined
      }
    })
  }, [_validate])

  return { inputRef, validate, error, isValid, isDirty }
}

export default useValidateInput
