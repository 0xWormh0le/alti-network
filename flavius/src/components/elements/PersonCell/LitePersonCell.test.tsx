import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import LitePersonCell, { LitePersonCellProps } from './LitePersonCell'

describe('LitePersonCell', () => {
  it('renders correctly', () => {
    const props: LitePersonCellProps = {
      person: {
        avatar: { url: '', url_etag: '' },
        jobTitle: '',
        name: {
          familyName: 'familyName',
          fullName: 'firstName familyName',
          givenName: 'firstName'
        },
        phone: 'phone',
        primaryEmail: {
          address: 'primary@address.com'
        },
        providerId: 'box',
        status: 'active'
      },
      platformId: 'box'
    }
    const { container } = renderWithRouter(<LitePersonCell {...props} />)
    expect(container).toMatchSnapshot()
  })
})
