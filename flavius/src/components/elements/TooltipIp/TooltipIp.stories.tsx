import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import TooltipIp, { TooltipIpProps } from './TooltipIp'

export default {
  title: 'Elements/TooltipIp',
  component: TooltipIp
} as Meta

const Template: Story<TooltipIpProps> = (args) => <TooltipIp {...args} />

export const Default = Template.bind({})
Default.args = {
  ipAddress: '192.168.0.0'
}
