import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import ScanQrCodeStep, { ScanQrCodeStepProps } from './ScanQrCodeStep'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Settings/ScanQrCodeStep',
  component: ScanQrCodeStep
} as Meta

const Template: Story<ScanQrCodeStepProps> = (args) => (
  <BrowserRouter>
    <ScanQrCodeStep {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {
  authCode: 'authCode',
  userName: 'bobbie'
}
