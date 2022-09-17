import React from 'react'
import GoogleLoginIcon from 'icons/google-login'
import { GoogleLogin as ReactGoogleLogin } from 'react-google-login'
import config from 'config'
import { alertError } from 'util/alert'
import Spinner from 'components/widgets/Spinner'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import UI_STRINGS from 'util/ui-strings'
import './GoogleLogin.scss'

export interface GoogleLoginProps {
  handleSuccessResponse: (response: any) => void
  isLoading: boolean
}

interface RenderProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled: boolean
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ handleSuccessResponse, isLoading }) => (
  <ReactGoogleLogin
    clientId={config.google.oauthApiId}
    onSuccess={handleSuccessResponse}
    onFailure={(response: { error: string; details: string }) => {
      const { error } = response
      if (error !== 'popup_closed_by_user' && error !== 'idpiframe_initialization_failed') {
        alertError(UI_STRINGS.GOOGLE_LOGIN.INVALID_LOGIN)
      }
    }}
    prompt='consent'
    render={(renderProps: RenderProps) => (
      <div className='GoogleLogin'>
        <Typography
          variant={TypographyVariant.LABEL}
          component='button'
          className='GoogleLogin__button'
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            if (renderProps.disabled) {
              alertError(UI_STRINGS.GOOGLE_LOGIN.LOGIN_DISABLED)
            } else {
              renderProps?.onClick(event)
            }
          }}>
          {!isLoading && <GoogleLoginIcon className='GoogleLogin__icon' />}
          <span className='GoogleLogin__button__text'>
            {!isLoading ? (
              UI_STRINGS.GOOGLE_LOGIN.CONTINUE_WITH_GOOGLE
            ) : (
              <Spinner className='GoogleLogin__button__spinner' />
            )}
          </span>
        </Typography>
      </div>
    )}
  />
)

export default GoogleLogin
