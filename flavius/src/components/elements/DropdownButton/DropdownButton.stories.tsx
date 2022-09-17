import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import DropdownButton, { DropdownButtonProps } from './DropdownButton'

export default {
  title: 'Elements/DropdownButton',
  component: DropdownButton
} as Meta

const Template: Story<DropdownButtonProps> = (args) => <DropdownButton {...args} />

export const Default = Template.bind({})
Default.args = {
  text: 'Actions Header',
  enabled: true,
  actions: [
    {
      title: 'Enabled Action1',
      actionEnabled: true,
      link: '',
      onClick: () => null
    },
    {
      title: 'Disabled Action',
      actionEnabled: false,
      link: '',
      onClick: () => null
    }
  ]
}

export const Disabled = Template.bind({})
Disabled.args = {
  enabled: false,
  text: 'Actions Header',
  actions: []
}
