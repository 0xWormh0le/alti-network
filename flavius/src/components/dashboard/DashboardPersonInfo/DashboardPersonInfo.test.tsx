import React from 'react'
import { personMock } from 'test/mocks'

import { renderWithRouter } from 'test/support/helpers'
import { DashboardPersonInfo, DashboardPersonInfoProps } from './DashboardPersonInfo'

describe('DashboardPersonInfo', () => {
  it('renders correctly', () => {
    const props: DashboardPersonInfoProps = {
      person: personMock
    }
    const { container } = renderWithRouter(<DashboardPersonInfo {...props} />)
    expect(container).toMatchSnapshot()
  })
})
