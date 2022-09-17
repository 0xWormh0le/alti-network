import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import CongratsStep from './CongratsStep'

export default {
  title: 'Settings/CongratsStep',
  component: CongratsStep
} as Meta

const Template: Story<any> = (args) => <CongratsStep {...args} />

export const Default = Template.bind({})
Default.args = {}
