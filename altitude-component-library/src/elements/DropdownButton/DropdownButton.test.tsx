import React from 'react'
import DropdownButton, { ActionType, DropdownButtonProps } from './DropdownButton'
import { noop, renderWithRouter } from 'test/support/helpers'

describe('DonutChart', () => {
  it('renders correctly', () => {
    const action: ActionType = {
      onClick: noop,
      title: 'add',
      link: 'https://google.com',
      actionEnabled: true,
    }

    const props: DropdownButtonProps = {
      text: 'dropdown button',
      actions: [action],
      enabled: false,
    }
    const { container } = renderWithRouter(<DropdownButton {...props} />)
    expect(container).toMatchSnapshot()
  })
})
