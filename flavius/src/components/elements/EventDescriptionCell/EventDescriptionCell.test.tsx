import React from 'react'
import { render } from '@testing-library/react'
import { EventDescriptionCell, EventDescriptionCellProps } from './EventDescriptionCell'
import { fileEventsResponse } from 'test/mocks'

describe('DateAndTimeCell', () => {
  it('renders correctly', () => {
    const props: EventDescriptionCellProps = {
      fileEvent: fileEventsResponse.events[0] as any
    }
    const { container } = render(<EventDescriptionCell {...props} />)
    expect(container).toMatchSnapshot()
  })
})
