import React, { Fragment, useState, useMemo, useCallback, useEffect } from 'react'
import { ErrorBox, ModernTable } from '@altitudenetworks/component-library'
import PageTitle from 'components/elements/PageTitle'
import Filter, { FilterItem } from 'components/elements/Filter/Filter'
import { platformImages, platforms, riskTypeGroups } from 'config'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import RiskIndicator from 'components/elements/RiskIndicator'
import RiskDescriptionCell from 'components/risks/RiskDescriptionCell'
import Button from 'components/elements/Button'
import FileCell from 'components/elements/FileCell'
import PersonCell from 'components/elements/PersonCell'
import DateAndTimeCell from 'components/elements/DateAndTimeCell'
import TableLoading from 'components/elements/TableLoading'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import ActionsCell from 'components/risks/ActionsCell'
import {
  InformationalRiskTypeIds,
  SharingRiskTypeIds,
  RelationshipRiskTypeIds,
  ActivityRiskTypeIds
} from 'models/RiskCatalog'
import { resolvableRisk, mapper, handleSendEmail, alertableRisk, rowMapper, useCacheIncidentDates } from './riskUtils'
import { GENERAL_URLS } from 'api/endpoints'
import useRiskApiClient from 'api/clients/riskApiClient'
import { getCSVData } from 'util/csv'
import UI_STRINGS from 'util/ui-strings'
import { getFullPlatformIds } from 'util/platforms'
import { useQueryParam, useConfirmModal, useGetCachedPageSize } from 'util/hooks'
import { SensitiveContentStatus } from 'types/common'
import './Risks.scss'

const riskTypeGroupsForComponent = (
  riskTypeGroupsData: BasicRiskTypeGroup[],
  selected: boolean | ((data: BasicRiskTypeGroup) => boolean)
) =>
  riskTypeGroupsData.map((riskTypeGroup) => ({
    id: riskTypeGroup.groupType.toString(),
    value: riskTypeGroup.groupType.toString(),
    selected: typeof selected === 'function' ? selected(riskTypeGroup) : selected,
    renderComponent: (
      <div>
        <span style={{ marginLeft: '0.5rem' }}>{riskTypeGroup.name}</span>
      </div>
    )
  }))

const platformsForComponent = (
  platformsData: BasicPlatformData[],
  selected: boolean | ((data: BasicPlatformData) => boolean)
) =>
  platformsData.map((platform) => ({
    id: platform.platformId,
    value: platform.platformId,
    selected: typeof selected === 'function' ? selected(platform) : selected,
    renderComponent: (
      <div>
        <img src={platformImages[platform.platformId].Icon} alt={platform.platformName} />
        <span style={{ marginLeft: '0.5rem' }}>{platform.platformName}</span>
      </div>
    )
  }))

type StateFilterFunc = (selected: FilterUserVisibilityState) => FilterItem[]

const stateFilterData: StateFilterFunc = (selected) =>
  ['Active', 'Ignored', 'All'].map((label) => ({
    id: label.toLowerCase(),
    value: label.toLowerCase(),
    label,
    selected: label.toLowerCase() === selected
  }))

const defaultRiskTypeGroupFilterData = riskTypeGroupsForComponent(riskTypeGroups, true)

const defaultPlatformFilterData = platformsForComponent(platforms, true)

const initialPlatformIds = getFullPlatformIds()

const fields = ['Severity', 'Risk Type', 'Files At Risk', 'File Owner', 'Detected On']

// Translating between table and API
const orderingColumns = {
  'Detected On': 'datetime',
  Severity: 'severity'
}

const headerRow = [
  UI_STRINGS.CSV_HEADERS.SEVERITY,
  UI_STRINGS.CSV_HEADERS.RISK_TYPE,
  UI_STRINGS.CSV_HEADERS.FILES_AT_RISK,
  UI_STRINGS.CSV_HEADERS.LINK_INSPECTOR,
  UI_STRINGS.CSV_HEADERS.LINK_TO_FILE,
  UI_STRINGS.CSV_HEADERS.FILE_ID,
  UI_STRINGS.CSV_HEADERS.PLATFORM,
  UI_STRINGS.CSV_HEADERS.FILE_OWNER,
  UI_STRINGS.CSV_HEADERS.LINK_OWNERS_SPOTLIGHT,
  UI_STRINGS.CSV_HEADERS.DETECTED_ON
].join()

