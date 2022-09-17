import React from 'react'
import SearchForPerson, { SearchSuggestResult } from './SearchForPerson'
import SearchForFile from './SearchForFile'
import { getQueryString } from 'util/helpers'
import { SearchType } from 'pages/Search/Search'
import './SearchSuggest.scss'

interface SearchSuggestProps {
  searchFor: string
  searchData: IPerson[]
  domains?: string[]
  clickPersonLoader?: (type: SearchType, payload: any) => void
  clickFileLoader?: (fileId: string, platform: string) => void
  defaultValue?: string
}

const SearchSuggest: React.FC<SearchSuggestProps> = ({
  searchFor,
  searchData,
  domains,
  clickPersonLoader,
  clickFileLoader
}) => {
  const personContentLoader = (person: SearchSuggestResult) => {
    if (clickPersonLoader && person) {
      clickPersonLoader(SearchType.NAME, person.email)
    }
  }

  const fileContentLoader = (fileId: string, platform: string) => {
    if (clickFileLoader) {
      clickFileLoader(fileId, platform)
    }
  }

  return (
    <div>
      {searchFor === SearchType.NAME && (
        <SearchForPerson
          searchType={SearchType.NAME}
          searchData={searchData}
          contentLoader={personContentLoader}
          domains={domains}
        />
      )}
      {searchFor === SearchType.EMAIL && (
        <SearchForPerson
          searchType={SearchType.EMAIL}
          searchData={searchData}
          contentLoader={personContentLoader}
          domains={domains}
        />
      )}
      {searchFor === SearchType.FILE && (
        <SearchForFile contentLoader={fileContentLoader} platform={getQueryString('platformId') || ''} />
      )}
    </div>
  )
}

export default SearchSuggest
