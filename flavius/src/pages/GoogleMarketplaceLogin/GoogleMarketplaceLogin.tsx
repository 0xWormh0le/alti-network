import Typography, { TypographyVariant } from 'components/elements/Typography'
import { Auth } from 'aws-amplify'
import RiskAssessmentHeader from 'components/google-app/RiskAssessmentHeader'
import React from 'react'
import GoogleLogin from 'components/authentication/GoogleLogin'
import UI_STRINGS from 'util/ui-strings'
import { configureAmplify } from 'api/apiConfiguration'
import { useState } from 'react'
import MarketingFooter from 'components/google-app/MarketingFooter'
import { SetAuthenticatedUser } from 'models/UserContext'
import { Redirect, useLocation } from 'react-router-dom'
import { routePathNames } from 'util/helpers'
import { alertError } from 'util/alert'
import './GoogleMarketplaceLogin.scss'

interface GoogleMarketplaceLoginProps {
  userHasAuthenticated: SetAuthenticatedUser
  authenticatedUser: AuthenticatedUser
}

const GoogleMarketplaceLogin: React.FC<GoogleMarketplaceLoginProps> = ({ userHasAuthenticated, authenticatedUser }) => {
  const [googleLoading, setGoogleLoading] = useState<boolean>(false)
  const [redirectReady, setRedirectReady] = useState<boolean>(!!authenticatedUser)
  const loc = useLocation()
  const params = loc.search && new URLSearchParams(loc.search)
  const nextPath = params && params.get('nextPath')

  const handleGoogleSuccess = (googleAuthSuccessResponse: GoogleAuthResponse) => {
    const { id_token, expires_at } = googleAuthSuccessResponse.tokenObj
    const { email, name } = googleAuthSuccessResponse.profileObj
    setGoogleLoading(true)
    configureAmplify(true)

    const signInOpts = {
      username: email,
      password: '',
      validationData: {
        app: 'google',
        token: id_token,
        expires_at: '' + expires_at,
        email,
        name
      }
    }

    Auth.signIn(email).then((signInData) => {
      Auth.sendCustomChallengeAnswer(signInData, JSON.stringify(signInOpts))
        .then(() => {
          Auth.currentUserInfo().then((user) => {
            userHasAuthenticated(user)
            setRedirectReady(true)
          })
        })
        .catch(() => {
          alertError('Could not login')
        })
        .finally(() => {
          setGoogleLoading(false)
        })
    })
  }

  if (authenticatedUser && redirectReady) {
    if (nextPath) return <Redirect to={nextPath} />
    else return <Redirect to={routePathNames.GOOGLE_RESULTS} />
  }

  return (
    <div className='GoogleMarketplaceLogin'>
      <RiskAssessmentHeader />
      <Typography weight='bold' variant={TypographyVariant.H2}>
        {UI_STRINGS.GOOGLE_APP.PLEASE_LOGIN}
      </Typography>
      <GoogleLogin handleSuccessResponse={handleGoogleSuccess} isLoading={googleLoading} />
      <MarketingFooter />
    </div>
  )
}

export default GoogleMarketplaceLogin
