import React, { Fragment, useEffect, useState } from 'react'
import { GENERAL_URLS } from 'api/endpoints'
import API from '@aws-amplify/api/lib'

import DashboardFileInfo from '../DashboardFileInfo'
import DashboardPersonInfo from '../DashboardPersonInfo'
import DashboardRiskTile from '../DashboardRiskTile'
import DashboardRiskTileLoading from '../DashboardRiskTileLoading'
import Person from 'models/Person'
import SectionTitle from 'components/elements/SectionTitle'
import { useCancelablePromise } from 'util/hooks'
import { modalBasePath, searchWithoutModalParams } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import { useCallback } from 'react'
import './DashboardRiskInsights.scss'

export const INSIGHTS_ITEMS = [
  {
    title: UI_STRINGS.DASHBOARD.CREATOR_OF_MOST_RISKS,
    label: UI_STRINGS.DASHBOARD.RISKS_CREATED,
    key: 'mostRisksCreated',
    field: 'person',
    subnavKey: 'risksCreated'
  },
  {
    title: UI_STRINGS.DASHBOARD.FILE_WITH_MOST_RISKS,
    label: UI_STRINGS.DASHBOARD.RISKS_ASSOCIATED,
    key: 'highestRiskFile',
    field: 'file'
  },
  {
    title: UI_STRINGS.DASHBOARD.OWNER_OF_MOST_AT_RISK_FILES,
    label: UI_STRINGS.DASHBOARD.AT_RISK_FILES_OWNED,
    key: 'mostAtRiskFilesOwned',
    field: 'person',
    subnavKey: 'atRiskFilesOwned'
  },
  {
    title: UI_STRINGS.DASHBOARD.EXTERNAL_ACCOUNT_WITH_MOST_FILES,
    label: UI_STRINGS.DASHBOARD.FILES_ACCESSIBLE_BY_EXTERNAL,
    key: 'mostExternalAccess',
    field: 'person',
    subnavKey: 'filesAccessible'
  }
]

export const DashboardRiskInsights: React.FC<{}> = () => {
  const [insights, setInsights] = useState<{
    [key: string]: {
      loading: boolean
      riskInsight: Maybe<RiskInsight>
    }
  }>(Object.fromEntries(INSIGHTS_ITEMS.map((item) => [item.key, { riskInsight: null, loading: true }])))
  const cancelablePromise = useCancelablePromise()

  const handleRiskInsight = useCallback(
    async (key: string) => {
      try {
        const insight = await cancelablePromise(API.get('risks', `${GENERAL_URLS.RISKS}/tiles?category=${key}`, {}))
        setInsights((state) => {
          return {
            ...state,
            [key]: {
              loading: false,
              riskInsight: insight
            }
          }
        })
      } catch {
        setInsights((state) => {
          return {
            ...state,
            [key]: {
              loading: false,
              riskInsight: null
            }
          }
        })
      }
    },
    [setInsights, cancelablePromise]
  )

  useEffect(() => {
    INSIGHTS_ITEMS.forEach((insight) => handleRiskInsight(insight.key))
  }, [handleRiskInsight])

  return (
    <div className='DashboardRiskInsights'>
      {
        // Running this to prevent any rendering/function calls if every tile timed out
        // And prevent rendering the title
        !Object.values(insights).every((insight) => !insight.loading && insight.riskInsight === null) && (
          <Fragment>
            <SectionTitle titleText={UI_STRINGS.DASHBOARD.RISK_INSIGHTS} />
            <div className='DashboardRiskInsights__tiles'>
              {INSIGHTS_ITEMS.map((insightItem) => {
                const { title, key, label, subnavKey } = insightItem
                const { riskInsight, loading } = insights[key]
                let linkLocation = ''
                if (riskInsight === null && !loading) {
                  return null
                } else if (riskInsight?.file) {
                  linkLocation = `${modalBasePath()}/file/${encodeURIComponent(riskInsight.file.fileId)}?platformId=${
                    riskInsight.file.platformId
                  }${
                    riskInsight.file.createdBy.primaryEmail?.address
                      ? `&owner=${riskInsight.file.createdBy.primaryEmail?.address}`
                      : ``
                  }`

                  return (
                    <div key={key} className='DashboardRiskInsights__tile-item'>
                      <DashboardRiskTile title={title} label={label} count={riskInsight.count} linkTo={linkLocation}>
                        <DashboardFileInfo file={riskInsight.file} />
                      </DashboardRiskTile>
                    </div>
                  )
                } else if (riskInsight?.person) {
                  linkLocation = `${modalBasePath()}/spotlight/${encodeURIComponent(
                    riskInsight.person.primaryEmail?.address || '' // altnetId
                  )}${searchWithoutModalParams({
                    selectedSubNavKey: subnavKey
                  })}`
                  return (
                    <div key={key} className='DashboardRiskInsights__tile-item'>
                      <DashboardRiskTile title={title} label={label} count={riskInsight.count} linkTo={linkLocation}>
                        <DashboardPersonInfo person={new Person(riskInsight.person)} />
                      </DashboardRiskTile>
                    </div>
                  )
                } else {
                  return (
                    <div key={key} className='DashboardRiskInsights__tile-item'>
                      <DashboardRiskTileLoading key={key} />
                    </div>
                  )
                }
              })}
            </div>
          </Fragment>
        )
      }
    </div>
  )
}

export default DashboardRiskInsights
