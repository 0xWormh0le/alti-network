import React from 'react'
import { render } from '@testing-library/react'
import { WhitelistTableProps, default as WhitelistTable } from './WhitelistTable'
import { noop } from 'lodash'

describe('WhitelistTable', () => {
  it('render correctly', () => {
    const props: WhitelistTableProps<WhitelistedDomainsResponse, RiskSettingsDomain> = {
      mapResponseToData: (data: WhitelistedDomainsResponse) => data.settings.whitelistedDomains,
      pageNumber: 1,
      onPageChange: noop,
      isLoading: false,
      column: 'Domain',
      response: {
        settings: {
          whitelistedDomains: [
            {
              domain: 'alice.com'
            },
            {
              domain: 'bob.com'
            },
            {
              domain: 'carl.com'
            }
          ]
        },
        pageNumber: 1,
        pageSize: 10,
        pageCount: 1,
        pageCountCacheTTL: 1,
        pageCountLastUpdated: 1
      } as WhitelistedDomainsResponse,
      onDelete: noop,
      render: (value: RiskSettingsDomain) => (
        <span className='Whitelist__table-item'>{(value as RiskSettingsDomain).domain}</span>
      )
    }
    const { container } = render(<WhitelistTable {...props} />)
    expect(container).toMatchSnapshot()
  })

  it('renders Delete button only when allowDelete field is specified for internal domains', () => {
    const props: WhitelistTableProps<InternalDomainsResponse, RiskSettingsDomain> = {
      mapResponseToData: (data: InternalDomainsResponse) => data.settings.internalDomains,
      pageNumber: 1,
      onPageChange: noop,
      isLoading: false,
      column: 'Domain',
      response: {
        settings: {
          internalDomains: [
            {
              domain: 'alice.com',
              allowDelete: true
            },
            {
              domain: 'bob.com',
              allowDelete: false
            },
            {
              domain: 'carl.com',
              allowDelete: false
            }
          ]
        },
        pageNumber: 1,
        pageSize: 10,
        pageCount: 1,
        pageCountCacheTTL: 1,
        pageCountLastUpdated: 1
      } as InternalDomainsResponse,
      onDelete: noop,
      useAllowDelete: true,
      render: (value: RiskSettingsDomain) => (
        <span className='Whitelist__table-item'>{(value as RiskSettingsDomain).domain}</span>
      )
    }
    const { container } = render(<WhitelistTable {...props} />)
    expect(container).toMatchSnapshot()
  })
})
