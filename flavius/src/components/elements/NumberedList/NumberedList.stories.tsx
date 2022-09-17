import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import NumberedList, { NumberedListProps } from './NumberedList'

export default {
  title: 'Elements/NumberedList',
  component: NumberedList
} as Meta

const Template: Story<NumberedListProps> = (args) => <NumberedList {...args} />

export const Default = Template.bind({})
Default.args = {
  children: ['First', 'Second', 'Third'].map((v) => <div key={v}>{v}</div>)
}
