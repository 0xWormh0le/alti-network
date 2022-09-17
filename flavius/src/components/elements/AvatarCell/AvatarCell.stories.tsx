import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import AvatarCell, { AvatarCellProps } from './AvatarCell'
import { UsageKind } from 'types/common'
import Person from 'models/Person'

export default {
  title: 'Elements/AvatarCell',
  component: AvatarCell
} as Meta

const Template: Story<AvatarCellProps> = (args) => <AvatarCell {...args} />

export const Default = Template.bind({})
Default.args = {
  person: {
    name: {
      givenName: 'Bobbie',
      familyName: 'Hawaii',
      fullName: 'Bobbie Hawaii'
    },
    displayName: 'Bobbie Hawaii',
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
  } as Person
}
