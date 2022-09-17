import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import FormLabel, { FormLabelProps } from './FormLabel'

export default {
  title: 'Elements/FormLabel',
  component: FormLabel
} as Meta

const Template: Story<FormLabelProps> = (args) => <FormLabel {...args} />

export const Default = Template.bind({})
Default.args = {
  htmlFor: 'foo',
  children: <span>Label</span>
}