const riskTypes = ([] as number[])
  .concat(InformationalRiskTypeIds)
  .concat(SharingRiskTypeIds)
  .concat(RelationshipRiskTypeIds)
  .concat(ActivityRiskTypeIds)

const Risks: React.FC<{}> = () => {
  const [platformIds, setPlatformIds] = useQueryParam<string[]>('platformIds', initialPlatformIds, { pageNumber: 1 })
  const [riskTypeIds, setRiskTypeIds] = useQueryParam<number[]>('riskTypeIds', [], { pageNumber: 1 })
  const [pageNumber, setPageNumber] = useQueryParam<number>('pageNumber', 1)
  const [pageSize, setPageSize] = useGetCachedPageSize({ pageNumber: 1 })
  const [userVisibilityState, setUserVisibilityState] = useQueryParam<UserVisibilityState>(
    'userVisibilityState',
    'active',
    { pageNumber: 1 }
  )
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [orderBy, setOrderBy] = useState('Detected On')
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  const [isResolvingRisk, setIsResolvingRisk] = useState(false)
  const [displayRisksRs, setDisplayRisksRs] = useState(true) // same same risks data will be returned from useGetRisks and useUpdateRiskState, this flag is to determine whether to display the data from useGetRisks or not
  const showModal = useConfirmModal()

  const handleResetAllFilter = useCallback(() => {
    setPlatformIds(initialPlatformIds)
    setRiskTypeIds([])
    setUserVisibilityState('active')
  }, [setRiskTypeIds, setPlatformIds, setUserVisibilityState])

  const handleManagePermissions = useCallback((riskActionInfo: RiskAction) => {
    if (resolvableRisk(riskActionInfo)) {
      setIsResolvingRisk(false)
    }
  }, [])

  const { useGetRisks, useUpdateRiskState } = useRiskApiClient()

  const [risksRs, risksErr, isLoadingRisks] = useGetRisks({
    meta: {
      handleError: (err: any) => {
        const message: string = err.response.data.message
        throw new Error(message)
      },
      handleSuccess: () => {
        setDisplayRisksRs(true) // render the table with risksRs
      }
    },
    requestDetails: {
      pageNumber,
      pageSize,
      platformIds,
      riskTypeIds: riskTypeIds.map((x) => x.toString()),
      userVisibilityState,
      queryParams: {
        sort,
        orderBy: orderingColumns[orderBy]
      }
    }
  })
  const [updateRiskStateRs, updateRiskStateErr, isUpdatingRiskState, updateRiskState] = useUpdateRiskState({
    meta: {
      handleError: (err: any) => {
        const message: string = err.response.data.message
        throw new Error(message)
      },
      handleSuccess: () => {
        setDisplayRisksRs(false) // render the table with updateRiskStateRs
      }
    }
  })

  const cleanupIncidentDateCache = useCacheIncidentDates(risksRs)

  // Clean up cached incidents on dismount
  useEffect(() => {
    return () => {
      cleanupIncidentDateCache()
    }
  }, [cleanupIncidentDateCache])

  const displayRisks: DisplayRisk[] = risksRs?.risks.map(mapper) || []
  const risksData = displayRisksRs ? risksRs : updateRiskStateRs
  const hasError: boolean = Boolean(risksErr && !isLoadingRisks) || Boolean(updateRiskStateErr && !isUpdatingRiskState)
  const isLoadingTable: boolean = isLoadingRisks || isResolvingRisk || isUpdatingRiskState

  const riskTypeGroupsData = useMemo(() => {
    if (riskTypeIds.length) {
      const groups = riskTypeIds.map((riskTypeId) => Math.floor(riskTypeId / 1000))
      return riskTypeGroupsForComponent(riskTypeGroups, (data) => groups.includes(data.groupType))
    } else {
      return riskTypeGroupsForComponent(riskTypeGroups, true)
    }
  }, [riskTypeIds])

  const platformsData = useMemo(
    () => platformsForComponent(platforms, (data) => platformIds.includes(data.platformId)),
    [platformIds]
  )

  const onFilterPlatformChange = useCallback(
    (items: FilterItem[]) => {
      // update the platformIds in the query params
      setPlatformIds(items.filter((item) => item.selected).map((item) => item.value))
    },
    [setPlatformIds]
  )

  const onFilterRiskTypeGroupChange = useCallback(
    (items: FilterItem[]) => {
      // update the riskTypeIds in the query params
      const newRiskTypeGroups = items.filter((item) => item.selected).map((item) => item.value)

      if (newRiskTypeGroups.length === items.length) {
        setRiskTypeIds([])
      } else {
        setRiskTypeIds(riskTypes.filter((item) => newRiskTypeGroups.includes(Math.floor(item / 1000).toString())))
      }
    },
    [setRiskTypeIds]
  )

  const handleRiskStateChange = useCallback(
    (riskActionInfo: RiskAction, targetState: UserVisibilityState) => {
      const riskChangeArgs = {
        riskId: riskActionInfo.riskId,
        userVisibilityState: targetState,
        queryParams: {
          sort,
          orderBy: orderingColumns[orderBy],
          pageNumber,
          pageSize,
          platformIds,
          riskTypeIds: riskTypeIds.map((x) => x.toString()),
          userVisibilityState
        }
      }
      if (targetState === 'active') {
        showModal({
          message: (
            <Typography variant={TypographyVariant.H4}>{UI_STRINGS.RISKS.RISK_STATE_MODAL.ACTIVE_MESSAGE}</Typography>
          ),
          onConfirm: () => updateRiskState.call({ ...riskChangeArgs }),
          dialogTitle: UI_STRINGS.RISKS.RISK_STATE_MODAL.ACTIVE_TITLE,
          confirmButtonText: UI_STRINGS.BUTTON_LABELS.YES,
          cancelButtonText: UI_STRINGS.BUTTON_LABELS.CANCEL,
          confirmButtonActionType: 'primary',
          cancelButtonActionType: 'secondary'
        })
      } else {
        showModal({
          message: (
            <>
              <Typography variant={TypographyVariant.H4}>
                <p>{UI_STRINGS.RISKS.RISK_STATE_MODAL.IGNORE_MESSAGE}</p>
              </Typography>
              <p>{UI_STRINGS.RISKS.RISK_STATE_MODAL.IGNORE_DESC}</p>
            </>
          ),
          onConfirm: () => updateRiskState.call({ ...riskChangeArgs }),
          dialogTitle: UI_STRINGS.RISKS.RISK_STATE_MODAL.IGNORE_TITLE,
          confirmButtonText: UI_STRINGS.RISKS.RISK_STATE_MODAL.IGNORE_CONFIRM,
          cancelButtonText: UI_STRINGS.BUTTON_LABELS.CANCEL,
          confirmButtonActionType: 'alert',
          cancelButtonActionType: 'secondary'
        })
      }
    },
    [orderBy, pageNumber, pageSize, platformIds, userVisibilityState, riskTypeIds, showModal, sort, updateRiskState]
  )

  return (
    <div className='Risks'>
      <PageTitle title={UI_STRINGS.RISKS.TITLE} />

      <div className='Risks__risks'>
        <div className='Risks__header'>
          {platformsData && platformsData.length > 0 && (
            <Filter
              containerClass='Risks__header__filter'
              headerLabel='Platform'
              displayAllOption={true}
              tooltipText={UI_STRINGS.RISKS.TOOLTIP_FILTER}
              items={platformsData}
              resetItems={defaultPlatformFilterData}
              onSubmit={onFilterPlatformChange}
            />
          )}
          {riskTypeGroupsData && riskTypeGroupsData.length > 0 && (
            <Filter
              containerClass='Risks__header__filter'
              headerLabel='Risk Type'
              displayAllOption={true}
              tooltipText={UI_STRINGS.RISKS.TOOLTIP_FILTER}
              items={riskTypeGroupsData}
              resetItems={defaultRiskTypeGroupFilterData}
              onSubmit={onFilterRiskTypeGroupChange}
            />
          )}

          <Filter
            displayAllOption={false}
            headerLabel='State'
            items={stateFilterData(userVisibilityState)}
            isSingleSelect={true}
            onSubmit={(items) => setUserVisibilityState(items[0].value as UserVisibilityState)}
          />

          <Button action='simple' text={UI_STRINGS.BUTTON_LABELS.RESET} onClick={handleResetAllFilter} />
        </div>

        {hasError ? (
          risksErr?.error.includes('Only unconfigured') || updateRiskStateErr?.error.includes('Only unconfigured') ? (
            <ErrorBox secondaryMessage='' mainMessage={UI_STRINGS.ERROR_MESSAGES.NO_RESULTS} />
          ) : (
            <ErrorBox
              mainMessage={UI_STRINGS.ERROR_MESSAGES.SOMETHING_WRONG}
              secondaryMessage={UI_STRINGS.ERROR_MESSAGES.OUR_END}
            />
          )
        ) : (
          <Fragment>
            <ModernTable
              setSort={setSort}
              sort={sort}
              setOrderBy={setOrderBy}
              orderBy={orderBy}
              actions={(risk) => {
                const riskActionInfo: RiskAction = {
                  description: '',
                  email: risk.file.email,
                  file: risk.file,
                  platformId: risk.file.platformId,
                  plugin: {
                    id: risk.file.pluginId || '',
                    name: risk.file.pluginName || ''
                  },
                  userVisibilityState: risk.userVisibilityState,
                  riskId: risk.riskId,
                  riskTypeId: risk.riskTypeId,
                  webLink: risk.file.webLink,
                  owner: risk.owner
                }

                return (
                  <ActionsCell
                    onEmailAction={() => handleSendEmail(riskActionInfo)}
                    onManagePermissionsAction={() => handleManagePermissions(riskActionInfo)}
                    onIgnoreRiskAction={() => handleRiskStateChange(riskActionInfo, 'ignored')}
                    onPutBackToActiveAction={() => handleRiskStateChange(riskActionInfo, 'active')}
                    emailActionEnabled={alertableRisk(riskActionInfo)}
                    managePermissionsActionEnabled={resolvableRisk(riskActionInfo)}
                    onLockoutAction={() => null}
                    state={riskActionInfo.userVisibilityState as UserVisibilityState}
                    file={riskActionInfo.file}
                    riskId={riskActionInfo.riskId}
                    email={riskActionInfo.email}
                    riskTypeId={riskActionInfo.riskTypeId}
                    appId={riskActionInfo.plugin.id}
                    appName={riskActionInfo.plugin.name}
                    owner={riskActionInfo.owner}
                    platformId={riskActionInfo.platformId}
                  />
                )
              }}
              isLoading={isLoadingTable}
              loadingComponent={<TableLoading />}
              className='RisksTable'
              sortingHeaders={['Severity', 'Detected On']}
              items={displayRisks}
              fields={fields}
              scopedSlots={{
                Severity: (risk) => {
                  return <RiskIndicator value={risk.severity} />
                },
                'Risk Type': (risk) => {
                  return <RiskDescriptionCell displayRiskDescription={risk.description} />
                },
                'Files At Risk': (risk) => {
                  return (
                    <FileCell
                      sensitiveContentDetected={risk.sensitiveContent as SensitiveContentStatus}
                      fileResponse={risk.file}
                    />
                  )
                },
                'File Owner': (risk) => {
                  return <PersonCell personData={risk.owner} />
                },
                'Detected On': (risk) => {
                  return <DateAndTimeCell value={risk.datetime} />
                }
              }}
              rowClassName={(risk) => (risk.userVisibilityState === 'ignored' ? 'ignored-risk' : '')}
            />
            <EntityCountPagination
              onPageChange={setPageNumber}
              totalEntityCount={risksData?.riskCount || 0}
              entityCount={risksData?.risks?.length || 0}
              onExportCsv={() => {
                setIsExportingCsv(true)
                getCSVData(
                  {
                    baseUrl: `${GENERAL_URLS.RISKS}`,
                    dataKeyName: 'risks',
                    endpointName: 'risks',
                    pageSize: risksData?.pageSize || 0,
                    pageCount: risksData?.pageCount || 0,
                    queryParams: {
                      platformIds,
                      riskTypeIds,
                      userVisibilityState,
                      sort,
                      orderBy: orderingColumns[orderBy]
                    }
                  },
                  'Risks',
                  headerRow,
                  rowMapper
                ).then(() => setIsExportingCsv(false))
              }}
              isLoadingExportCsv={isExportingCsv}
              pageNumber={pageNumber}
              pageSize={pageSize}
              pageCount={risksData?.pageCount || 0}
              onPageSizeChange={setPageSize}
            />
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default Risks
