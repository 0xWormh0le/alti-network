import React from 'react'
import DropdownButton, { ActionType, DropdownButtonProps } from './DropdownButton'
import { renderWithRouter } from 'test/support/helpers'
import noop from 'lodash/noop'

describe('DonutChart', () => {
  it('renders correctly', () => {
    const action: ActionType = {
      onClick: noop,
      title: 'add',
      link: 'https://google.com',
      actionEnabled: true
    }

    const props: DropdownButtonProps = {
      text: 'dropdown button',
      actions: [action],
      enabled: false
    }
    const { container } = renderWithRouter(<DropdownButton {...props} />)
    expect(container).toMatchSnapshot()
  })
})
