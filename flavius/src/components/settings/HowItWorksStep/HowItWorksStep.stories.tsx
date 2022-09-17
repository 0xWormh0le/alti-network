import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import HowItWorksStep, { HowItWorksStepProps } from './HowItWorksStep'

export default {
  title: 'Settings/HowItWorksStep',
  component: HowItWorksStep
} as Meta

const Template: Story<HowItWorksStepProps> = (args) => <HowItWorksStep {...args} />

export const Default = Template.bind({})
Default.args = {}
