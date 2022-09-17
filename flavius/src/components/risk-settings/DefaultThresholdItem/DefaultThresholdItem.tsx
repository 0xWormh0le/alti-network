import React, { useState, useCallback, useEffect } from 'react'
import ContentLoader from 'react-content-loader'
import Button from 'components/elements/Button'
import FormControl from 'components/elements/FormControl'
import useValidateInput from 'util/hooks/useValidateInput'
import UI_STRINGS from 'util/ui-strings'
import { validateIntegerBetweenField, validateRequiredField } from 'util/validators'
import './DefaultThresholdItem.scss'

interface DefaultThresholdItemProps {
  title: string
  description: string
  type: RiskThresholdActorType
  initialValue: number
  isLoading: boolean
  onSave?: (value: number, type: RiskThresholdActorType) => void
}

const validators = [validateRequiredField, validateIntegerBetweenField(1, 999)]

export const DefaultThresholdItem: React.FC<DefaultThresholdItemProps> = ({
  title,
  description,
  type,
  isLoading,
  onSave,
  initialValue
}) => {
  const [value, setValue] = useState(initialValue)
  const { inputRef, validate, isValid, error } = useValidateInput(validators, initialValue.toString())

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  const dirty = initialValue !== value
  const handleValueChange = useCallback(
    (e) => {
      validate()
      setValue(Number(e.target.value))
    },
    [validate]
  )

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(value, type)
    }
  }, [onSave, value, type])

  return (
    <div className='DefaultThresholdItem'>
      <div className='DefaultThresholdItem__content'>
        <label htmlFor={`risk-threshold-${type}`}>
          <p className='DefaultThresholdItem__content-title'>{title}</p>
        </label>
        <p className='DefaultThresholdItem__content-description'>{description}</p>
      </div>
      <div className='DefaultThresholdItem__files'>
        {isLoading ? (
          <ContentLoader
            backgroundColor='#F0F0F0'
            foregroundColor='#F7F7F7'
            height={50}
            width='100%'
            uniqueKey='DefaultThreshold__input'>
            <rect x={0} y={0} width='100%' height={50} rx={4} ry={4} />
          </ContentLoader>
        ) : (
          <>
            <div className='DefaultThresholdItem__input'>
              <FormControl
                type='text'
                variant='flat'
                id={`risk-threshold-${type}`}
                value={value}
                ref={inputRef}
                onChange={handleValueChange}
              />
              <Button
                action='simple'
                disabled={!(dirty && isValid)}
                text={UI_STRINGS.SETTINGS.SAVE}
                onClick={handleSave}
              />
            </div>
            {!isValid && <label className='DefaultThresholdItem__error'>{error}</label>}
          </>
        )}
      </div>
    </div>
  )
}

export default DefaultThresholdItem
