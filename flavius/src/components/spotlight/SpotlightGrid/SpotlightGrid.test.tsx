import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import noop from 'lodash/noop'
import { SpotlightGrid, SpotlightGridProps } from './SpotlightGrid'
import Person from 'models/Person'
import INITIAL_TABS from '../Tabs'

import { UsageKind, UserKind, AccessLevel } from 'types/common'

const person = new Person({
  name: {
    givenName: 'Test',
    familyName: 'User',
    fullName: 'Test User'
  },
  primaryEmail: {
    address: 'test@email.com',
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
  avatar: {
    url: 'avatar',
    url_etag: 'avatar'
  },
  accessCount: 0,
  riskCount: 0,
  emails: [],
  internal: true,
  internalCount: 1,
  externalCount: 1,
  altnetId: '',
  projectId: '',
  accessLevel: AccessLevel.member,
  userKind: UserKind.user,
  phones: [],
  externalIds: [],
  orgUnitPath: '',
  etag: '',
  isEnrolledInMFA: false,
  creationTime: 0,
  lastLoginTime: 0,
  lastModifiedTime: 0,
  notes: {
    content: '',
    content_type: ''
  }
})

jest.mock('react', () => {
  const ActualReact = jest.requireActual('react')
  return {
    ...ActualReact,
    useContext: () => ({ domains: ['email.com'] })
  }
})

describe('SpotlightGrid', () => {
  it('renders correctly', () => {
    const props: SpotlightGridProps = {
      personLoading: false,
      isLitePlatform: false,
      subNavTabs: INITIAL_TABS,
      selectedSubNavKey: INITIAL_TABS[0].seriesKey,
      onSubNavClick: noop,
      chartData: {
        labels: [],
        series: []
      },
      activePerson: person,
      renderDetailsTable: (personId) => <div>{personId} - modal</div>,
      onSelectedContactCardClick: noop,
      getData: noop,
      selectedEmail: 'test@email.com',
      subNavLoaded: true
    }
    const { container } = renderWithRouter(<SpotlightGrid {...props} />)
    expect(container).toMatchSnapshot()
  })
})
