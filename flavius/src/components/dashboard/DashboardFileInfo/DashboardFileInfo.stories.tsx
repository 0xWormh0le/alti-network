import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import DashboardFileInfo, { DashboardFileInfoProps } from './DashboardFileInfo'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Dashboard/DashboardFileInfo',
  component: DashboardFileInfo
} as Meta

const Template: Story<DashboardFileInfoProps> = (args) => (
  <BrowserRouter>
    <DashboardFileInfo {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {
  file: {
    fileName: 'File',
    createdAt: 123123,
    createdBy: {
      name: {
        givenName: 'Bobbie'
      }
    },
    lastModified: 456780
  } as any
}
