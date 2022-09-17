import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import FormGroup, { FormGroupProps } from './FormGroup'
import FormControl from '../FormControl'
import FormLabel from '../FormLabel'

export default {
  title: 'Elements/FormGroup',
  component: FormGroup
} as Meta

const Template: Story<FormGroupProps> = (args) => <FormGroup {...args} />

export const Default = Template.bind({})
Default.args = {
  children: [
    <FormLabel key='1' htmlFor='foo' children={[<span key='3'>Label</span>]} />,
    <FormControl key='2' name='foo' />
  ]
}
