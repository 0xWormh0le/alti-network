import { GENERAL_URLS } from 'api/endpoints'
import { API } from 'aws-amplify'
import { Auth } from 'aws-amplify'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import Button from 'components/elements/Button'
import UI_STRINGS from 'util/ui-strings'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import GoogleLogo from 'icons/google-logo.svg'
import MarketingFooter from 'components/google-app/MarketingFooter'
import GoogleProgressLoading from 'components/google-app/GoogleProgressLoading'
import { useAsyncState } from '@altitudenetworks/component-library'
import 'components/elements/Table/Table.scss'
import useGTM from 'util/hooks/useGTM'
import LoadingWedge from 'components/google-app/LoadingWedge'
import RiskAssessmentHeader from 'components/google-app/RiskAssessmentHeader'
import { routePathNames } from 'util/helpers'
import './GoogleApp.scss'

const renderDependingOnStatus = (status: number, onClick?: () => void) => {
  if (status === 0) {
    return (
      <div>
        <RiskAssessmentHeader />
        <div className='GoogleApp__initiate'>
          <Typography variant={TypographyVariant.H2}>
            {UI_STRINGS.GOOGLE_APP.ALL_SET}
            <img alt='Google' src={GoogleLogo} className='GoogleApp__google-logo' />
            {UI_STRINGS.GOOGLE_APP.WORKSPACE_ENVIRONMENT}
          </Typography>
        </div>
        <Button
          onClick={(e: React.MouseEvent) => {
            e.preventDefault()
            if (onClick) {
              onClick()
            }
          }}
          className='GoogleApp__start-button'
          text={UI_STRINGS.GOOGLE_APP.START_ASSESSMENT}
          action='primary'
        />
      </div>
    )
  }
  if (status === 1) {
    return (
      <div>
        <GoogleProgressLoading
          percentage={25}
          loadingWedgeText={UI_STRINGS.GOOGLE_APP.ESTABLISHING_CONNECTION}
          loadingBarText={UI_STRINGS.GOOGLE_APP.FORRESTER_STATS}
        />
      </div>
    )
  }

  if (status === 2) {
    return (
      <div>
        <GoogleProgressLoading
          percentage={50}
          loadingWedgeText={UI_STRINGS.GOOGLE_APP.CREATING_INFRA}
          loadingBarText={UI_STRINGS.GOOGLE_APP.FINANCES_ONLINE_STATS}
        />
      </div>
    )
  }

  if (status === 3) {
    const orgs = ['hackerone', 'bigpanda', 'us_democratic_party', 'astranis', 'accomplice', 'expel']
    return (
      <div>
        <GoogleProgressLoading
          loadingWedgeText={UI_STRINGS.GOOGLE_APP.PREPARING_DATA}
          loadingBarText={UI_STRINGS.GOOGLE_APP.GOOD_HANDS}
          percentage={72}
        />
        <div className='GoogleApp__org-showcase'>
          {orgs.map((org) => {
            return (
              <div key={org} className='GoogleApp__org'>
                <img src={`organizations/${org}.svg`} alt={org} />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (status === 4) {
    return (
      <div className='GoogleApp__loading-risks'>
        <LoadingWedge>Fetching your results</LoadingWedge>
      </div>
    )
  }

  return <div />
}

interface GoogleAppProps {
  authenticatedUser: AuthenticatedUser | null
}

const GoogleApp: React.FC<GoogleAppProps> = ({ authenticatedUser }) => {
  const loc = useLocation()
  const authCode = loc.search && new URLSearchParams(loc.search).get('code')

  useGTM()
  const [status, setStatus] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState<AuthenticatedUser | null>(authenticatedUser)
  useEffect(() => {
    if (!authCode || isAuthenticated) {
      // TODO: error handling
      return
    }
    // API.post('marketplace', `${GENERAL_URLS.MARKETPLACE}/gsuite/onboard`, {
    //   body: {
    //     authCode
    //   }
    // })
    fetch('http://localhost:4000/cycle', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        authCode
      })
    })
      .then((rs) => rs.json())
      .then((json) => {
        Auth.signIn(json.email).then((rs) => {
          const signInOpts = {
            username: rs.email,
            password: '',
            validationData: {
              app: 'google',
              token: json.idToken,
              expires_at: '' + rs.expiresAt,
              email: json.email,
              name: json.name
            }
          }
          Auth.sendCustomChallengeAnswer(rs, JSON.stringify(signInOpts)).then((_) => {
            Auth.currentUserInfo().then((user) => {
              setIsAuthenticated(user)
            })
          })
        })
      })
  }, [isAuthenticated, authCode])

  const [risksRs, , isLoading] = useAsyncState(() => {
    if (status !== 3 || !isAuthenticated) return null
    return API.get(
      'risks',
      `${GENERAL_URLS.RISKS}?order-by=datetime&sort=desc&page-size=3&page-count-last-updated=1624647361719&page-count-cache-ttl=3600&platform-ids=%5B%22gsuite%22%5D&page-number=1&platform-id=`,
      {}
    )
  }, [status, isAuthenticated, authCode])

  if (!authCode) return <Redirect to='/dashboard' />

  if (isLoading && isAuthenticated && status !== 3) setStatus(4)

  if (risksRs && risksRs.risks && isAuthenticated) {
    return <Redirect to={routePathNames.GOOGLE_RESULTS} />
  }

  return (
    <div className='GoogleApp'>
      {renderDependingOnStatus(status, () => {
        setStatus(1)
        setTimeout(() => {
          setStatus(1)
        }, 3500)
        setTimeout(() => {
          setStatus(2)
        }, 8000)
      })}
      <MarketingFooter />
    </div>
  )
}

export default GoogleApp
