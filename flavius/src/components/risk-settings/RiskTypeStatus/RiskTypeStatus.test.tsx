import React from 'react'
import { RenderResult } from '@testing-library/react'
import { renderWithRouter } from 'test/support/helpers'
import { API } from 'aws-amplify'
import { when } from 'jest-when'
import RiskTypeStatus from './RiskTypeStatus'
import { RiskCategoryType } from 'types/common'

jest.mock('@aws-amplify/api/lib')

const riskTypeStatusMock: RiskTypeStatusResponse = {
  settings: {
    riskTypeStatus: [
      {
        category: RiskCategoryType.SHARING_RISKS,
        riskTypes: [
          { configurable: true, enabled: true, riskTypeId: '1011' },
          { configurable: true, enabled: false, riskTypeId: '1013' },
          { configurable: true, enabled: true, riskTypeId: '1020' },
          { configurable: true, enabled: true, riskTypeId: '1021' },
          { configurable: true, enabled: false, riskTypeId: '1022' },
          { configurable: true, enabled: false, riskTypeId: '1023' }
        ]
      },
      {
        category: RiskCategoryType.RELATIONSHIP_RISKS,
        riskTypes: [
          { configurable: true, enabled: true, riskTypeId: '2000' },
          { configurable: true, enabled: true, riskTypeId: '2001' },
          { configurable: true, enabled: false, riskTypeId: '2002' },
          { configurable: true, enabled: false, riskTypeId: '2003' }
        ]
      },
      {
        category: RiskCategoryType.ACTIVITY_RISKS,
        riskTypes: [
          { configurable: false, enabled: false, riskTypeId: '3010' },
          { configurable: false, enabled: false, riskTypeId: '3012' },
          { configurable: false, enabled: false, riskTypeId: '3100' },
          { configurable: false, enabled: false, riskTypeId: '3200' }
        ]
      },
      {
        category: RiskCategoryType.INFORMATIONAL_RISKS,
        riskTypes: [
          { configurable: false, enabled: false, riskTypeId: '0000' },
          { configurable: false, enabled: false, riskTypeId: '0010' },
          { configurable: false, enabled: false, riskTypeId: '0011' }
        ]
      }
    ] as RiskCategory[]
  }
}

describe('RiskTypeStatus after loading finished', () => {
  let renderResult: RenderResult

  beforeEach(async () => {
    const apiGet: any = API.get as any

    when<any, string[]>(apiGet).calledWith('risks_settings').mockResolvedValue(riskTypeStatusMock)

    renderResult = renderWithRouter(<RiskTypeStatus />)
  })

  it('renders correctly', () => {
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })
})
