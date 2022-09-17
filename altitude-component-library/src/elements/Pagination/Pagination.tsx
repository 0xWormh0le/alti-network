import React from 'react'

import PaginationItem, { PaginationItemVariant } from '../PaginationItem'
import PageNumberInput from '../PageNumberInput'
import TriangleLeft from '../../icons/triangle-left'
import TriangleRight from '../../icons/triangle-right'
import './Pagination.scss'

const MAX_VISIBLE_PAGE_COUNT = 5

const getPagingRange = (pageNumber: number, pageCount: number = 20): number[] => {
  const minPage = 1
  const length = Math.min(pageCount, MAX_VISIBLE_PAGE_COUNT)
  let start = pageNumber - Math.floor(length / 2)
  start = Math.max(start, minPage)
  start = Math.min(start, minPage + pageCount - length)

  return Array.from({ length }, (_, i) => start + i)
}

export interface PaginationProps {
  pageNumber: number
  totalCount: number
  pageSize: number
  onPageChange: (nextPage: number) => void
  hidePageNumbers?: boolean
}

const PaginationComponent: React.FC<PaginationProps> = ({
  pageNumber,
  totalCount,
  pageSize,
  onPageChange,
  hidePageNumbers
}) => {
  const pageCount = Math.round(totalCount / pageSize)
  const pages = getPagingRange(pageNumber, pageCount)

  return pageCount > 1 ? (
    <div className='Pagination'>
      {pageCount > MAX_VISIBLE_PAGE_COUNT && (
        <div className='Pagination__group'>
          <PaginationItem
            onPageChange={onPageChange}
            pageNumber={1}
            disabled={pageNumber === 1}
            variant={PaginationItemVariant.SIDE}>
            1
          </PaginationItem>
        </div>
      )}
      <div className='Pagination__group'>
        <PaginationItem
          aria-label='prev'
          onPageChange={onPageChange}
          pageNumber={pageNumber - 1}
          variant={PaginationItemVariant.ARROW}
          disabled={pageNumber === 1}>
          <TriangleLeft className='Pagination__arrow' />
        </PaginationItem>
        {!hidePageNumbers &&
          pages.map((page) => (
            <PaginationItem
              aria-label={page}
              onPageChange={onPageChange}
              key={page}
              active={pageNumber === page}
              pageNumber={page}
              variant={PaginationItemVariant.NUMBER}
            />
          ))}
        <PaginationItem
          aria-label='next'
          onPageChange={onPageChange}
          pageNumber={pageNumber + 1}
          variant={PaginationItemVariant.ARROW}
          disabled={pageNumber === pageCount}>
          <TriangleRight className='Pagination__arrow' />
        </PaginationItem>
      </div>
      {pageCount > MAX_VISIBLE_PAGE_COUNT && (
        <div className='Pagination__group'>
          <PaginationItem
            onPageChange={onPageChange}
            pageNumber={pageCount}
            disabled={pageNumber === pageCount}
            variant={PaginationItemVariant.SIDE}>
            {pageCount}
          </PaginationItem>
        </div>
      )}

      {pageCount > MAX_VISIBLE_PAGE_COUNT && <PageNumberInput onPageChange={onPageChange} pageCount={pageCount} />}
    </div>
  ) : null
}

export default PaginationComponent
