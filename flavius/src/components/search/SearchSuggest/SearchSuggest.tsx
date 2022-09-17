import React, { useCallback, useState, useMemo, useRef } from 'react'
import { ContainerProps, IndicatorContainerProps } from 'react-select/src/components/containers'
import { NoticeProps } from 'react-select/src/components/Menu'
import cn from 'classnames'
import fp from 'lodash/fp'
import parse from 'autosuggest-highlight/parse'
import Select, {
  ControlProps,
  MenuProps,
  MenuListComponentProps,
  OptionProps,
  PlaceholderProps,
  SingleValueProps
} from 'react-select'
import union from 'lodash/union'
import googleDriveFileIcon from 'icons/google-drive-file-icon.svg'
import { filterWithLimit, findMatches, isValidEmail, isExternalEmail } from 'util/helpers'
import { BaseAvatar } from '@altitudenetworks/component-library/'

import FormControl from 'components/elements/FormControl'
import HistoryIcon from 'icons/history'
import { ReactComponent as SearchIcon } from 'icons/search.svg'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import VisibilityIndicator from 'components/elements/VisibilityIndicator'
import UI_STRINGS from 'util/ui-strings'
import Analytics from 'util/analytics'
import { UsageKind, UserKind } from 'types/common'
import CONSTANTS from 'util/constants'
import Person from 'models/Person'
import { retrieveFromStorage, storeInStorage } from 'util/storage'
import './SearchSuggest.scss'

const MIN_SEARCH_TEXT_LEN = 3
const SEARCH_RESULTS_LIMIT = 20
export const FILE_ID_MIN_LENGTH = 15

export interface SearchSuggestProps {
  domains: string[]
  people: IPerson[]
  onSelect: (personId: string) => void
}

interface SearchSuggestValue {
  label: string
  value: string
  avatar?: Avatar
  internal: boolean
  file: boolean
}

export const getOptionsFromPerson = (person: IPerson): SearchSuggestValue[] => {
  const newPerson = new Person(person)
  const fullName = newPerson.name?.fullName
  const otherOptions =
    newPerson.emails?.map(
      (item: Email) =>
        ({
          label: fullName,
          value: item.address,
          avatar: newPerson.avatar,
          internal: item.kind === UsageKind.work,
          file: false
        } as SearchSuggestValue)
    ) || []
  return [
    {
      label: fullName,
      value: newPerson.primaryEmail?.address ?? '', // altnetId:
      avatar: newPerson.avatar,
      internal: newPerson.userKind !== UserKind.person,
      file: false
    },
    ...otherOptions
  ]
}

const isFile = (input: string) => input.length > FILE_ID_MIN_LENGTH && input.indexOf('@') === -1

export const getOptions = (people: IPerson[], filterStr: string, domains: string[]): SearchSuggestValue[] => {
  const isExternalPersonEmail = isValidEmail(filterStr) && isExternalEmail(domains, filterStr)

  if (isExternalPersonEmail || isFile(filterStr)) {
    return [
      {
        label: filterStr,
        value: filterStr,
        avatar: {
          url: '',
          url_etag: ''
        },
        internal: false,
        file: isFile(filterStr)
      }
    ]
  }
  return filterStr
    ? fp.compose(
        (items: SearchSuggestValue[]) =>
          filterWithLimit(
            items,
            (option: SearchSuggestValue) =>
              option.label.toLowerCase().includes(filterStr.toLowerCase()) ||
              option.value.toLowerCase().includes(filterStr.toLowerCase()),
            SEARCH_RESULTS_LIMIT
          ),
        fp.flatten,
        fp.map(getOptionsFromPerson)
      )(people)
    : []
}

export const getHistoryOptions = () => {
  const personSearchHistory = retrieveFromStorage<string[]>('personSearchHistory') || []
  return personSearchHistory.map(
    (searchText): SearchSuggestValue => ({
      label: searchText,
      value: searchText,
      avatar: {
        url: '',
        url_etag: ''
      },
      internal: false,
      file: isFile(searchText)
    })
  )
}

const Control = (props: ControlProps<SearchSuggestValue>) => {
  const {
    children,
    innerRef,
    innerProps,
    selectProps: { menuIsOpen },
    isFocused
  } = props
  return (
    <FormControl
      component='div'
      ref={innerRef}
      {...innerProps}
      className={cn('SearchSuggest__control', {
        'SearchSuggest__control--focus': isFocused,
        'SearchSuggest__control--open': menuIsOpen
      })}>
      <SearchIcon className='SearchSuggest__icon' />
      {children}
    </FormControl>
  )
}

