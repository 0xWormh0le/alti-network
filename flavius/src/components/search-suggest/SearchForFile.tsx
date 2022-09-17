import React, { useState, useRef, useEffect } from 'react'
import Select, { ValueType } from 'react-select'
import FormControl from 'components/elements/FormControl'
import { ReactComponent as SearchIcon } from 'icons/search.svg'
import UI_STRINGS from 'util/ui-strings'
import { platforms } from 'config'
import { useHistory } from 'react-router-dom'

type OptionType = {
  value: string
  label: string | undefined | null
}

const MIN_LENGTH = 10

interface SearchForFileProps {
  contentLoader: (fileId: string, platform: string) => void
  platform?: string
}

const SearchForFile: React.FC<SearchForFileProps> = ({ contentLoader, platform }) => {
  const options = platforms.map((platformObject: BasicPlatformData) => {
    return { value: platformObject.platformId, label: platformObject.platformName }
  })
  const defaultPlatform: OptionType = options.find((option: OptionType) => option.value === platform) || options[0]
  const [selectedOption, setSelectedOption]: [ValueType<OptionType>, (value: ValueType<OptionType>) => void] =
    useState<ValueType<OptionType>>(defaultPlatform)
  const [searchValue, setSearchValue] = useState('')
  const [searchOptionValue, setSearchOptionValue] = useState(platforms[0].platformId)
  const inputRef = useRef<HTMLInputElement>(null)
  const history = useHistory()
  const [buttonState, setButtonState] = useState('disabled')

  const selectChangeHandler = (option: ValueType<OptionType>) => {
    setSelectedOption(option)
    const optionSelected: OptionType = option as OptionType
    setSearchOptionValue(optionSelected.value)
    history.push({
      search: `platformId:${optionSelected.value}`
    })
    if (contentLoader) {
      contentLoader(searchValue, optionSelected.value)
    }
  }

  const onInputChange = (e: React.ChangeEvent<any>) => {
    const reg = new RegExp(/[^a-zA-Z0-9_-]/g)
    const val = e.target.value.replaceAll(reg, '')
    setSearchValue(val)
  }

  const buttonClickHandler = () => {
    if (contentLoader) {
      contentLoader(searchValue, searchOptionValue)
    }
  }

  const handleClear = () => {
    setSearchValue('')
  }

  useEffect(() => {
    if (searchValue.length >= MIN_LENGTH) {
      if (buttonState !== 'enabled') {
        setButtonState('enabled')
      }
    } else {
      if (buttonState === 'enabled') {
        setButtonState('disabled')
      }
    }
  }, [searchValue, buttonState, setButtonState])

  return (
    <div className='search-suggest-file-container'>
      <div>
        <div className='search-suggest-column-header'>{UI_STRINGS.SEARCH.SELECT_PLATFORM}</div>
        <div className='search-suggest-file-form-container'>
          <div>
            <Select
              options={options}
              onChange={selectChangeHandler}
              value={selectedOption}
              className='SearchPage__select'
            />
          </div>
        </div>
      </div>

      <div style={{ width: '100%' }}>
        <div>
          <div className='search-suggest-column-header'>{UI_STRINGS.SEARCH.SEARCH_BY_FILE_LABEL}</div>
          <div className='search-suggest-file-input-container'>
            <FormControl
              type='text'
              name='searchForName'
              placeholder={UI_STRINGS.SEARCH.SEARCH_FILE_PLACEHOLDER}
              value={searchValue}
              onChange={onInputChange}
              className='search-suggest-input-filetext'
              ref={inputRef}
            />
            <div className='search-suggest-file-clear-container'>
              {searchValue.length >= MIN_LENGTH && (
                <button className='search-suggest-file-clear-button' onClick={handleClear}>
                  &times;
                </button>
              )}
            </div>
            <div>
              <button
                type='button'
                className={`search-suggest-file-input-submit search-suggest-file-input-submit-${buttonState}`}
                disabled={buttonState === 'disabled'}
                onClick={buttonClickHandler}>
                <SearchIcon className='search-suggest-file-icon' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchForFile
