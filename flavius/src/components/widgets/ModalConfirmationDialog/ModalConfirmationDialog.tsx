import React, { useEffect, useCallback } from 'react'
import { Modal } from 'react-router-modal'
import Actionbar from 'components/base/Actionbar'
import Button from 'components/elements/Button'
import cn from 'classnames'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import './ModalConfirmationDialog.scss'

export interface ModalConfirmationDialogProps {
  onConfirm?: () => void
  onCancel?: () => void
  message: string | JSX.Element
  confirmButtonText?: string
  confirmButtonActionType?: 'primary' | 'secondary' | 'alert'
  confirmButtonDisabled?: boolean
  cancelButtonActionType?: 'primary' | 'secondary' | 'cancel_primary' | 'cancel_secondary' | 'alert'
  cancelButtonText?: string
  dialogTitle?: string
  verticalAlign?: 'center' | 'top'
}

export const ModalConfirmationDialog: React.FC<ModalConfirmationDialogProps> = ({
  onConfirm,
  onCancel,
  message,
  confirmButtonText,
  confirmButtonActionType = 'alert',
  confirmButtonDisabled,
  cancelButtonActionType = 'cancel_secondary',
  cancelButtonText,
  dialogTitle = 'Confirm Action',
  verticalAlign = 'center'
}) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onCancel) {
        // ESCAPE key
        onCancel()
      }
    }

    document.addEventListener('keydown', onKeyDown, false)

    // Remove event listeners on cleanup
    return () => {
      document.removeEventListener('keydown', onKeyDown, false)
    }
  }, [onCancel])

  const handleConfirmClick = useCallback(() => {
    if (onConfirm) {
      onConfirm()
    }

    if (onCancel) {
      onCancel() // close modal after confirm action is triggered
    }
  }, [onConfirm, onCancel])

  return (
    <Modal
      className={cn('ModalConfirmationDialog', `ModalConfirmationDialog--${verticalAlign}`)}
      onBackdropClick={onCancel}>
      <Actionbar titleComponent={dialogTitle} closeButtonAction={onCancel} />
      <div className='ModalConfirmationDialog__main'>
        <Typography variant={TypographyVariant.BODY_LARGE} component='div' className='ModalConfirmationDialog__message'>
          {message}
        </Typography>
        <div className='ModalConfirmationDialog__buttons'>
          {confirmButtonText && (
            <Button
              className='ModalConfirmationDialog__button'
              action={confirmButtonActionType}
              text={confirmButtonText}
              disabled={confirmButtonDisabled}
              onClick={handleConfirmClick}
            />
          )}
          {cancelButtonText && (
            <Button
              className='ModalConfirmationDialog__button'
              text={cancelButtonText}
              action={cancelButtonActionType}
              onClick={onCancel}
            />
          )}
        </div>
      </div>
    </Modal>
  )
}

export default ModalConfirmationDialog
