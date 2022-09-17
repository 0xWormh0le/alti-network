import React, { useState, useCallback, FormEvent } from 'react'
import Button from 'components/elements/Button'
import exactMatching from './exact-matching.svg'
import FormControl from 'components/elements/FormControl'
import NumberedList from 'components/elements/NumberedList'
import partialMatching from './partial-matching.svg'
import Radio from 'components/elements/Radio'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import UI_STRINGS from 'util/ui-strings'
import useValidateInput from 'util/hooks/useValidateInput'
import { validateRequiredField } from 'util/validators'
import './NewSensitivePhrase.scss'

export interface NewSensitivePhraseProps {
  onAdd: (sensitivePhrase: SensitivePhrase, resetForm: () => void) => void
}

export const NewSensitivePhrase: React.FC<NewSensitivePhraseProps> = ({ onAdd }) => {
  const [exact, setExact] = useState(true)

  const { inputRef, validate, isDirty, isValid, error } = useValidateInput(validateRequiredField)

  const resetForm = useCallback(() => {
    if (inputRef.current) {
      setExact(true)
      inputRef.current.value = ''
    }
  }, [inputRef])

  const handleAdd = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      if (inputRef.current) {
        onAdd(
          {
            exact,
            phrase: inputRef.current.value.toLowerCase()
          },
          resetForm
        )
        e.preventDefault()
      }
    },
    [onAdd, resetForm, inputRef, exact]
  )

  const handleChangeExact = useCallback((e: Event) => {
    setExact((e.target as HTMLInputElement).value === 'true')
  }, [])

  return (
    <form className='NewSensitivePhrase' onSubmit={handleAdd}>
      <Typography variant={TypographyVariant.H3}>Add Sensitive Phrase</Typography>
      <NumberedList>
        <div className='NewSensitivePhrase__field'>
          <FormControl
            type='text'
            name='phrase'
            ref={inputRef}
            onChange={validate}
            isInvalid={isDirty && !isValid}
            placeholder='Enter Sensitive Phrase'
            errorMessage={error}
          />
        </div>
        <div className='NewSensitivePhrase__field'>
          <div className='NewSensitivePhrase__radios'>
            <Radio
              name='exact'
              labelText={UI_STRINGS.RISK_SETTINGS.EXACT_MATCH}
              labelOnRight={true}
              checked={exact}
              value={true}
              onChange={handleChangeExact}
              inline={true}
              className='NewSensitivePhrase__radio'
            />
            <Radio
              name='exact'
              labelText={UI_STRINGS.RISK_SETTINGS.PARTIAL_MATCH}
              labelOnRight={true}
              checked={!exact}
              value={false}
              onChange={handleChangeExact}
              inline={true}
              className='NewSensitivePhrase__radio'
            />
          </div>
          <div className='NewSensitivePhrase__help-box'>
            <Typography
              variant={TypographyVariant.BODY_TINY}
              className='NewSensitivePhrase__helper-text'
              component='div'>
              {exact ? UI_STRINGS.RISK_SETTINGS.HELPER_TEXT_NOTMATCH : UI_STRINGS.RISK_SETTINGS.HELPER_TEXT_MATCH}
            </Typography>
            {exact ? (
              <img src={exactMatching} alt='exact matching' className='NewSensitivePhrase__helper-img' />
            ) : (
              <img src={partialMatching} alt='partial matching' className='NewSensitivePhrase__helper-img' />
            )}
          </div>
        </div>
        <Button
          type='submit'
          className='NewSensitivePhrase__button'
          action='primary'
          disabled={!isValid}
          text={UI_STRINGS.BUTTON_LABELS.ADD}
        />
      </NumberedList>
    </form>
  )
}

export default NewSensitivePhrase
