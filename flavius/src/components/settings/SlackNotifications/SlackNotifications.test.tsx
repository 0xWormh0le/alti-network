import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import { API } from 'aws-amplify'
import { when } from 'jest-when'
import { renderWithRouter } from 'test/support/helpers'
import SlackNotifications from './SlackNotifications'
import UI_STRINGS from 'util/ui-strings'

jest.mock('@aws-amplify/api/lib')

const notificationsMock: RiskCategory[] = [
  {
    category: 'Sharings',
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
    category: 'Relationships',
    riskTypes: [
      { configurable: true, enabled: true, riskTypeId: '2000' },
      { configurable: true, enabled: true, riskTypeId: '2001' },
      { configurable: true, enabled: false, riskTypeId: '2002' },
      { configurable: true, enabled: false, riskTypeId: '2003' }
    ]
  },
  {
    category: 'Actions',
    riskTypes: [
      { configurable: false, enabled: false, riskTypeId: '3010' },
      { configurable: false, enabled: false, riskTypeId: '3012' },
      { configurable: false, enabled: false, riskTypeId: '3100' },
      { configurable: false, enabled: false, riskTypeId: '3200' }
    ]
  },
  {
    category: 'Informatives',
    riskTypes: [
      { configurable: false, enabled: false, riskTypeId: '0000' },
      { configurable: false, enabled: false, riskTypeId: '0010' },
      { configurable: false, enabled: false, riskTypeId: '0011' }
    ]
  }
] as RiskCategory[]

describe('SlackNotifications before loading finished', () => {
  it('renders only loader', () => {
    const { container } = render(<SlackNotifications />)

    expect(container.querySelector('#RiskTypeSetting__group-item_Loader-aria')).toBeDefined()
  })
})

describe('SlackNotifications after loading finished', () => {
  let renderResult: RenderResult

  beforeEach(async () => {
    const apiGet: any = API.get as any

    when<any, string[]>(apiGet).calledWith('slack_notifications').mockResolvedValue(notificationsMock)

    renderResult = renderWithRouter(<SlackNotifications />)
  })

  it('renders correctly', () => {
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })

  it('renders SlackNotificationItem but no loader', async () => {
    const { container, getByText } = renderResult
    expect(container.querySelector('#RiskTypeSetting__group-item_Loader-aria')).toBeNull()
    expect(container.querySelectorAll('.RiskTypeSetting__overview')).toHaveLength(2)
    expect(getByText(UI_STRINGS.DASHBOARD.SHARING_RISKS)).toBeDefined()
    expect(getByText(UI_STRINGS.DASHBOARD.RELATIONSHIP_RISKS)).toBeDefined()
    expect(container.querySelectorAll('.RiskTypeSetting__subgroup-item')).toHaveLength(5)
  })

  it('renders edit button', async () => {
    const { getByRole } = renderResult

    expect(getByRole('button')).toHaveTextContent(UI_STRINGS.SETTINGS.SLACK_EDIT_NOTIFICATIONS_CTA)
  })
})