const SingleValue = (props: SingleValueProps<SearchSuggestValue>) => {
  const {
    className,
    data: { label, value },
    innerProps,
    selectProps
  } = props
  const { finalInputValue } = selectProps
  const pattern = new RegExp(finalInputValue, 'i')
  const valueToRender = pattern.test(value) && !pattern.test(label) ? value : label
  return (
    <div className={cn('SearchSuggest__single-value', className)} {...innerProps}>
      {valueToRender}
    </div>
  )
}

const Placeholder = (props: PlaceholderProps<SearchSuggestValue>) => {
  const { children, className, isFocused, innerProps } = props as PlaceholderProps<SearchSuggestValue> & {
    isFocused: boolean
  }
  return isFocused ? null : (
    <Typography
      variant={TypographyVariant.H4}
      className={cn('SearchSuggest__placeholder', className)}
      component='div'
      {...innerProps}>
      {children}
    </Typography>
  )
}

const IndicatorsContainer = (props: IndicatorContainerProps<SearchSuggestValue>) => {
  const {
    className,
    clearValue,
    selectProps: { inputValue, value, onInputChange }
  } = props
  const handleClick = useCallback(() => {
    if (onInputChange) {
      onInputChange('', { action: 'input-change' })
    }
    clearValue()
  }, [onInputChange, clearValue])
  const hasValue = Boolean(inputValue || value)
  return (
    <div className={cn('SearchSuggest__indicators', className)}>
      {hasValue && (
        <button className='SearchSuggest__clear' onClick={handleClick}>
          &times;
        </button>
      )}
    </div>
  )
}

const SuggestOption = (props: OptionProps<SearchSuggestValue>) => {
  const { innerRef, innerProps, isSelected, isFocused, data, selectProps } = props
  const optionValue: SearchSuggestValue = data
  const inputValue = selectProps.inputValue || ''
  const labelMatches = findMatches(optionValue.label, inputValue)
  const labelParts = parse(optionValue.label, labelMatches)
  const emailMatches = findMatches(optionValue.value, inputValue)
  const emailParts = parse(optionValue.value, emailMatches)
  const isExactFile = isFile(optionValue.value)

  return (
    <div
      className={cn('SearchSuggest__item', {
        'SearchSuggest__item--active': isSelected,
        'SearchSuggest__item--focus': isFocused
      })}
      ref={innerRef}
      {...innerProps}>
      {isExactFile && (
        <img src={googleDriveFileIcon} className='SearchSuggest__item--file-icon' alt='Google Drive File' />
      )}
      {!isExactFile && (
        <BaseAvatar
          style={{ margin: '0em 1em', fontSize: '0.75em', color: 'white' }}
          src={optionValue ? optionValue.avatar : undefined}
          name={optionValue ? optionValue.label : ''}
          colorList={CONSTANTS.COLOR_LIST}
        />
      )}
      <Typography variant={TypographyVariant.BODY} className='SearchSuggest__item-text' component='div'>
        {labelParts.map((part, index) => (
          <span key={index} className={cn({ 'SearchSuggest__item-text-bold': part.highlight })}>
            {part.text}
          </span>
        ))}
      </Typography>
      {!isExactFile && optionValue.label !== optionValue.value && (
        <Typography variant={TypographyVariant.BODY} className='SearchSuggest__item-value' component='div'>
          {emailParts.map((part, index) => (
            <span key={index} className={cn({ 'SearchSuggest__item-text-bold': part.highlight })}>
              {part.text}
            </span>
          ))}
        </Typography>
      )}
      {!isExactFile && <VisibilityIndicator isInternal={optionValue.internal} />}
    </div>
  )
}

const HistoryOption = (props: OptionProps<SearchSuggestValue>) => {
  const { innerRef, innerProps, isSelected, isFocused, data, selectProps } = props
  const optionValue = data as SearchSuggestValue
  const handleHistoryItemClick = useCallback(
    (event) => {
      event.preventDefault()
      const { onInputChange } = selectProps
      if (onInputChange) {
        onInputChange(optionValue.value, { action: 'input-change' })
      }
    },
    [optionValue.value, selectProps]
  )
  return (
    <div
      className={cn('SearchSuggest__item', {
        'SearchSuggest__item--active': isSelected,
        'SearchSuggest__item--focus': isFocused
      })}
      ref={innerRef}
      {...innerProps}
      onClick={handleHistoryItemClick}>
      <HistoryIcon className='SearchSuggest__item-icon' />
      <Typography variant={TypographyVariant.BODY} className='SearchSuggest__item-hist' component='div'>
        {optionValue.label}
      </Typography>
    </div>
  )
}

