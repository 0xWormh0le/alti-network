import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import DashboardPersonInfo, { DashboardPersonInfoProps } from './DashboardPersonInfo'
import { BrowserRouter } from 'react-router-dom'
import { UsageKind } from 'types/common'

export default {
  title: 'Dashboard/DashboardPersonInfo',
  component: DashboardPersonInfo
} as Meta

const Template: Story<DashboardPersonInfoProps> = (args) => (
  <BrowserRouter>
    <DashboardPersonInfo {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {
  person: {
    name: {
      givenName: 'Bobbie',
      familyName: 'Hawaii',
      fullName: 'Bobbie Hawaii'
    },
    displayName: 'BobbieHawaii',
    primaryEmail: {
      address: 'bobbie@thoughtlabs.io',
      kind: UsageKind.personal,
      primary: true,
      accessCount: 0,
      riskCount: 0,
      lastDeletedPermissions: 0
    },
    recoveryEmail: {
      address: 'test@email.com',
      kind: UsageKind.personal,
      primary: true,
      accessCount: 0,
      riskCount: 0,
      lastDeletedPermissions: 0
    },
    riskCount: 2,
    internal: false
  } as any
}
