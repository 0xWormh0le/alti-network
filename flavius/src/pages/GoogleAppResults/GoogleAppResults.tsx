import { ModernTable, useAsyncState } from '@altitudenetworks/component-library'
import CalendlyInlineWidget from 'components/Calendly/InlineWidget'
import DateAndTimeCell from 'components/elements/DateAndTimeCell'
import FileCell from 'components/elements/FileCell'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import RiskAssessmentHeader from 'components/google-app/RiskAssessmentHeader'
import { API } from 'aws-amplify'
import HubspotForm from 'components/hubspot/HubspotForm'
import React from 'react'
import UI_STRINGS from 'util/ui-strings'
import { GENERAL_URLS } from 'api/endpoints'
import TableLoading from 'components/elements/TableLoading'
import { Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { routePathNames } from 'util/helpers'
import './GoogleAppResults.scss'

interface GoogleAppResultsProps {
  authenticatedUser: AuthenticatedUser
}

const GoogleAppResults: React.FC<GoogleAppResultsProps> = ({ authenticatedUser }) => {
  const [risksRs, , isLoading] = useAsyncState(() => {
    if (!authenticatedUser) return null
    return API.get(
      'risks',
      `${GENERAL_URLS.RISKS}?order-by=datetime&sort=desc&page-size=3&page-count-last-updated=1624647361719&page-count-cache-ttl=3600&platform-ids=%5B%22gsuite%22%5D&page-number=1&platform-id=`,
      {}
    )
  }, [authenticatedUser]) as [{ riskCount: number; risks: any[] }, any, boolean]

  if (!authenticatedUser) return <Redirect to={`${routePathNames.GOOGLE_LOGIN}?nextPath=/google-results`} />

  return (
    <div className='GoogleAppResults'>
      <RiskAssessmentHeader />
      <div className='GoogleAppResults__assessment'>
        {isLoading || !risksRs ? (
          <TableLoading />
        ) : (
          <Fragment>
            <ModernTable
              className='GoogleAppResults__results'
              fields={['RISK TYPE', 'FILES AT RISK', 'DETECTED ON']}
              items={risksRs.risks}
              scopedSlots={{
                'RISK TYPE': (val) => {
                  return <span>{val.riskDescription}</span>
                },
                'FILES AT RISK': (val) => <FileCell fileResponse={val.file} />,
                'DETECTED ON': (val) => <DateAndTimeCell value={val.datetime} />
              }}
            />
            <div className='GoogleAppResults__teaser'>
              <Typography weight='bold' variant={TypographyVariant.BODY_LARGE}>
                {UI_STRINGS.GOOGLE_APP.WE_DISCOVERED(risksRs.riskCount)}
              </Typography>
              <Typography variant={TypographyVariant.BODY_SMALL}>{UI_STRINGS.GOOGLE_APP.LETS_TALK}</Typography>
            </div>
          </Fragment>
        )}
      </div>
      <HubspotForm formTitle={UI_STRINGS.GOOGLE_APP.CONTACT_US} />
      <CalendlyInlineWidget calendlyUrl='https://calendly.com/shaheen-5/60min' />
    </div>
  )
}

export default GoogleAppResults
