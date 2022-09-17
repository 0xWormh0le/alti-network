import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import DateRange, { DateRangeProps } from './DateRange'

export default {
  title: 'Elements/DateRange',
  component: DateRange
} as Meta

const Template: Story<DateRangeProps> = (args) => <DateRange {...args} />

export const Default = Template.bind({})
Default.args = {
  from: 1,
  to: 2312312
}
