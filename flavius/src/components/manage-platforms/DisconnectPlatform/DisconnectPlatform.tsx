import React from 'react'
import ModalConfirmationDialog from 'components/widgets/ModalConfirmationDialog'
import UI_STRINGS from 'util/ui-strings'
import { platformImages } from 'config'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import { getAllPlatformsBasicData } from 'util/platforms'
import './DisconnectPlatform.scss'

interface DisconnectPlatformProps {
  platformId: string
  onCancel: () => void
  onConfirm: () => void
}

const DisconnectPlatform: React.FC<DisconnectPlatformProps> = (props) => {
  const { platformId, onCancel, onConfirm } = props

  const allPlatforms = getAllPlatformsBasicData()
  const platform = allPlatforms.find((p) => p.platformId === platformId)
  if (!platform) return null

  const { platformName } = platform

  const Message = () => {
    return (
      <div className='DisconnectPlatform'>
        <div className='DisconnectPlatform__icons'>
          <img className='DisconnectPlatform__platform-icon' alt={platformId} src={platformImages[platformId].Icon} />
          <hr />
          <img className='DisconnectPlatform__altitude-icon' alt={'Altitude'} src='logo.png' />
        </div>
        <Typography variant={TypographyVariant.BODY_LARGE} weight={'bold'}>
          {UI_STRINGS.MANAGE_PLATFORMS.SURE_DISCONNECT(platformName)}
        </Typography>
      </div>
    )
  }

  return (
    <ModalConfirmationDialog
      confirmButtonText={UI_STRINGS.MANAGE_PLATFORMS.YES_DISCONNECT}
      cancelButtonText={UI_STRINGS.BUTTON_LABELS.CANCEL}
      cancelButtonActionType='secondary'
      confirmButtonActionType='primary'
      dialogTitle={'Confirmation'}
      onConfirm={onConfirm}
      onCancel={onCancel}
      message={<Message />}
    />
  )
}

export default DisconnectPlatform
