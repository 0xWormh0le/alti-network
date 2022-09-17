import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import FormControl, { FormControlProps } from './FormControl'

export default {
  title: 'Elements/FormControl',
  component: FormControl
} as Meta

const Template: Story<FormControlProps> = (args) => <FormControl {...args} />

export const Default = Template.bind({})
Default.args = {}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true
}

export const Invalid = Template.bind({})
Invalid.args = {
  isInvalid: true
}

export const Readonly = Template.bind({})
Readonly.args = {
  readOnly: true
}

export const Shadowed = Template.bind({})
Shadowed.args = {
  variant: 'shadowed'
}

export const WithPlaceholder = Template.bind({})
WithPlaceholder.args = {
  placeholder: 'placeholder'
}

export const Color = Template.bind({})
Color.args = {
  type: 'date'
}
