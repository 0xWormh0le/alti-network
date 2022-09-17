import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import VerifyStep, { VerifyStepProps } from './VerifyStep'

export default {
  title: 'Settings/VerifyStep',
  component: VerifyStep
} as Meta

const Template: Story<VerifyStepProps> = (args) => <VerifyStep {...args} />

export const Default = Template.bind({})
Default.args = {}
