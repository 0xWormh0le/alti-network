import React, { useEffect, useMemo, useState } from 'react'
import ContentLoader from 'react-content-loader'
import FileSaver from 'file-saver'
import { ModernTable } from '@altitudenetworks/component-library'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import Checkmark from 'icons/checkmark'
import { csvFileName, pluralize, renderAttributeIfDev } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import './FileContentInspection.scss'

export interface FileContentInspectionProps {
  sensitiveKeywords: PhraseObject[]
  ccn: number
  ssn: number
  loading?: boolean
}

export interface FileContentPatternsProps {
  ccn: number
  ssn: number
}

export interface FileContentInspectionPhrase {
  count: number
  keyword: string
}

export interface FileContentInspectionPhrases {
  sensitiveKeywords?: FileContentInspectionPhrase[]
}

export interface PhraseObject {
  count: number
  keyword: string
}

export interface FileContentSensitivePhrasesPaginationProps {
  pageCount: number
  currentPage: number
  itemCount: number
  onPageChange: (page: number) => void
  sensitiveKeywords: []
}

const PAGE_SIZE = 5

const FileContentInspection: React.FC<FileContentInspectionProps> = ({ sensitiveKeywords, ccn, ssn, loading }) => {
  if (loading) {
    return <TableLoading />
  } else if (sensitiveKeywords) {
    return <FileContentInspectionComp sensitiveKeywords={sensitiveKeywords} ccn={ccn} ssn={ssn} />
  } else {
    return (
      <div className='FileContentInspectionTableWrapper__no-results'>
        <Typography
          variant={TypographyVariant.BODY_LARGE}
          className='FileContentInspectionTableWrapper__no-results-text'>
          {UI_STRINGS.SPOTLIGHT.NO_RESULT_FOUND}
        </Typography>
      </div>
    )
  }
}

export const FileContentInspectionComp: React.FC<FileContentInspectionProps> = ({
  sensitiveKeywords,
  ccn,
  ssn,
  loading
}) => {
  const [showPatterns, setShowPatterns] = useState(false)
  const [showSensitiveKeywords, setShowSensitiveKeywords] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  const pageCount = Math.ceil(sensitiveKeywords.length / PAGE_SIZE)

  const itemsInPage = useMemo(
    () =>
      sensitiveKeywords.filter(
        (item, index) => index >= (currentPage - 1) * PAGE_SIZE && index < currentPage * PAGE_SIZE
      ),
    [sensitiveKeywords, currentPage]
  )

  useEffect(() => {
    if (sensitiveKeywords) {
      setShowPatterns(ccn > 0 || ssn > 0)
      if (sensitiveKeywords.length) {
        setCurrentPage(1)
        setShowSensitiveKeywords(true)
      }
    }
  }, [sensitiveKeywords, ccn, ssn])

  return (
    <React.Fragment>
      {showPatterns && (
        <ModernTable
          fields={[UI_STRINGS.FILE.PATTERNS, UI_STRINGS.FILE.RESULTS]}
          className='FileContentInspectionTableWrapper'
          items={[
            { type: 'ssn', value: ssn },
            { type: 'ccn', value: ccn }
          ].filter((data) => data.value > 0)}
          scopedSlots={{
            [UI_STRINGS.FILE.PATTERNS]: (val) => (
              <div>{val.type === 'ccn' ? UI_STRINGS.RISKS.SENSITIVE_CCN : UI_STRINGS.RISKS.SENSITIVE_SSN}</div>
            ),
            [UI_STRINGS.FILE.RESULTS]: (val) =>
              val.type === 'ccn' ? (
                <div {...renderAttributeIfDev({ 'data-testid': 'ccnCount' })}>
                  {ccn} {pluralize('instance', val.value)} found
                </div>
              ) : (
                <div {...renderAttributeIfDev({ 'data-testid': 'ssnCount' })}>
                  {ssn} {pluralize('instance', val.value)} found
                </div>
              )
          }}
        />
      )}
      {showSensitiveKeywords && (
        <ModernTable
          fields={[UI_STRINGS.FILE.PHRASE, UI_STRINGS.FILE.EXACT_MATCH, UI_STRINGS.FILE.RESULTS]}
          className='FileContentInspectionTableWrapper FileContentInspectionTableWrapper--Phrase'
          items={itemsInPage}
          scopedSlots={{
            [UI_STRINGS.FILE.PHRASE]: (val: PhraseObject) => (
              <div
                className='FileContentInspectionTableWrapper__keywordLabel'
                {...renderAttributeIfDev({
                  'data-testid': `keyword-${itemsInPage.findIndex((item) => item.keyword === val.keyword)}`
                })}>
                {val.keyword}
              </div>
            ),
            [UI_STRINGS.FILE.EXACT_MATCH]: () => (
              <div className='center'>
                <Checkmark className='PhraseRow__icon' />
              </div>
            ),
            [UI_STRINGS.FILE.RESULTS]: (val: PhraseObject) => (
              <div>
                {val.count} {pluralize('instance', val.count)}
              </div>
            )
          }}>
          <EntityCountPagination
            onPageChange={setCurrentPage}
            entityCount={sensitiveKeywords.length}
            onExportCsv={() => onExportCSV(sensitiveKeywords as [])}
            pageNumber={currentPage}
            pageSize={PAGE_SIZE}
            pageCount={pageCount}
            hidePageNumbers={true}
          />
        </ModernTable>
      )}
    </React.Fragment>
  )
}

const onExportCSV = (sensitiveKeywords: []) => {
  const docTitle = csvFileName('Altitude_Export_Sensitive_Phrases')
  type IMapResponseToCSV = (_csvData: TableDisplay[]) => string
  const mapResponseToCSV: IMapResponseToCSV = (csvData: TableDisplay[]) => {
    let returnString = `Phrase,Exact Match,Results\n`
    csvData.forEach((item: any) => {
      returnString += `${item.keyword},Exact Match,${item.count}\n`
    })
    return returnString
  }
  const blob = new Blob([mapResponseToCSV(sensitiveKeywords)], { type: 'data:text/csv;charset=utf-8,' })
  FileSaver.saveAs(blob, docTitle)
}

const TableLoading = () => (
  <div className='FileContentInspectionTableWrapper__loader'>
    <ContentLoader
      backgroundColor='#f0f0f0'
      foregroundColor='#f7f7f7'
      width={360}
      height={90}
      className='ChartLoading'
      uniqueKey='ChartLoading'>
      <rect x='0' y='0' width='360' height='90' />
    </ContentLoader>
  </div>
)

export default FileContentInspection
