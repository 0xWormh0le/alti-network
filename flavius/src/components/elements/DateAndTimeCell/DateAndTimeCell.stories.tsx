import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import DateAndTimeCell, { DateAndTimeCellProps } from './DateAndTimeCell'

export default {
  title: 'Elements/DateAndTimeCell',
  component: DateAndTimeCell
} as Meta

const Template: Story<DateAndTimeCellProps> = (args) => <DateAndTimeCell {...args} />

export const Default = Template.bind({})
Default.args = {
  value: 1
}
