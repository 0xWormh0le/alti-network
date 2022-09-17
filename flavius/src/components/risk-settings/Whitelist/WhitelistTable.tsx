import React from 'react'
import cx from 'classnames'
import ContentLoader from 'react-content-loader'
import { ModernTable } from '@altitudenetworks/component-library'
import Button from 'components/elements/Button'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import UI_STRINGS from 'util/ui-strings'
import { retrieveFromStorage } from 'util/storage'
import './WhitelistTable.scss'

export interface WhitelistTableProps<TResponse, TData> {
  className?: string
  column: string
  pageNumber: number
  isLoading: boolean
  response: TResponse | null
  onDelete: (val: TData) => void
  mapResponseToData: (value: TResponse) => TData[]
  render: (value: TData) => React.ReactNode
  onPageChange: (value: number) => void
  useAllowDelete?: boolean
}

const storedDomains = retrieveFromStorage<string[]>('domains')

const WhitelistTable = <
  TResponse extends WhitelistedDomainsResponse | WhitelistedAppsResponse | InternalDomainsResponse,
  TData extends RiskSettingsDomain | RiskSettingsApp
>({
  className,
  column,
  mapResponseToData,
  pageNumber,
  onPageChange,
  isLoading,
  response,
  onDelete,
  useAllowDelete,
  render
}: WhitelistTableProps<TResponse, TData>) => (
  <ModernTable
    isLoading={isLoading}
    loadingComponent={<WhitelistTableLoading />}
    className={cx('WhitelistItem', className)}
    items={response ? mapResponseToData(response) : []}
    fields={[column]}
    scopedSlots={{ [column]: render }}
    actions={(val) => {
      const domainVal = (val as RiskSettingsDomain)?.domain
      if (useAllowDelete) {
        if (!(val as RiskSettingsDomain)?.allowDelete) {
          return null
        }
      } else {
        if (domainVal && storedDomains?.includes(domainVal)) return null
      }

      return (
        <Button
          className='WhitelistTable__delete'
          action='submit'
          onClick={() => onDelete(val)}
          text={UI_STRINGS.BUTTON_LABELS.DELETE}
        />
      )
    }}
    noResultsMessage={UI_STRINGS.ERROR_MESSAGES.NO_ENTRIES}>
    <EntityCountPagination
      totalEntityCount={response ? response.pageSize * response.pageCount : 0}
      entityCount={response ? response.pageSize : 0}
      onPageChange={onPageChange}
      pageCount={response?.pageCount || 0}
      pageNumber={Number(pageNumber)}
      pageSize={response?.pageSize || 0}
    />
  </ModernTable>
)

const WhitelistTableLoading = () => (
  <ContentLoader
    backgroundColor='#F0F0F0'
    foregroundColor='#F7F7F7'
    height={400}
    width='100%'
    uniqueKey='AppSpotlightAppImage__title'>
    <rect x={0} y={0} width='100%' height={300} rx={4} ry={4} />
  </ContentLoader>
)

export default WhitelistTable
