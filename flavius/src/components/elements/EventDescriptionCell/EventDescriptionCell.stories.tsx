import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import EventDescriptionCell, { EventDescriptionCellProps } from './EventDescriptionCell'
import { fileEventsResponse } from 'test/mocks'

export default {
  title: 'Elements/EventDescriptionCell',
  component: EventDescriptionCell
} as Meta

const Template: Story<EventDescriptionCellProps> = (args) => <EventDescriptionCell {...args} />

export const Default = Template.bind({})
Default.args = {
  fileEvent: fileEventsResponse.events[0] as any
}
