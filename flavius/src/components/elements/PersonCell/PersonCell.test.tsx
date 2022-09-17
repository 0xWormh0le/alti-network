import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import { PersonCell, PersonCellProps } from './PersonCell'

import { UsageKind } from 'types/common'
import { toJs } from 'util/helpers'
import { UserContextProvider } from 'models/UserContext'

const avatar = {
  url: 'http://i.pravatar.cc/200?img=15',
  url_etag: 'http://i.pravatar.cc/200?img=15'
}

const mail = {
  address: 'joe@thoughtlabs.io',
  kind: UsageKind.personal,
  primary: true,
  accessCount: 0,
  riskCount: 0,
  lastDeletedPermissions: 0
}

const MULTIPLE_OWNER_FILE_MOCK: FileOwner & IPerson = {
  name: {
    givenName: 'Joe',
    familyName: 'Schmough',
    fullName: 'Joe Schmough'
  },
  primaryEmail: mail,
  recoveryEmail: mail,
  avatar,
  internalCount: 1,
  externalCount: 0,
  emails: [],
  internal: true,
  accessCount: 0,
  riskCount: 99,
  riskTypeId: 20,
  fileCount: 2,
  altnetId: '',
  projectId: '',
  accessLevel: 0,
  userKind: 1,
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
}

const MULTIPLE_OWNER_THOUSANDS_RISK_TYPE_FILE_MOCK: FileOwner = {
  name: {
    givenName: 'Joe-long-name-example-for-test',
    familyName: 'Schmough',
    fullName: 'Joe Schmough'
  },
  primaryEmail: mail,
  recoveryEmail: mail,
  avatar,
  internalCount: 1,
  externalCount: 0,
  emails: [],
  internal: true,
  accessCount: 0,
  riskCount: 99,
  riskTypeId: 1020,
  fileCount: 0,
  altnetId: '',
  projectId: '',
  accessLevel: 0,
  userKind: 1,
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
    contentType: ''
  }
}

const ANONYMOUS_PERSON: FileOwner = {
  ...MULTIPLE_OWNER_FILE_MOCK,
  name: null,
  primaryEmail: null,
  riskTypeId: null,
  fileCount: 0
}

describe('PersonCell', () => {
  it('renders correctly', () => {
    const props: PersonCellProps = {
      personData: MULTIPLE_OWNER_THOUSANDS_RISK_TYPE_FILE_MOCK
    }
    const { container } = renderWithRouter(<PersonCell {...props} />)
    expect(container).toMatchSnapshot()
  })
  it('renders the string "Mutiple" for multiple file owners', () => {
    const props: PersonCellProps = {
      personData: toJs(MULTIPLE_OWNER_FILE_MOCK)
    }
    const { container } = renderWithRouter(<PersonCell {...props} />)
    expect(container.querySelector('.PersonCell__full-name')).toHaveTextContent('Multiple')
  })

  it('renders the owner for mult-file risks grouped by file owner', () => {
    const props: PersonCellProps = {
      personData: MULTIPLE_OWNER_THOUSANDS_RISK_TYPE_FILE_MOCK
    }
    const { container } = renderWithRouter(<PersonCell {...props} />)
    expect(container.querySelector('.PersonCell__email')?.clientWidth).toBeLessThan(100)
    // expect(container.querySelector('.PersonCell__name')?.clientWidth).toBeLessThan(100)
    // expect(container.querySelector('.PersonCell__full-name')).toHaveTextContent(
    //   'Joe-long-name-example-for-test Schmough'
    // )
  })

  it('renders shared drive if the person is anonymous', () => {
    const props: PersonCellProps = {
      personData: ANONYMOUS_PERSON
    }
    const { container } = renderWithRouter(<PersonCell {...props} />)
    expect(container.querySelector('.PersonCell__full-name')).toHaveTextContent('Shared Drive')
  })

  // Is external by default since domains will be []
  it('renders external marker if external', () => {
    const props: PersonCellProps = {
      personData: MULTIPLE_OWNER_THOUSANDS_RISK_TYPE_FILE_MOCK
    }
    const { container } = renderWithRouter(<PersonCell {...props} />)
    expect(container.querySelectorAll('.PersonCell__email-ext').length > 0).toBeTruthy()
  })

  it('does not render external marker if not external', () => {
    const props: PersonCellProps = {
      personData: MULTIPLE_OWNER_THOUSANDS_RISK_TYPE_FILE_MOCK
    }
    const { container } = renderWithRouter(
      <UserContextProvider value={{ domains: ['thoughtlabs.io'] } as any}>
        <PersonCell {...props} />
      </UserContextProvider>
    )
    expect(container.querySelectorAll('.PersonCell__email-ext').length > 0).toBeFalsy()
  })
})
