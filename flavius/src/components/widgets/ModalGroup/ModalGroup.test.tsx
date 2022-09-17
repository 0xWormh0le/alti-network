import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import ModalGroup, { ModalGroupProps } from './ModalGroup'
import UI_STRINGS from 'util/ui-strings'
import noop from 'lodash/noop'

describe('ModalGroup', () => {
  it('renders correctly', () => {
    const props: ModalGroupProps = {
      confirmModalTitle: UI_STRINGS.EDIT_PERMISSIONS.CONFIRM_EDIT,
      processingModalTitle: UI_STRINGS.EDIT_PERMISSIONS.CONFIRM_EDIT,
      successModalTitle: UI_STRINGS.EDIT_PERMISSIONS.SUCCESS,
      failModalTitle: UI_STRINGS.EDIT_PERMISSIONS.ERROR,
      confirmModalMessage: UI_STRINGS.RESOLVE_RISK.NONE_CAN_BE_REMOVED,
      processingModalMessage: 'Removing Permission',
      successModalMessage: 'Success',
      failModalMessage: 'Fail',
      confirmModalVisible: true,
      processingModalVisible: false,
      successModalVisible: false,
      failModalVisible: false,
      onConfirm: noop,
      onCancel: noop,
      onProcessingConfirm: noop,
      onProcessingCancel: noop,
      onSuccessConfirm: noop,
      onSuccessCancel: noop,
      onFailConfirm: noop,
      onFailCancel: noop
    }

    const { container } = renderWithRouter(<ModalGroup {...props} />)
    expect(container).toMatchSnapshot()
  })
})
