import React, { useCallback } from 'react'
import Button from 'components/elements/Button'
import cx from 'classnames'
import UI_STRINGS from 'util/ui-strings'
import { validateDomainField, validateRequiredField, validateAppIdField, validateAppDescField } from 'util/validators'
import FormControl from 'components/elements/FormControl'
import useValidateInput from 'util/hooks/useValidateInput'
import './WhitelistItemAddForm.scss'

interface WhitelistItemAddFormProps<T> {
  className?: string
  onAddNew: (value: T) => void
}

const domainValidators = [validateRequiredField, validateDomainField]
const appIdValidators = [validateRequiredField, validateAppIdField]
const appDescValidators = [validateAppDescField]

export const WhitelistDomainAddForm: React.FC<WhitelistItemAddFormProps<RiskSettingsDomain>> = ({
  className,
  onAddNew
}) => {
  const { inputRef, validate, isDirty, isValid, error } = useValidateInput(domainValidators)

  const handleAddNewClick = useCallback(() => {
    if (inputRef.current) {
      onAddNew({ domain: inputRef.current.value })
    }
  }, [onAddNew, inputRef])

  return (
    <div className={cx('WhitelistItemAddForm', className)}>
      <div className='WhitelistItemAddForm__input'>
        <FormControl
          placeholder={UI_STRINGS.RISK_SETTINGS.DOMAIN_NAME}
          onChange={validate}
          ref={inputRef}
          isInvalid={isDirty && !isValid}
          errorMessage={error}
        />
      </div>
      <div>
        <Button
          action='submit'
          disabled={!isValid}
          onClick={handleAddNewClick}
          text={UI_STRINGS.RISK_SETTINGS.ADD_NEW_DOMAIN}
        />
      </div>
    </div>
  )
}

export const WhitelistAppAddForm: React.FC<WhitelistItemAddFormProps<RiskSettingsApp>> = ({ className, onAddNew }) => {
  const appIdValidation = useValidateInput(appIdValidators)
  const appDescValidation = useValidateInput(appDescValidators)

  const handleAddNewClick = useCallback(() => {
    if (appIdValidation.inputRef.current && appDescValidation.inputRef.current) {
      onAddNew({
        appId: appIdValidation.inputRef.current.value,
        appDesc: appDescValidation.inputRef.current.value === '' ? undefined : appDescValidation.inputRef.current.value
      })
    }
  }, [appIdValidation.inputRef, appDescValidation.inputRef, onAddNew])

  return (
    <div className={cx('WhitelistItemAddForm', className)}>
      <div className='WhitelistItemAddForm__input'>
        <FormControl
          placeholder={UI_STRINGS.RISK_SETTINGS.APP_ID}
          onChange={appIdValidation.validate}
          ref={appIdValidation.inputRef}
          isInvalid={appIdValidation.isDirty && !appIdValidation.isValid}
          errorMessage={appIdValidation.error}
        />
        <FormControl
          placeholder={UI_STRINGS.RISK_SETTINGS.APP_DESC}
          onChange={appDescValidation.validate}
          ref={appDescValidation.inputRef}
          isInvalid={appDescValidation.isDirty && !appDescValidation.isValid}
          errorMessage={appDescValidation.error}
        />
      </div>
      <div>
        <Button
          action='submit'
          disabled={!appIdValidation.isValid || !appDescValidation.isValid}
          onClick={handleAddNewClick}
          text={UI_STRINGS.RISK_SETTINGS.ADD_NEW_APP}
        />
      </div>
    </div>
  )
}
