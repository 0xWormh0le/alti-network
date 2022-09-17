import React from 'react'
import { render } from '@testing-library/react'

import CopyEmail from './CopyEmail'

describe('CopyEmail', () => {
  it('renders correctly', () => {
    const { container } = render(
      <CopyEmail email='sample@test.com'>
        <div>sample@test.com</div>
      </CopyEmail>
    )
    expect(container).toMatchSnapshot()
  })
})
