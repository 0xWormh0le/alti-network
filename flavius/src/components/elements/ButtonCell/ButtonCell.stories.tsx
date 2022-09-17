import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import ButtonCell, { ButtonCellProps } from './ButtonCell'

export default {
  title: 'Elements/ButtonCell',
  component: ButtonCell
} as Meta

const Template: Story<ButtonCellProps> = (args) => <ButtonCell {...args} />

export const Default = Template.bind({})
Default.args = {
  value: {
    text: 'Button'
  }
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
  value: {
    text: 'Button'
  }
}
