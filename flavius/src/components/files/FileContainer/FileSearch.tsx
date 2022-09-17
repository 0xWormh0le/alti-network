import React, { useEffect, useState } from 'react'
import FileContainer from 'components/files/FileContainer'
import UI_STRINGS from 'util/ui-strings'
import './FileSearch.scss'

interface FileSearchProps {
  fileId: string
  platformId: string
}

const FileSearch: React.FC<FileSearchProps> = ({ fileId, platformId }) => {
  const [isSearching, setIsSearching] = useState(true)
  const [searchError, setSearchError] = useState(false)
  const [cssClass, setCssClass] = useState('hidden')

  useEffect(() => {
    setIsSearching(true)
    setSearchError(false)
    setCssClass('hidden')
  }, [fileId, platformId])

  const onFileLoaded = (hasError: boolean) => {
    setIsSearching(false)
    if (hasError) {
      setSearchError(true)
      setCssClass('hidden')
    } else {
      setCssClass('visible')
    }
  }

  return (
    <div>
      {isSearching && (
        <div className={`file-search-container file-search-searching`}>{UI_STRINGS.SEARCH.SEARCHING_FOR_FILE}</div>
      )}
      {searchError && (
        <div className='file-search-container file-search-error'>{UI_STRINGS.SEARCH.FILE_NOT_LOCATED}</div>
      )}
      <div className={`file-search-${cssClass}`}>
        <FileContainer fileId={fileId} isFolder={false} onFileLoaded={onFileLoaded} />
      </div>
    </div>
  )
}

export default FileSearch
