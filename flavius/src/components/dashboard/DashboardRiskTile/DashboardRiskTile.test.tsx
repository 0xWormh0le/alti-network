import React from 'react'
import { render } from '@testing-library/react'
import { DashboardRiskTile, DashboardRiskTileProps } from './DashboardRiskTile'
import { BrowserRouter } from 'react-router-dom'

describe('DashboardRiskTile', () => {
  it('renders correctly', () => {
    const props: DashboardRiskTileProps = {
      count: 1000,
      label: 'risks associated',
      linkTo: '/',
      children: 'children test',
      title: 'title test'
    }

    // needs router since it contains a link
    const { container } = render(
      <BrowserRouter>
        <DashboardRiskTile {...props} />
      </BrowserRouter>
    )
    expect(container).toMatchSnapshot()
  })
})
