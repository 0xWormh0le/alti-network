import { noop } from 'lodash'
import React, { useContext } from 'react'
import { ModalConfirmationDialogProps } from 'components/widgets/ModalConfirmationDialog'

type ModalContextData = {
  show: (args: ModalConfirmationDialogProps) => void
  hide: () => void
}

export const ModalContext = React.createContext<ModalContextData>({
  show: noop,
  hide: noop
})

const useConfirmModal = (): ((args: ModalConfirmationDialogProps) => void) => {
  const { show, hide } = useContext(ModalContext)
  return ({ onCancel, ...other }) => show({ ...other, onCancel: hide })
}

export default useConfirmModal
