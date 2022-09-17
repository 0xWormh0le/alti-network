import React from 'react'
import { render } from '@testing-library/react'

import noop from 'lodash/noop'
import { ModalConfirmationDialog, ModalConfirmationDialogProps } from './ModalConfirmationDialog'

describe('ModalConfirmationDialog', () => {
  it('renders correctly', () => {
    const props: ModalConfirmationDialogProps = {
      onConfirm: noop,
      onCancel: noop,
      message: 'Confirm message',
      confirmButtonText: 'Confirm',
      confirmButtonActionType: 'primary',
      cancelButtonText: 'Cancel',
      dialogTitle: 'Confirm Dialog'
    }
    const { container } = render(<ModalConfirmationDialog {...props} />)
    expect(container).toMatchSnapshot()
  })
})
