import React, { useState, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import useLitePlatformApiClient from 'api/clients/litePlatformApiClient'
import { ErrorBox, ModernTable } from '@altitudenetworks/component-library'
import Button from 'components/elements/Button'
import Filter from 'components/elements/Filter/Filter'
import FormControl from 'components/elements/FormControl'
import TableLoading from 'components/elements/TableLoading'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import DateAndTimeCell from 'components/elements/DateAndTimeCell'
import LiteFileCell from 'components/elements/FileCell/LiteFileCell'
import LiteEventDescriptionCell from 'components/elements/EventDescriptionCell/LiteEventDescriptionCell'
import LitePersonCell from 'components/elements/PersonCell/LitePersonCell'
import {
  fileActivityReducer,
  fileActivityInitialState,
  fileActivityInit,
  FileActivityActionType
} from './activityReducer'
import { isValidEmail } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import { getPlatformBasicData } from 'util/platforms'
import ArrowRight from 'icons/arrow-right.svg'
import { ActivityParams } from './Activity'
import CONSTANTS from 'util/constants'
import './Activity.scss'

const limitOptions: string[] = ['50', '100', '200']
const DEFAULT_PAGE_NUMBER: number = 1

const FileActivityFilter: React.FC = () => {
  const { platformId } = useParams<ActivityParams>()
  const [state, dispatch] = useReducer(fileActivityReducer, fileActivityInitialState, fileActivityInit)
  const { activityOptions, createdBefore, createdAfter, limit, accounts } = state
  const [invalidAccountIndecies, setInvalidAccountIndecies] = useState<number[]>([])
  const pageSize = CONSTANTS.DEFAULT_PAGE_SIZE
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER)
  const currentPlatform = getPlatformBasicData(platformId)

  const generateRequestDetails = (queryPramsToOverride?: QueryParams) => {
    const activityType: string = activityOptions
      .filter((option) => option.selected)
      .map((option) => option.value)
      .join()

    return {
      platformId,
      activityType,
      createdBefore,
      createdAfter,
      limit: Number(limit),
      accounts: accounts.join(),
      pageNumber,
      pageSize,
      ...queryPramsToOverride
    }
  }
  const { useGetLiteFileActivities } = useLitePlatformApiClient()
  const [activitiesRs, error, isLoading, getLiteFileActivities] = useGetLiteFileActivities({
    requestDetails: generateRequestDetails(),
    meta: {
      preventFirstCall: true,
      triggeringKeys: ['pageSize', 'pageNumber']
    }
  })

  const fields = ['Activity', 'File or Folder', 'Actor', 'Owner', 'Time of Activity']

  const validateAccounts = () => {
    const newInvalidAccountIndecies: number[] = []

    accounts.forEach((account, i) => {
      // we do allow empty value here
      if (account !== '' && !isValidEmail(account)) {
        newInvalidAccountIndecies.push(i)
      }
    })

    if (!newInvalidAccountIndecies.length) {
      getRecords()
    }

    setInvalidAccountIndecies(newInvalidAccountIndecies)
  }

  const getRecords = () => {
    getLiteFileActivities.call(generateRequestDetails({ pageNumber: DEFAULT_PAGE_NUMBER }))
    setPageNumber(DEFAULT_PAGE_NUMBER)
  }

  const handleFetchRecords = () => {
    // since only the accounts are user manual input, we only need to validate them
    validateAccounts()
  }

  return (
    <>
      <div className='Activity__filter'>
        <div className='Activity__filter-row'>
          <div className='Activity__filter-item'>
            <label>{UI_STRINGS.ACVITITY.FILTER_LABELS.FILE_ACTIVITY}</label>
            <Filter
              containerClass='Filter__FileActivity-container'
              dropdownClass='Filter__FileActivity-dropdown'
              headerLabel='Activity'
              displayAllOption={true}
              items={activityOptions}
              onSubmit={(items) =>
                dispatch({ type: FileActivityActionType.CHANGE_ACTIVITY_OPTIONS, payload: { items } })
              }
            />
          </div>
          <div className='Activity__filter-item'>
            <label>{UI_STRINGS.ACVITITY.FILTER_LABELS.TIME_OF_ACTIVITY}</label>
            <div className='Filter__DateRange-container'>
              <FormControl
                type='date'
                name='createdAfter'
                value={createdAfter}
                onChange={(e) =>
                  dispatch({
                    type: FileActivityActionType.CHANGE_CREATED_AFTER,
                    payload: { value: (e.target as HTMLInputElement).value }
                  })
                }
              />
              <img src={ArrowRight} alt='' />
              <FormControl
                type='date'
                name='createdBefore'
                value={createdBefore}
                onChange={(e) =>
                  dispatch({
                    type: FileActivityActionType.CHANGE_CREATED_BEFORE,
                    payload: { value: (e.target as HTMLInputElement).value }
                  })
                }
              />
            </div>
          </div>
          <div className='Activity__filter-item'>
            <label>{UI_STRINGS.ACVITITY.FILTER_LABELS.NUMBER_OF_ENTIRES}</label>
            <FormControl
              component='select'
              value={limit}
              onChange={(e) =>
                dispatch({
                  type: FileActivityActionType.CHANGE_LIMIT,
                  payload: { value: (e.target as HTMLInputElement).value }
                })
              }>
              {limitOptions.map((limitOption) => (
                <FormControl key={`limit_option_${limitOption}`} component='option' value={limitOption}>
                  {limitOption}
                </FormControl>
              ))}
            </FormControl>
          </div>
        </div>
        <div className='Activity__filter-row'>
          <div className='Activity__filter-item'>
            <label>{UI_STRINGS.ACVITITY.FILTER_LABELS.ASSOCIATED_USER_ACCOUNTS(currentPlatform.platformName)}</label>
            <ol className='Filter__AccountList'>
              {accounts.map((account, i) => (
                <li key={`account_${i}`} className='Filter__AccountList-item'>
                  <div className='Filter__AccountList-item__input-wrapper'>
                    <FormControl
                      type='email'
                      placeholder='Primary email'
                      value={account}
                      onChange={(e) =>
                        dispatch({
                          type: FileActivityActionType.CHANGE_ACCOUNT,
                          payload: { value: (e.target as HTMLInputElement).value, index: i }
                        })
                      }
                      isInvalid={invalidAccountIndecies.includes(i)}
                      errorMessage='The email address is invalid'
                    />
                  </div>
                  <Button
                    action='tertiary'
                    size='small'
                    text={UI_STRINGS.BUTTON_LABELS.REMOVE}
                    className='btn-remove'
                    onClick={() => dispatch({ type: FileActivityActionType.REMOVE_ACCOUNT, payload: { index: i } })}
                  />
                </li>
              ))}
            </ol>
            <Button
              action='secondary'
              size='small'
              text={UI_STRINGS.BUTTON_LABELS.ADD_A_NEW_ACCOUNT}
              onClick={() => dispatch({ type: FileActivityActionType.ADD_ACCOUNT })}
            />
          </div>
        </div>
        <hr />
        <div className='Activity__filter-actions'>
          <Button
            action='primary'
            text={UI_STRINGS.BUTTON_LABELS.FETCH_RECORDS}
            disabled={isLoading}
            onClick={handleFetchRecords}
          />
          <Button
            action='tertiary'
            text={UI_STRINGS.BUTTON_LABELS.RESET_FILTERS}
            disabled={isLoading}
            onClick={() =>
              dispatch({ type: FileActivityActionType.RESET, payload: { resetState: fileActivityInitialState } })
            }
          />
        </div>
      </div>

      {error && !isLoading ? (
        <ErrorBox
          mainMessage={UI_STRINGS.ERROR_MESSAGES.SOMETHING_WRONG}
          secondaryMessage={UI_STRINGS.ERROR_MESSAGES.OUR_END}
        />
      ) : (
        <>
          <ModernTable
            isLoading={isLoading}
            loadingComponent={<TableLoading />}
            className='RisksTable'
            items={activitiesRs?.events || []}
            fields={fields}
            scopedSlots={{
              Activity: (activity) => {
                return activity.eventName ? <LiteEventDescriptionCell eventName={activity.eventName} /> : null
              },
              'File or Folder': (activity) => {
                return activity.files?.length ? <LiteFileCell file={activity.files[0]} platformId={platformId} /> : null
              },
              Actor: (activity) => {
                return activity.actor ? <LitePersonCell person={activity.actor} platformId={platformId} /> : null
              },
              Owner: (activity) => {
                return activity.files?.length && activity.files[0].createdBy ? (
                  <LitePersonCell person={activity.files[0].createdBy} platformId={platformId} />
                ) : null
              },
              'Time of Activity': (activity) => {
                return activity.createdAt ? <DateAndTimeCell value={activity.createdAt} /> : null
              }
            }}
          />

          <EntityCountPagination
            entityCount={activitiesRs?.events.length || 0}
            onPageChange={(next) => setPageNumber(next)}
            pageCount={activitiesRs?.pageCount || 0}
            pageNumber={pageNumber}
            pageSize={activitiesRs?.pageSize || 0}
          />
        </>
      )}
    </>
  )
}

export default FileActivityFilter
