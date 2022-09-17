import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import Checkbox, { CheckboxProps } from './Checkbox'

export default {
  title: 'Elements/Checkbox',
  component: Checkbox
} as Meta

const Template: Story<CheckboxProps> = (args) => (
  <div style={{ width: '50%', margin: '5rem' }}>
    <Checkbox {...args} />
  </div>
)

export const Checked = Template.bind({})
Checked.args = {
  checked: true
}

export const Unchecked = Template.bind({})
Unchecked.args = {
  checked: false
}

export const WithLabel = Template.bind({})
WithLabel.args = {
  labelText: 'Check label'
}

export const WithLabelRight = Template.bind({})
WithLabelRight.args = {
  labelText: 'Check label',
  labelOnRight: true
}
