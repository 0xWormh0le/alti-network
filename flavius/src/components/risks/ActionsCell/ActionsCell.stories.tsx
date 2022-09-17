import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import ActionsCell from './ActionsCell'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Risks/ActionsCell',
  component: ActionsCell
} as Meta

const Template: Story<any> = (args) => (
  <BrowserRouter>
    <ActionsCell {...args} />
  </BrowserRouter>
)

const fileData = new Map()
fileData.set('fileCount', 10)

export const Default = Template.bind({})
Default.args = {}

export const WithData = Template.bind({})
WithData.args = {
  email: 'bobbie@thoughtlabs.io',
  file: fileData,
  appName: 'foobar',
  appId: 'baz',
  riskId: '0',
  managePermissionsActionEnabled: true,
  riskTypeId: 10,
  emailActionEnabled: true,
  owner: {
    get: (x: any) => x
  }
}
