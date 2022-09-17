import React from 'react'
import { render } from '@testing-library/react'
import AvatarCell, { AvatarCellProps } from './AvatarCell'
import { UsageKind } from 'types/common'
import Person from 'models/Person'

describe('AvatarCell', () => {
  it('renders correctly', () => {
    const props: AvatarCellProps = {
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
    const { container } = render(<AvatarCell {...props} />)
    expect(container).toMatchSnapshot()
  })
})
