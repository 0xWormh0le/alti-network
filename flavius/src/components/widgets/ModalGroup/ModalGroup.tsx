import React from 'react'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import LoadingBar from 'components/elements/LoadingBar'
import ModalConfirmationDialog from 'components/widgets/ModalConfirmationDialog'
import successIcon from 'icons/modal-success.svg'
import failIcon from 'icons/modal-error.svg'
import UI_STRINGS from 'util/ui-strings'

export interface ModalGroupProps {
  confirmModalTitle: string
  processingModalTitle: string
  successModalTitle: string
  failModalTitle: string
  confirmModalMessage: string | JSX.Element
  processingModalMessage: string
  successModalMessage: string
  failModalMessage: string
  confirmModalVisible: boolean
  processingModalVisible: boolean
  successModalVisible: boolean
  failModalVisible: boolean
  confirmButtonDisabled?: boolean
  onConfirm: () => void
  onCancel: () => void
  onProcessingConfirm: () => void
  onProcessingCancel: () => void
  onSuccessConfirm: () => void
  onSuccessCancel: () => void
  onFailConfirm: () => void
  onFailCancel: () => void
}

export const ModalGroup: React.FC<ModalGroupProps> = ({
  confirmModalTitle,
  processingModalTitle,
  successModalTitle,
  failModalTitle,
  confirmModalMessage,
  processingModalMessage,
  successModalMessage,
  failModalMessage,
  confirmModalVisible,
  processingModalVisible,
  successModalVisible,
  failModalVisible,
  confirmButtonDisabled,
  onConfirm,
  onCancel,
  onProcessingConfirm,
  onProcessingCancel,
  onSuccessConfirm,
  onSuccessCancel,
  onFailConfirm,
  onFailCancel
}) => {
  return (
    <>
      {confirmModalVisible && (
        <ModalConfirmationDialog
          onConfirm={onConfirm}
          onCancel={onCancel}
          verticalAlign='top'
          confirmButtonText={UI_STRINGS.SENSITIVE_PHRASES.YES_REMOVE}
          cancelButtonText={UI_STRINGS.BUTTON_LABELS.CANCEL.toUpperCase()}
          confirmButtonActionType='primary'
          confirmButtonDisabled={confirmButtonDisabled}
          cancelButtonActionType='secondary'
          dialogTitle={confirmModalTitle}
          message={confirmModalMessage}
        />
      )}
      {processingModalVisible && (
        <ModalConfirmationDialog
          verticalAlign='top'
          dialogTitle={processingModalTitle}
          onConfirm={onProcessingConfirm}
          onCancel={onProcessingCancel}
          message={
            <div className='ConfirmPhraseModalContent'>
              <Typography variant={TypographyVariant.H3} className='SubmittingModalContent__text'>
                {processingModalMessage}
              </Typography>
              <LoadingBar />
            </div>
          }
        />
      )}
      {successModalVisible && (
        <ModalConfirmationDialog
          onConfirm={onSuccessConfirm}
          onCancel={onSuccessCancel}
          verticalAlign='top'
          confirmButtonText={UI_STRINGS.BUTTON_LABELS.OK}
          confirmButtonActionType='primary'
          dialogTitle={successModalTitle}
          message={
            <div className='ConfirmPhraseModalContent'>
              <div className='ModalIcon'>
                <img src={successIcon} alt='succeeded' />
              </div>
              <Typography variant={TypographyVariant.H4}>{successModalMessage}</Typography>
            </div>
          }
        />
      )}
      {failModalVisible && (
        <ModalConfirmationDialog
          onConfirm={onFailConfirm}
          onCancel={onFailCancel}
          verticalAlign='top'
          confirmButtonText={UI_STRINGS.BUTTON_LABELS.OK}
          confirmButtonActionType='primary'
          dialogTitle={failModalTitle}
          message={
            <div className='ConfirmPhraseModalContent'>
              <div className='ModalIcon'>
                <img src={failIcon} alt='failed' />
              </div>
              <Typography variant={TypographyVariant.H4}>{failModalMessage}</Typography>
            </div>
          }
        />
      )}
    </>
  )
}

export default ModalGroup
