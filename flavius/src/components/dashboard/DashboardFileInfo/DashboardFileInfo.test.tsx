import React from 'react'

import { fileMock } from 'test/mocks'
import { renderWithRouter } from 'test/support/helpers'
import { DashboardFileInfo, DashboardFileInfoProps } from './DashboardFileInfo'

const fileMock2 = ({
  fileName: 'aes_test.c',
  fileId: '1-3Rb6ikp_NP5CsBNaSeHuUp5J0ND65bP',
  createdAt: null,
  lastModified: null,
  internalAccessCount: 0,
  externalAccessCount: 7,
  linkVisibility: 'external',
  externalAccessList: [],
  internalAccessList: [],
  createdBy: {},
  app: 'GDrive'
} as unknown) as IFile

describe('DashboardFileInfo', () => {
  it('renders correctly', () => {
    const props: DashboardFileInfoProps = {
      file: fileMock
    }
    const { container } = renderWithRouter(<DashboardFileInfo {...props} />)
    expect(container).toMatchSnapshot()
  })

  it('renders Unknown if creator field is missing', () => {
    const props: DashboardFileInfoProps = {
      file: fileMock2
    }
    const { container } = renderWithRouter(<DashboardFileInfo {...props} />)
    expect(container).toMatchSnapshot()
  })
})
