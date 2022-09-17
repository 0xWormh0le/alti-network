import React from 'react'
import { render } from '@testing-library/react'

import { FilterPills, FilterPillsProps } from './FilterPills'
import { noop } from 'test/support/helpers'

describe('FilterPills', () => {
  it('renders correctly', () => {
    const props: FilterPillsProps = {
      selectedFilterIds: [1021, 2001],
      onRemoveFilter: noop
    }
    const { container } = render(<FilterPills {...props} />)
    expect(container).toMatchSnapshot()
  })
})
