import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import SubmittingModalContent, { SubmittingModalContentProps } from './SubmittingModalContent'

export default {
  title: 'RiskSettings/SubmittingModalContent',
  component: SubmittingModalContent
} as Meta

const Template: Story<SubmittingModalContentProps> = (args) => <SubmittingModalContent {...args} />

export const Default = Template.bind({})
Default.args = {}

export const Adding = Template.bind({})
Adding.args = {
  action: 'add'
}
