import { API } from 'aws-amplify'
import moment from 'moment'
import * as Sentry from '@sentry/browser'
import FileSaver from 'file-saver'
import { createQueryStringParameters } from './helpers'
import CONSTANTS from './constants'

const { CSV_PAGE_SIZE, PAGE_COUNT_CACHE_TTL } = CONSTANTS

export const getCSVData = async (
  getDataParams: {
    endpointName: string
    baseUrl: string
    pageCount: number
    pageSize: number
    dataKeyName: string
    queryParams?: QueryParams
  },
  tableName: string,
  headerRow: string,
  rowMapper: (data: any) => string
) => {
  let csvData: unknown[] = []

  const totalSize = getDataParams.pageCount * getDataParams.pageSize
  const totalPageCount = Math.ceil(totalSize / CSV_PAGE_SIZE)

  try {
    let pageNumber = 1
    while (pageNumber <= totalPageCount) {
      const pagedQueryParams = {
        ...getDataParams.queryParams,
        pageNumber,
        pageSize: CSV_PAGE_SIZE,
        pageCountCacheTTL: PAGE_COUNT_CACHE_TTL
      }

      const serverResponse = await API.get(getDataParams.endpointName, getDataParams.baseUrl, {
        response: true,
        queryStringParameters: createQueryStringParameters(pagedQueryParams)
      })
      const serverResponseData: ServerResponseData<unknown> = serverResponse.data
      const paginatedCsvData: unknown[] = serverResponseData[getDataParams.dataKeyName]
      csvData = csvData.concat(paginatedCsvData)
      pageNumber++
    }
  } catch (error) {
    Sentry.captureException(error)
  } finally {
    if (csvData.length > 0) {
      const docTitle = `Altitude_Export_${tableName}_${moment().format('DD-MM-YYYY_HH-mm-ss')}.csv`
      const blob = new Blob([mapDataToCsv(csvData, headerRow, rowMapper)], { type: 'data:text/csv;charset=utf-8,' })
      FileSaver.saveAs(blob, docTitle)
    }
  }
}

/**
 *
 * @param csvData The raw data before mapping
 * @param headerRow stringified header row, NO space between commas e.g. `column header 1,column header 2,column header 3`
 * @param rowMapper row data mapper which also returns stringified row data, NO space between commas, e.g. `row 1 cell 1,row 1 cell 2,row 1 cell 3`
 * @returns mapped CSV data
 */
export const mapDataToCsv = <T extends unknown>(rawData: T[], headerRow: string, rowMapper: (data: T) => string) => {
  const csvContent = new Array<string>(rawData.length + 1)
  csvContent[0] = headerRow

  // Using old school for loop for extra performance
  for (let i = 0; i < rawData.length; i++) {
    csvContent[i + 1] = rowMapper(rawData[i])
  }

  return csvContent.join('\n')
}
