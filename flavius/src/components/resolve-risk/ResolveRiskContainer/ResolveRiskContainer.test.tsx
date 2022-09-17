import React from 'react'
import { act } from 'react-dom/test-utils'
import { renderWithRouter } from 'test/support/helpers'
import noop from 'lodash/noop'

// import { waitForElement } from '@testing-library/react'
import API from '@aws-amplify/api/lib'

import ResolveRiskContainer, { ResolveRiskContainerProps } from './ResolveRiskContainer'
import { filesAccessedResponse } from 'test/mocks'

jest.mock('@aws-amplify/api/lib')
let container: HTMLElement

describe('ResolveRiskContainer', () => {
  beforeEach(() => {
    const apiGet: any = API.get
    apiGet.mockResolvedValue(filesAccessedResponse)
  })

  it('renders correctly', async () => {
    const props: ResolveRiskContainerProps = {
      riskId: '1',
      fileCount: 9552,
      requestRisk: noop,
      email: 'bobbie@thoughtlabs.io'
    }
    await act(async () => {
      container = renderWithRouter(<ResolveRiskContainer {...props} />).container
      await new Promise((r) => setTimeout(r, 100))
      expect(container).toMatchSnapshot()
    })
  })
})
