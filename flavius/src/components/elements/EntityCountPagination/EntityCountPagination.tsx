import React, { Fragment } from 'react'
import Pagination from '../Pagination'
import Button from 'components/elements/Button'
import UI_STRINGS from 'util/ui-strings'
import FormControl from '../FormControl'
import CONSTANTS from 'util/constants'
import './EntityCountPagination.scss'

interface EntityCountProps {
  entityCount: number
  pageNumber: number
  pageSize: number
  pageCount: number
  totalEntityCount?: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  onExportCsv?: () => void
  isLoadingExportCsv?: boolean
  hidePageNumbers?: boolean
}

const EntityCountPagination: React.FC<EntityCountProps> = (props) => {
  const {
    entityCount,
    onExportCsv,
    isLoadingExportCsv,
    pageCount,
    pageNumber,
    onPageChange,
    onPageSizeChange,
    pageSize,
    hidePageNumbers
  } = props
  const pageNumberInt = parseInt('' + pageNumber, 10)

  // const totalCount = totalEntityCount || (pageCount > 1 ? pageCount * pageSize : entityCount)

  return (
    <div className='EntityCountPagination'>
      <div>
        {onExportCsv && (
          <Button
            action='secondary'
            text={UI_STRINGS.BUTTON_LABELS.EXPORT_ALL}
            loadingText=''
            isLoading={isLoadingExportCsv}
            onClick={onExportCsv}
            className='EntityCountPagination__export-button'
          />
        )}
      </div>

      <div className='EntityCountPagination__pagination-info'>
        {!!entityCount && (
          <div className='EntityCountPagination__page-size EntityCountPagination__items-count'>
            {(onPageSizeChange && (
              <Fragment>
                <span>{UI_STRINGS.PAGING.DISPLAYING}</span>

                <div className='EntityCountPagination__controller'>
                  <FormControl
                    onChange={(e) => {
                      const value = (e.target as HTMLInputElement).value
                      onPageSizeChange(parseInt(value, 10))
                    }}
                    value={pageSize}
                    component='select'>
                    {CONSTANTS.PAGE_SIZE_CUTOFFS.map((num) => (
                      <FormControl key={`limit_option_${num}`} value={num} component='option'>
                        {num}
                      </FormControl>
                    ))}
                  </FormControl>
                </div>
                <span>{UI_STRINGS.PAGING.ITEMS_PER_PAGE}</span>
              </Fragment>
            )) || <span>{UI_STRINGS.PAGING.DISPLAY_ITEMS_PER_PAGE(pageSize)}</span>}
          </div>
        )}
        <Pagination
          pageCount={pageCount}
          pageNumber={pageNumberInt}
          onPageChange={onPageChange}
          hidePageNumbers={hidePageNumbers}
        />
      </div>
    </div>
  )
}

export default EntityCountPagination
