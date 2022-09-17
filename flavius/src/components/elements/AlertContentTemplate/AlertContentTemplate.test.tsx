import React from 'react'
import { render } from '@testing-library/react'

import noop from 'lodash/noop'
import { AlertContentTemplate, AlertContentTemplateProps } from './AlertContentTemplate'

describe('AlertContentTemplate', () => {
  it('renders correctly', () => {
    const props = {
      handleClose: noop,
      message: 'Login successful',
      condition: 'info',
      id: 'test-alert',
      styles: {},
      classNames: 's-alert',
      customFields: { description: 'You logged in successfully as test user' }
    } as AlertContentTemplateProps
    const { container } = render(<AlertContentTemplate {...props} />)
    expect(container).toMatchSnapshot()
  })
})
