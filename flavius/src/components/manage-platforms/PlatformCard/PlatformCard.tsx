import Button from 'components/elements/Button'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import { platformImages } from 'config'
import moment from 'moment'
import React from 'react'
import { getPlatformBasicData } from 'util/platforms'
import UI_STRINGS from 'util/ui-strings'
import PlatformCardLoading from './PlatformCardLoading'
import './PlatformCard.scss'

interface PlatformCardProps {
  platform: string
  connectedOn?: number
  isLoading?: boolean
  resources?: string
  email?: string
  isActive: boolean
  isInProgress: boolean
  onClickConnect?: () => void
  onClickDisconnect?: () => void
  canConnect: boolean
  account?: string
}

const PlatformInfo: React.FC<{ label: string; info?: React.ReactNode }> = ({ label, info }) => {
  if (!info) return null

  return (
    <div className='PlatformCard__info'>
      <Typography variant={TypographyVariant.LABEL}>{label}</Typography>
      {info}
    </div>
  )
}

const PlatformCard = (props: PlatformCardProps) => {
  const {
    connectedOn,
    isLoading,
    isActive,
    platform,
    isInProgress,
    email,
    account,
    onClickConnect,
    onClickDisconnect
  } = props

  let platformDetails: BasicPlatformData

  try {
    platformDetails = getPlatformBasicData(platform)
  } catch {
    platformDetails = { platformName: '', platformId: '', resourcesLink: '', canConnect: false }
  }

  const { platformId, platformName, resourcesLink, canConnect } = platformDetails

  if (isLoading) {
    return <PlatformCardLoading />
  }

  return (
    <div className='PlatformCard'>
      <div className='PlatformCard__header'>
        <img className='PlatformCard__icon' alt={platformId} src={platformImages[platformId]?.Icon} />
        <Typography variant={TypographyVariant.LABEL_LARGE}>{platformName}</Typography>
      </div>
      <PlatformInfo
        label={UI_STRINGS.PLATFORM_CARD.STATUS}
        info={<span>{isActive ? UI_STRINGS.PLATFORM_CARD.ACTIVE : UI_STRINGS.PLATFORM_CARD.INACTIVE}</span>}
      />
      <PlatformInfo label={UI_STRINGS.PLATFORM_CARD.ACCOUNT} info={account && <span>{account}</span>} />
      <PlatformInfo label={UI_STRINGS.PLATFORM_CARD.EMAIL} info={email && <span>{email}</span>} />
      <PlatformInfo
        label={UI_STRINGS.PLATFORM_CARD.CONNECTED_ON}
        info={connectedOn && <span>{moment(connectedOn && new Date(connectedOn)).format('LLLL')}</span>}
      />
      <PlatformInfo
        label={UI_STRINGS.PLATFORM_CARD.RESOURCES}
        info={resourcesLink && <a href={resourcesLink}>Onboarding Guide</a>}
      />
      {canConnect ? (
        <div className='PlatformCard__footer'>
          <Button
            isLoading={isInProgress}
            onClick={isActive ? onClickDisconnect : onClickConnect}
            action={isActive ? 'alert' : 'secondary'}
            text={`${
              isActive ? UI_STRINGS.PLATFORM_CARD.DISCONNECT : UI_STRINGS.PLATFORM_CARD.CONNECT
            } ${platformName}`}
          />
        </div>
      ) : null}
    </div>
  )
}

export default PlatformCard
