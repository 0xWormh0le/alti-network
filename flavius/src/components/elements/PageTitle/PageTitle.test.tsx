import React from 'react'
import { render } from '@testing-library/react'

import PageTitle from './PageTitle'

describe('PageTitle', () => {
  it('renders correctly', () => {
    const props = {
      title: 'Sample Page Title',
    }
    const { container } = render(<PageTitle {...props} />)
    expect(container).toMatchSnapshot()
  })
})
