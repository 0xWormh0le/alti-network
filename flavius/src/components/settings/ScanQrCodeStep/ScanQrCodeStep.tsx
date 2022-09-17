import React from 'react'
import QRCode from 'qrcode.react'
import { Link } from 'react-router-dom'
import Button from 'components/elements/Button'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import UI_STRINGS from 'util/ui-strings'
import './ScanQrCodeStep.scss'

export interface ScanQrCodeStepProps {
  userName: string
  authCode: string
  onStepCompleted: () => void
}

const ScanQrCodeStep: React.FC<ScanQrCodeStepProps> = ({ userName, authCode, onStepCompleted }) => {
  const qrCodeValue = `otpauth://totp/AltitudeNetworks:${userName}?secret=${authCode}&issuer=AltitudeNetworks`

  return (
    <section className='ScanQrCodeStep TwoFactorAuthentication__step'>
      <Typography variant={TypographyVariant.H3} weight='semibold' className='ScanQrCodeStep__title'>
        {UI_STRINGS.SETTINGS.SCAN_QR_CODE}
      </Typography>
      <p>{UI_STRINGS.SETTINGS.FROM_SECURITY_APP_FOLLOW_THE_STEPS}</p>
      <p>
        {UI_STRINGS.SETTINGS.IF_YOU_DONT_HAVE_APP_YOU_WILL_NEED_TO_DOWNLOAD}{' '}
        <Link
          className='ScanQrCodeStep__link'
          to={{ pathname: 'https://authy.com/' }}
          target='_blank'
          rel='noopener noreferrer'>
          Authy
        </Link>{' '}
        or{' '}
        <Link
          className='ScanQrCodeStep__link'
          to={{ pathname: 'https://en.wikipedia.org/wiki/Google_Authenticator' }}
          target='_blank'
          rel='noopener noreferrer'>
          {UI_STRINGS.SETTINGS.GOOGLE_AUTHENTICATOR}
        </Link>
        .
      </p>
      <div className='ScanQrCodeStep__qr'>
        <QRCode value={qrCodeValue} renderAs='svg' size={260} />
      </div>
      <p>{UI_STRINGS.SETTINGS.CANT_SCAN_CODE_COPY_AND_PASTE}</p>
      <Typography variant={TypographyVariant.BODY_LARGE} weight='semibold' className='ScanQrCodeStep__code'>
        {authCode}
      </Typography>
      <Button
        className='ScanQrCodeStep__button'
        action='primary'
        text={UI_STRINGS.BUTTON_LABELS.NEXT}
        onClick={onStepCompleted}
      />
    </section>
  )
}

export default ScanQrCodeStep
