import React, { useState, useEffect, useMemo, useCallback } from 'react'
import PageTitle from 'components/elements/PageTitle'
import Typography from 'components/elements/Typography'
import UI_STRINGS from 'util/ui-strings'
import Select, { ValueType } from 'react-select'
import SearchSuggest from 'components/search-suggest'
import { UserContextConsumer } from 'models/UserContext'
import { GENERAL_URLS } from 'api/endpoints'
import API from '@aws-amplify/api/lib'
import SpotlightContainer from 'components/spotlight/SpotlightContainer/SpotlightContainer'
import FileSearch from 'components/files/FileContainer/FileSearch'
import { getQueryString, pause } from 'util/helpers'
import { platforms } from 'config'
import { useHistory } from 'react-router-dom'
import './Search.scss'

export interface ISearchContext {
  platform: string
}

const platformContextDefault = {
  platform: platforms[0].platformId
}

export const SearchContext = React.createContext<ISearchContext>(platformContextDefault)

export enum SearchType {
  EMAIL = 'email',
  NAME = 'name',
  FILE = 'file'
}

type OptionType = {
  value: SearchType
  label: string
  searchLabel: string
}

export const getQuerySearchType = (querySearchType: SearchType) => {
  if (querySearchType === SearchType.EMAIL) {
    return getQueryString(`selected${querySearchType[0].toUpperCase()}${querySearchType.slice(1)}`)
  } else {
    return getQueryString(querySearchType)
  }
}

const Search = () => {
  const options: OptionType[] = useMemo(
    () => [
      {
        value: SearchType.EMAIL,
        label: UI_STRINGS.SEARCH.SEARCH_BY_EMAIL,
        searchLabel: UI_STRINGS.SEARCH.ENTER_EMAIL_ADDRESS
      },
      {
        value: SearchType.NAME,
        label: UI_STRINGS.SEARCH.SEARCH_BY_NAME,
        searchLabel: UI_STRINGS.SEARCH.ENTER_PERSONS_NAME
      },
      {
        value: SearchType.FILE,
        label: UI_STRINGS.SEARCH.SEARCH_BY_FILE,
        searchLabel: UI_STRINGS.SEARCH.SELECT_PLATFORM
      }
    ],
    []
  )

  const [selectedOption, setSelectedOption]: [ValueType<OptionType>, (value: ValueType<OptionType>) => void] = useState<
    ValueType<OptionType>
  >(getQueryString('file') ? options[2] : options[0])
  const [searchOption, setSearchOption] = useState(getQueryString('file') ? options[2].value : options[0].value)
  const [people, setPeople] = useState<IPerson[]>([])
  const [query, setQuery] = useState('')
  const [queryType, setQueryType] = useState<SearchType>(SearchType.EMAIL)
  const [personId, setPersonId] = useState('')
  const [platform, setPlatform] = useState(platforms[0].platformId)
  const [defaultValue, setDefaultValue] = useState('')
  const history = useHistory()

  const handleOptionChange = (option: ValueType<OptionType>) => {
    setPersonId('')
    setSelectedOption(option)
    setQuery('')
    const searchQuery = getQueryString((option as OptionType).value)

    // Do not clear the query if it's still relevant
    if (!searchQuery) {
      history.push({
        search: ''
      })
    }
  }
  useEffect(() => {
    const option = selectedOption as OptionType
    setSearchOption(option.value)
  }, [selectedOption, history, searchOption])

  useEffect(() => {
    const getPeople = async () => {
      const res = await API.get('people', `${GENERAL_URLS.PEOPLE}`, {})
      setPeople(res.people)
    }
    if (!people.length) {
      getPeople()
    }
  }, [platform, people])

  const clickPersonLoader = (type: SearchType, payload: string) => {
    setQueryType(type)
    setPersonId(payload)
  }

  const clickFileLoader = async (fileId: string, platformId: string) => {
    // first unload the FileSearch component by unsetting the query value
    if (platformId) {
      history.push({
        search: `file=${fileId}&platformId=${platformId}`
      })
    }
    // this is needed to keep the url updated before we update any other state variables or we will not get the file loaded
    await pause()
    setQuery('')
    setQueryType(SearchType.FILE)
    setQuery(fileId)
    setPlatform(platformId)
  }

  const setValueFromQueryParameter = useCallback(
    (parameter: SearchType) => {
      const queryValue = getQuerySearchType(parameter)
      if (queryValue) {
        setQueryType(parameter)
        setQuery(queryValue)
        const _selectedOption: OptionType =
          options.find((option: OptionType) => option.value === parameter) || options[0]
        setSelectedOption(_selectedOption)
        setDefaultValue(queryValue)
        return queryValue
      } else {
        return null
      }
    },
    [setQuery, setQueryType, options, setDefaultValue]
  )

  useEffect(() => {
    const emailFromParameter = setValueFromQueryParameter(SearchType.EMAIL)
    if (emailFromParameter) {
      setPersonId(emailFromParameter)
    } else {
      const fileFromParameter = setValueFromQueryParameter(SearchType.FILE)
      const platformId = getQueryString('platformId')
      if (fileFromParameter && platformId) {
        setPlatform(platformId)
        setQuery(fileFromParameter)
      }
    }
  }, [setValueFromQueryParameter])

  return (
    <div className='SearchPage'>
      <PageTitle title={UI_STRINGS.SEARCH.TITLE} />
      <Typography variant='body' weight='light' className='SearchPage__label'>
        {UI_STRINGS.SEARCH.SEARCH_BY_LABEL}
      </Typography>
      <div className='SearchPage__content'>
        <div className='SearchPage__search-container'>
          <div>
            <div className='search-suggest-column-header'>{UI_STRINGS.SEARCH.SELECT_SEARCH_TYPE}</div>
            <Select
              value={selectedOption}
              onChange={handleOptionChange}
              options={options}
              className='SearchPage__select'
            />
          </div>
          <div>
            <UserContextConsumer>
              {({ domains }) => (
                <SearchSuggest
                  domains={domains}
                  searchFor={searchOption}
                  searchData={people}
                  clickPersonLoader={clickPersonLoader}
                  clickFileLoader={clickFileLoader}
                  defaultValue={defaultValue}
                />
              )}
            </UserContextConsumer>
          </div>
        </div>
      </div>
      <div className='SearchPageComponent'>
        {queryType === SearchType.NAME && personId && <SpotlightContainer personId={personId} wrapperType='page' />}
        {queryType === SearchType.EMAIL && personId && <SpotlightContainer personId={personId} wrapperType='page' />}
        {queryType === SearchType.FILE && query && <FileSearch fileId={query} platformId={platform} />}
      </div>
    </div>
  )
}

export default Search
