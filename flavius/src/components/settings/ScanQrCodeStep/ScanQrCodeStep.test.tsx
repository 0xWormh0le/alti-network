import React from 'react'

import { renderWithRouter } from 'test/support/helpers'
import noop from 'lodash/noop'
import ScanQrCodeStep from './ScanQrCodeStep'

describe('ScanQrCodeStep', () => {
  it('renders correctly', () => {
    const localProps = {
      userName: 'test_user',
      authCode: '10293',
      onStepCompleted: noop
    }
    const { container } = renderWithRouter(<ScanQrCodeStep {...localProps} />)
    expect(container).toMatchSnapshot()
  })
})
