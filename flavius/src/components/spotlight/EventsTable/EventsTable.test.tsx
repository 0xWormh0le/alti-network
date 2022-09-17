import React from 'react'
import { act, RenderResult } from '@testing-library/react'

import EventsTable, { EventsTableProps } from './EventsTable'
import { GENERAL_URLS } from 'api/endpoints'
import { renderWithRouter } from 'test/support/helpers'
import UI_STRINGS from 'util/ui-strings'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => ({
    domains: ['email.com'],
    location: { search: '' }
  }) // mock history, location
}))

const props: EventsTableProps = {
  personId: 'john@thoughtlabs.io',
  eventType: 'personDownloads',
  sortingHeader: [UI_STRINGS.SPOTLIGHT.DATE_DOWNLOADED],
  fields: [
    UI_STRINGS.FILE.FILE_NAME,
    UI_STRINGS.DASHBOARD.OWNER,
    UI_STRINGS.TOOLTIP_IP.IP,
    UI_STRINGS.SPOTLIGHT.DATE_DOWNLOADED
  ],
  exportUrl: `${GENERAL_URLS.PERSON}/john@thoughtlabs.io/events?event-type=personDownloads`,
  csvHeaderRow: [
    'File Name',
    'File Inspector Link',
    'Storage Link',
    'File ID',
    'Platform',
    'Owner',
    'IP Address',
    'Date Downloaded'
  ]
}

describe('EventsTable', () => {
  let renderResult: RenderResult

  beforeEach(async () => {
    await act(async () => {
      renderResult = renderWithRouter(<EventsTable {...props} />)
    })
  })

  it('renders correctly', () => {
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })
})
