import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import DisableStep, { DisableStepProps } from './DisableStep'

export default {
  title: 'Settings/DisableStep',
  component: DisableStep
} as Meta

const Template: Story<DisableStepProps> = (args) => <DisableStep {...args} />

export const Default = Template.bind({})
Default.args = {}
