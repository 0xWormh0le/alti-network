import React from 'react'
import { render } from '@testing-library/react'

import { DashboardRiskTileLoading } from './DashboardRiskTileLoading'

describe('DashboardRiskTileLoading', () => {
  it('renders correctly', () => {
    const { container } = render(<DashboardRiskTileLoading />)
    expect(container).toMatchSnapshot()
  })
})
