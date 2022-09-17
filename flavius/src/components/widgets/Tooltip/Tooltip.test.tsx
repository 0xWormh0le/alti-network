import React from 'react'
import { render } from '@testing-library/react'

import { Tooltip, TooltipProps } from './Tooltip'

describe('Tooltip', () => {
  it('renders correctly', () => {
    const props: TooltipProps = {
      id: 'tooltip_id',
      text: 'Tooltip Title',
      secondaryText: 'Tooltip Content',
      placement: 'top',
      children: <div>I have a tooltip</div>
    }
    const { container } = render(<Tooltip {...props} />)
    expect(container).toMatchSnapshot()
  })
})
