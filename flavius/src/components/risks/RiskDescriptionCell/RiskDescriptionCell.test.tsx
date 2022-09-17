import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import { RiskDescriptionCell, RiskDescriptionCellProps } from './RiskDescriptionCell'

describe('RiskDescriptionCell', () => {
  describe('UserEmail', () => {
    it('renders email with link properly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'File Shared to Personal Email Account',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 2000,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container, getByText } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      const emailWrapper = getByText('testuser@thoughtlabs.io')
      expect(emailWrapper).toHaveProperty('href', 'http://localhost/dashboard/spotlight/testuser%40thoughtlabs.io')
    })

    it('renders as Anonymous User with tooltip if email is equal to `anonymous`', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Many files downloaded in 24 hours',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 3200,
        email: 'anonymous',
        personId: undefined,
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container, getByText } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      const anonymousWrapper = getByText('Anonymous User')
      expect(anonymousWrapper).toHaveProperty(
        'href',
        'https://blog.altitudenetworks.com/about-the-google-drive-anonymous-user/'
      )
      // test if tooltip is rendered.
      expect(anonymousWrapper).toHaveClass('trigger')
    })
  })

  describe('Risk Type 0 (TopSharedFilesCompanyOwned)', () => {
    it('renders correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Most Shared Files - Company Owned',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 0,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(mockValue.text)
    })
  })

  describe('Risk Type 10 (TopSharedFilesNonCompanyOwned)', () => {
    it('renders correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Most Shared Files- Not Company Owned',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 10,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(mockValue.text)
    })
  })

  describe('Risk Type 1011 (SensitiveFileSharedByLinkInternal)', () => {
    it('renders correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Potentially Sensitive File Shared by Link Internally',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 1011,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(mockValue.text)
    })
  })

  describe('Risk Type 1020 (FileSharedByLinkExternal)', () => {
    it('renders correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'File Shared by Link Externally',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 1020,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(mockValue.text)
    })
  })

  describe('Risk Type 1021 (SensitiveFileSharedByLinkExternal)', () => {
    it('renders correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Potentially Sensitive File Shared by Link Externally',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 1021,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(mockValue.text)
    })
  })

  describe('Risk Type 1050 (FileSharedByLinkExternalDate)', () => {
    it('renders correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'File Shared by Link Externally- Created Over 180 Days Ago',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 1050,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(mockValue.text)
    })
  })

  describe('Risk Type 1051 (SensitiveFileSharedByLinkExternalDate)', () => {
    it('renders correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Potentially Sensitive File Shared by Link Externally- Created Over 180 Days Ago',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 1051,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(mockValue.text)
    })
  })

  describe('Risk Type 2000 (FileSharedToPersonalEmail)', () => {
    it('renders correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'File Shared to Personal Email Account',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 2000,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual('File Shared to Personal Email Account (testuser@thoughtlabs.io)')
    })

    it('renders anonymous user correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'File Shared to Personal Email Account',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 2000,
        email: 'testuser@thoughtlabs.io',
        personId: undefined,
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual('File Shared to Personal Email Account (Anonymous User)')
    })
  })

  describe('Risk Type 2001 (SensitiveFileSharedToPersonalEmail)', () => {
    it('renders correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Potentially Sensitive File Shared to Personal Email Account',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 2001,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(
        'Potentially Sensitive File Shared to Personal Email Account (testuser@thoughtlabs.io)'
      )
    })

    it('renders anonymous user correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Potentially Sensitive File Shared to Personal Email Account',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 2001,
        email: 'testuser@thoughtlabs.io',
        personId: undefined,
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(
        'Potentially Sensitive File Shared to Personal Email Account (Anonymous User)'
      )
    })
  })

  describe('Risk Type 2010 (FileSharedToPersonalEmailDate)', () => {
    it('renders correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'File Shared to Personal Email Account- Created Over 180 Days Ago',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 2010,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(
        'File Shared to Personal Email Account- Created Over 180 Days Ago (testuser@thoughtlabs.io)'
      )
    })

    it('renders anonymous user correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'File Shared to Personal Email Account- Created Over 180 Days Ago',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 2010,
        email: 'testuser@thoughtlabs.io',
        personId: undefined,
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(
        'File Shared to Personal Email Account- Created Over 180 Days Ago (Anonymous User)'
      )
    })
  })

  describe('Risk Type 2011 (SensitiveFileSharedToPersonalEmailDate)', () => {
    it('renders correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Sensitive File Shared to Personal Email Account- Created Over 180 Days Ago',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 2011,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(
        'Sensitive File Shared to Personal Email Account- Created Over 180 Days Ago (testuser@thoughtlabs.io)'
      )
    })

    it('renders anonymous user correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Sensitive File Shared to Personal Email Account- Created Over 180 Days Ago',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 2011,
        email: 'testuser@thoughtlabs.io',
        personId: undefined,
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(
        'Sensitive File Shared to Personal Email Account- Created Over 180 Days Ago (Anonymous User)'
      )
    })
  })

  describe('Risk Type 3010 (ManyDownloadsByApp)', () => {
    it('renders correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Many files downloaded in 24 hours by App',
        pluginId: '906807168814',
        pluginName: 'plugin name',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 3010,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite'
      }
      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(
        'Many files downloaded in 24 hours by App (plugin name - ID:906807168814 on behalf of testuser@thoughtlabs.io)'
      )
    })

    it('renders anonymous user correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Many files downloaded in 24 hours by App',
        pluginId: '906807168814',
        pluginName: 'plugin name',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 3010,
        email: 'testuser@thoughtlabs.io',
        personId: undefined,
        platformId: 'gsuite'
      }
      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(
        'Many files downloaded in 24 hours by App (plugin name - ID:906807168814 on behalf of Anonymous User)'
      )
    })

    it('renders without `(pluginId)` if pluginId is not provided.', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Many files downloaded in 24 hours by App',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 3010,
        email: 'testuser@thoughtlabs.io',
        personId: undefined,
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual('Many files downloaded in 24 hours by App on behalf of Anonymous User')
    })

    it('renders unknown app if `plugName` is not provided', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Many files downloaded in 24 hours by App',
        pluginId: '906807168814',
        pluginName: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 3010,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite'
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(
        'Many files downloaded in 24 hours by App (Unknown App - ID:906807168814 on behalf of testuser@thoughtlabs.io)'
      )
    })
  })

  describe('Risk Type 3012 (ManyDownloadsByAppNonCustomerOwned)', () => {
    it('renders correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Many files downloaded in 24 hours by App Non Customer Owned',
        pluginId: '906807168814',
        pluginName: 'plugin name',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 3012,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite'
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }

      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(
        'Many files downloaded in 24 hours by App Non Customer Owned (plugin name - ID:906807168814 on behalf of testuser@thoughtlabs.io)'
      )
    })

    it('renders anonymous user correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Many files downloaded in 24 hours by App Non Customer Owned',
        pluginId: '906807168814',
        pluginName: 'plugin name',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 3012,
        email: 'testuser@thoughtlabs.io',
        personId: undefined,
        platformId: 'gsuite'
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }

      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(
        'Many files downloaded in 24 hours by App Non Customer Owned (plugin name - ID:906807168814 on behalf of Anonymous User)'
      )
    })

    it('renders without `(pluginId)` if pluginId is not provided.', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Many files downloaded in 24 hours by App Non Customer Owned',
        pluginId: '',
        pluginName: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 3012,
        email: 'testuser@thoughtlabs.io',
        personId: undefined,
        platformId: 'gsuite'
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }

      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(
        'Many files downloaded in 24 hours by App Non Customer Owned on behalf of Anonymous User'
      )
    })

    it('renders unknown app if no plugName', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Many files downloaded in 24 hours by App Non Customer Owned',
        pluginId: '906807168814',
        pluginName: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 3012,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite'
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }

      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(
        'Many files downloaded in 24 hours by App Non Customer Owned (Unknown App - ID:906807168814 on behalf of testuser@thoughtlabs.io)'
      )
    })
  })

  describe('Risk Type 3100 (ManyDownloadsByPersonInternal)', () => {
    it('renders correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Many files downloaded in 24 hours by internal account',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 3100,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container, getByText } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(
        'Many files downloaded in 24 hours by internal account (testuser@thoughtlabs.io)'
      )

      const emailWrapper = getByText('testuser@thoughtlabs.io')
      expect(emailWrapper).toHaveProperty(
        'href',
        'http://localhost/dashboard/spotlight/testuser%40thoughtlabs.io?selectedSubNavKey=personDownloads'
      )
    })

    it('renders anonymous user correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Many files downloaded in 24 hours by internal account',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 3100,
        email: 'testuser@thoughtlabs.io',
        personId: undefined,
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual('Many files downloaded in 24 hours by internal account (Anonymous User)')
    })

    it('renders activity date if incidentDate is defined', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Many files downloaded in 24 hours by internal account',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 3100,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite',
        pluginName: '',
        incidentDate: 1637696774
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container.querySelector('.RiskDescriptionCell__metadata')).toBeDefined()
      expect(container.querySelector('.RiskDescriptionCell__metadata')).toHaveTextContent('Activity Date: Nov 23, 2021')
    })
  })

  describe('Risk Type 3200 (ManyDownloadsByPersonExternal)', () => {
    it('renders correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Many files downloaded in 24 hours by external account',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 3200,
        email: 'testuser@thoughtlabs.io',
        personId: 'testuser@altitudenetworks.com',
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }

      const { container, getByText } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual(
        'Many files downloaded in 24 hours by external account (testuser@thoughtlabs.io)'
      )
      const emailWrapper = getByText('testuser@thoughtlabs.io')
      expect(emailWrapper).toHaveProperty(
        'href',
        'http://localhost/dashboard/spotlight/testuser%40thoughtlabs.io?selectedSubNavKey=personDownloads'
      )
    })

    it('renders anonymous user correctly', () => {
      const mockValue: RiskDescriptionCellProps['displayRiskDescription'] = {
        text: 'Many files downloaded in 24 hours by external account',
        pluginId: '',
        riskId: '02e4522c98bd4dd8b0de882e86085daf',
        riskTypeId: 3200,
        email: 'testuser@thoughtlabs.io',
        personId: undefined,
        platformId: 'gsuite',
        pluginName: ''
      }

      const props: RiskDescriptionCellProps = {
        displayRiskDescription: mockValue
      }
      const { container } = renderWithRouter(<RiskDescriptionCell {...props} />)
      expect(container).toMatchSnapshot()
      expect(container.textContent).toEqual('Many files downloaded in 24 hours by external account (Anonymous User)')
    })
  })
})
