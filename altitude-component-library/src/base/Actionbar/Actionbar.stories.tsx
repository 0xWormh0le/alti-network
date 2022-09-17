import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import Actionbar, { ActionbarProps } from './Actionbar'

export default {
  title: 'Base/Actionbar',
  component: Actionbar,
  parameters: {
    actions: {
      handles: ['click']
    }
  }
} as Meta

const Template: Story<ActionbarProps> = (args) => <Actionbar {...args} />

export const CloseActionNotProvided = Template.bind({})
CloseActionNotProvided.args = {
  titleComponent: <p> Actionbar </p>
}

export const CloseActionProvided = Template.bind({})
CloseActionProvided.args = {
  titleComponent: <p> Actionbar </p>,
  closeButtonAction: () => null
}
