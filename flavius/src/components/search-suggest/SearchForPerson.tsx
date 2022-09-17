import React, { useState, useEffect, useRef, useCallback } from 'react'
import FormControl from 'components/elements/FormControl'
import Button from 'components/elements/Button'
import { ReactComponent as SearchIcon } from 'icons/search.svg'
import VisibilityIndicator from 'components/elements/VisibilityIndicator'
import { BaseAvatar } from '@altitudenetworks/component-library/'
import CONSTANTS from 'util/constants'
import { isExternalEmail } from 'util/helpers'
import { useOnClickOutside } from 'util/hooks'
import { SearchType } from 'pages/Search/Search'
import { UI_STRINGS } from 'util/ui-strings'
import { isValidEmail } from 'util/helpers'

interface SearchForPersonProps {
  searchData: IPerson[]
  minCharToSearch?: number
  searchType: SearchType.EMAIL | SearchType.NAME
  contentLoader: (payload: SearchSuggestResult) => void
  domains?: string[]
}

export interface SearchSuggestResult {
  email: string
  name: string
  internal: boolean
  altnetId: string
  avatar?: Avatar
}

const TIMER = 100
const MIN_CHAR_TO_SEARCH = 3

const SearchForPerson: React.FC<SearchForPersonProps> = ({
  searchData,
  minCharToSearch = MIN_CHAR_TO_SEARCH,
  contentLoader,
  searchType,
  domains
}) => {
  const [value, setValue] = useState('')
  const [suggestResult, setSuggestResult] = useState<SearchSuggestResult | null>(null)
  const [minimumCharsToSearch] = useState(minCharToSearch)
  const [foundValues, setFoundValues] = useState<SearchSuggestResult[]>()
  const [canDisplayResults, setDisplayResults] = useState(false)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val: string = (e.target as HTMLInputElement).value
    setDisplayResults(val.length >= minCharToSearch)
    setValue(val)
    setSuggestResult(null)
  }

  const searchSuggestRef = useRef<HTMLInputElement>(null)
  useOnClickOutside(searchSuggestRef, () => {
    setDisplayResults(false)
  })

  const formatSearchResult = (text: string) => {
    const filterValue = value
    const reg = new RegExp(`(${filterValue})`, 'gi')
    const textParts = text.split(reg)
    return (
      <span style={{ fontWeight: 600 }}>
        {textParts.map((part: string, index: number) =>
          part.match(reg) ? (
            <span className='search-suggest-results-highlight' key={`search_highlight_${index}`}>
              {part}
            </span>
          ) : (
            <span className='search-suggest-results-normal' key={`search_highlight_${index}`}>
              {part}
            </span>
          )
        )}
      </span>
    )
  }

  useEffect(() => {
    const emailContainsString = (emailObject: Email, searchValue: string): boolean => {
      if (!emailObject) {
        return false
      }
      if (emailObject.address?.includes(searchValue)) {
        return true
      } else {
        return false
      }
    }

    const composeEmailObject = (email: string, _person: IPerson) => {
      return {
        email,
        name: _person?.name?.fullName || '',
        internal: !isExternalEmail(domains, email ?? ''),
        altnetId: _person?.altnetId || '',
        avatar: _person?.avatar
      }
    }

    const find = (_person: IPerson, searchValue: string) => {
      if (searchType === SearchType.EMAIL && _person) {
        const foundItemsArray: SearchSuggestResult[] =
          _person?.emails
            ?.filter((email: Email) => emailContainsString(email, searchValue))
            .map((email: Email) => composeEmailObject(email.address || '', _person)) || []

        if (_person?.primaryEmail?.address?.includes(searchValue)) {
          foundItemsArray.push(composeEmailObject(_person?.primaryEmail?.address || '', _person))
        }
        return foundItemsArray
      } else {
        if (
          _person?.name?.familyName.toLowerCase().includes(searchValue) ||
          _person?.name?.givenName.toLowerCase().includes(searchValue) ||
          _person?.name?.fullName.toLowerCase().includes(searchValue)
        ) {
          const emailFound: SearchSuggestResult[] =
            _person?.emails?.map((email: Email) => composeEmailObject(email.address || '', _person)) || []
          emailFound.push(composeEmailObject(_person?.primaryEmail?.address || '', _person))
          return emailFound
        } else {
          return null
        }
      }
    }

    // the if statements checking hasOwnProperty are necessary for tslint
    const doSearch = () => {
      if (searchData && canDisplayResults) {
        const _foundValues: SearchSuggestResult[] = []
        const _foundIds: string[] = []
        const _valueToSearch = value.toLowerCase()
        for (const key of Object.keys(searchData)) {
          if (searchData.hasOwnProperty(key)) {
            const person: IPerson = searchData[key]
            const itemFound = find(person, _valueToSearch)
            if (itemFound) {
              for (const idx in itemFound) {
                if (itemFound.hasOwnProperty(idx)) {
                  const item: SearchSuggestResult = itemFound[idx]
                  if (!_foundIds.includes(item.email || '')) {
                    _foundIds.push(item?.email || '')
                    _foundValues.push(item)
                  }
                }
              }
            }
          }
        }

        if (!_foundIds.includes(_valueToSearch) && searchType === SearchType.EMAIL && isValidEmail(_valueToSearch)) {
          _foundValues.push({
            email: _valueToSearch,
            name: _valueToSearch.split('@')[0],
            internal: !isExternalEmail(domains, _valueToSearch),
            altnetId: new Date().getTime().toString(),
            avatar: undefined
          })
        }

        setFoundValues(_foundValues)
        if (_foundValues) {
          setDisplayResults(true)
        }
      } else {
        setFoundValues([])
        setDisplayResults(false)
      }
    }
    const timer = window.setTimeout(() => {
      doSearch()
    }, TIMER)
    return () => window.clearTimeout(timer)
  }, [value, minimumCharsToSearch, setFoundValues, searchData, searchType, domains, canDisplayResults])

  const focus = () => {
    if (foundValues && foundValues.length) {
      setDisplayResults(true)
    }
  }

  const handleClear = () => {
    setDisplayResults(false)
    setFoundValues([])
    setValue('')
  }

  useEffect(() => {
    setDisplayResults(Boolean(foundValues && foundValues.length))
  }, [setDisplayResults, foundValues])

  const clickHandler = async (searchSuggestResult: SearchSuggestResult) => {
    setDisplayResults(false)
    if (searchType === SearchType.EMAIL) {
      setValue(searchSuggestResult.email)
    } else {
      setValue(searchSuggestResult.name)
    }
    setSuggestResult(searchSuggestResult)
  }

  const handleSearch = useCallback(() => {
    if (suggestResult) {
      contentLoader(suggestResult)
    }
  }, [contentLoader, suggestResult])

  return (
    <div className='search-suggest' ref={searchSuggestRef}>
      <div className='search-suggest-column-header'>
        {searchType === SearchType.EMAIL ? UI_STRINGS.SEARCH.ENTER_EMAIL_ADDRESS : UI_STRINGS.SEARCH.ENTER_PERSONS_NAME}
      </div>
      <div className='search-suggest__field'>
        <div className='search-suggest-input-container'>
          <SearchIcon className='search-suggest-input-icon' />
          <FormControl
            type='text'
            name='searchForName'
            placeholder={
              searchType === SearchType.NAME
                ? UI_STRINGS.SEARCH.SEARCH_NAME_PLACEHOLDER
                : UI_STRINGS.SEARCH.SEARCH_EMAIL_PLACEHOLDER
            }
            value={value}
            autoComplete='off'
            onChange={onChange}
            className='search-suggest-input-text'
            onFocus={focus}
          />
          {value.length >= minimumCharsToSearch && (
            <button className='search-suggest__clear' onClick={handleClear}>
              &times;
            </button>
          )}
        </div>
        <Button
          className='search-suggest__search'
          disabled={!suggestResult}
          action='primary'
          onClick={handleSearch}
          text={<SearchIcon />}
        />
      </div>
      {canDisplayResults && foundValues && foundValues.length > 0 && (
        <div className='search-suggest-results-container'>
          <div className='search-suggest-results'>
            {foundValues.map((searchSuggestResult: SearchSuggestResult, index: number) => {
              return (
                <div
                  className='search-suggest-results-row'
                  key={`${searchSuggestResult?.altnetId}-${index}`}
                  onClick={() => clickHandler(searchSuggestResult)}>
                  <div>
                    <BaseAvatar
                      style={{ margin: '0em 1em', fontSize: '0.75em', color: 'white' }}
                      src={searchSuggestResult ? searchSuggestResult?.avatar : undefined}
                      name={searchSuggestResult?.name || ''}
                      colorList={CONSTANTS.COLOR_LIST}
                    />
                  </div>
                  <div>{formatSearchResult(searchSuggestResult.name)}</div>
                  <div>{formatSearchResult(searchSuggestResult.email)}</div>
                  <div>
                    <VisibilityIndicator isInternal={searchSuggestResult.internal || false} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchForPerson
