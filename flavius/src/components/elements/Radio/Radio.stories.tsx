import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import Radio, { RadioProps } from './Radio'

export default {
  title: 'Elements/Radio',
  component: Radio
} as Meta

const Template: Story<RadioProps> = (args) => <Radio {...args} />

export const Default = Template.bind({})
Default.args = {}

export const Checked = Template.bind({})
Checked.args = {
  checked: true
}

export const WithLabel = Template.bind({})
WithLabel.args = {
  labelText: 'Label'
}

export const WithRightLabel = Template.bind({})
WithRightLabel.args = {
  labelOnRight: true,
  labelText: 'Label'
}
