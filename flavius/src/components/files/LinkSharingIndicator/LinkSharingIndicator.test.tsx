import React from 'react'
import { render } from '@testing-library/react'
import { LinkSharingIndicator, LinkSharingIndicatorProps } from './LinkSharingIndicator'

describe('LinkSharingIndicator', () => {
  it('renders correctly', () => {
    const props: LinkSharingIndicatorProps = {
      value: 'group'
    }
    const { container } = render(<LinkSharingIndicator {...props} />)
    expect(container).toMatchSnapshot()
  })
})