const Option = (props: OptionProps<SearchSuggestValue>) => {
  const { selectProps } = props
  const inputValue = selectProps.inputValue || ''
  return inputValue ? <SuggestOption {...props} /> : <HistoryOption {...props} />
}

const NoOptionsMessage = (props: NoticeProps<SearchSuggestValue>) => {
  const { children, className, innerProps } = props
  return (
    <div className={cn('SearchSuggest__no-options', className)} {...innerProps}>
      {children}
    </div>
  )
}

const Menu = (props: MenuProps<SearchSuggestValue>) => {
  const {
    children,
    className,
    innerProps,
    selectProps: { inputValue = '' }
  } = props
  return inputValue.length === 0 || inputValue.length >= MIN_SEARCH_TEXT_LEN ? (
    <div className={cn('SearchSuggest__menu', className)} {...innerProps}>
      {children}
    </div>
  ) : null
}

const MenuList = (props: MenuListComponentProps<SearchSuggestValue>) => {
  const { children, className } = props

  return <div className={cn('SearchSuggest__menu-list', className)}>{children}</div>
}

const SelectContainer = (props: ContainerProps<SearchSuggestValue>) => {
  const { children, className, innerProps } = props
  const { isFocused } = props as unknown as ControlProps<SearchSuggestValue>
  return (
    <div className={cn('SearchSuggest__container', className)} {...innerProps}>
      <div
        className={cn('SearchSuggest__container-inner', {
          'SearchSuggest__container-inner--focus': isFocused as boolean
        })}>
        {children}
      </div>
    </div>
  )
}

export const SearchSuggest: React.FC<SearchSuggestProps> = (props) => {
  const { onSelect, people, domains } = props
  const [optionValue, setOptionValue] = useState<SearchSuggestValue | null>(null)
  const [inputValue, setInputValue] = useState<string>('')
  const [finalInputValue, setFinalInputValue] = useState<string>('')
  const ref = useRef<Select<SearchSuggestValue>>(null)
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        if (ref.current && !inputValue) {
          const { focusedOption } = ref.current.select.state
          if (focusedOption) {
            setInputValue(focusedOption.label)
          }
          event.preventDefault()
        }
      }
    },
    [inputValue, ref]
  )

  const components = useMemo(
    () => ({
      Control,
      DropdownIndicator: null,
      IndicatorsContainer,
      Menu,
      MenuList,
      NoOptionsMessage,
      Option,
      Placeholder,
      SelectContainer,
      SingleValue
    }),
    []
  )

  const searchText = inputValue || (optionValue ? optionValue.label : '')

  const dedupe = (values: SearchSuggestValue[]) => {
    const valuesArray: string[] = []
    const uniqueValues = values.filter((object: SearchSuggestValue) => {
      if (!valuesArray.includes(object.value)) {
        valuesArray.push(object.value)
        return object
      } else {
        return null
      }
    })
    return uniqueValues
  }

  const options = useMemo(() => {
    if (searchText.length >= MIN_SEARCH_TEXT_LEN) {
      const values = getOptions(people, searchText, domains)
      const uniqueValues = dedupe(values)

      return uniqueValues
    } else if (searchText.length === 0) {
      return getHistoryOptions()
    } else {
      return []
    }
  }, [people, searchText, domains])

  const handleChange = useCallback(
    (value, _) => {
      setOptionValue(value)
      if (value) {
        onSelect(value.value)
        const personSearchHistory = retrieveFromStorage<string[]>('personSearchHistory') || []
        setFinalInputValue(inputValue)
        Analytics.track('Search', {
          searchPhrase: inputValue
        })
        if (inputValue) {
          storeInStorage('personSearchHistory', union([inputValue], personSearchHistory))
        }
      }
    },
    [setOptionValue, onSelect, inputValue]
  )

  const handleInputChange = useCallback((input, { action }) => {
    if (!['input-blur', 'menu-close'].includes(action)) {
      setInputValue(input)
    }
  }, [])

  return (
    <div className='SearchSuggest'>
      <Select
        options={options}
        value={optionValue}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        isClearable={true}
        inputValue={inputValue}
        finalInputValue={finalInputValue}
        placeholder={UI_STRINGS.SEARCH.SEARCH_BY}
        noOptionsMessage={() => UI_STRINGS.SEARCH.NO_MATCHES_FOUND}
        components={components}
        tabSelectsValue={false}
        ref={ref}
      />
    </div>
  )
}

export default SearchSuggest
