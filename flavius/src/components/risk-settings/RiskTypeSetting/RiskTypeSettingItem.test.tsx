import React from 'react'
import { render } from '@testing-library/react'
import RiskTypeSettingItem, { RiskTypeSettingItemProps } from './RiskTypeSettingItem'
import { RiskCategoryType } from 'types/common'
import { DisplayRiskCategory, DisplayRiskType } from './RiskTypeSetting'
import noop from 'lodash/noop'

const riskType1: DisplayRiskType = {
  riskTypeId: '1020',
  enabled: true,
  configurable: true,
  description: 'File Shared by Link Externally - Company Owned',
  severity: 8
}

const riskType2: DisplayRiskType = {
  riskTypeId: '3200',
  enabled: false,
  configurable: false,
  description: 'Many Files Downloaded in 24 hours by External Account',
  severity: 7
}

const riskTypes: DisplayRiskType[] = [riskType1, riskType2]

const riskCategory: DisplayRiskCategory = {
  category: RiskCategoryType.SHARING_RISKS,
  label: 'Sharing Risks',
  order: 0,
  riskTypes
}

const props: RiskTypeSettingItemProps = {
  riskCategoryIndex: 0,
  editMode: false,
  editable: false,
  checked: true,
  displayRiskCategoryInRead: true,
  riskCategory: { ...riskCategory },
  onToggleRiskCategory: noop,
  onToggleRiskType: noop
}

describe('SlackNotificationItem', () => {
  it('renders read view', () => {
    const { container } = render(<RiskTypeSettingItem {...props} />)

    expect(container.querySelector('.Accordion')).toBeNull()
    expect(container.querySelector('.RiskTypeSetting__overview')).toBeDefined()
    expect(container.querySelector('.RiskTypeSetting__group-item')).toHaveTextContent('Sharing Risks')
  })

  it('renders read view with only configurable and enabled risk types', () => {
    const { container: container1 } = render(<RiskTypeSettingItem {...props} />)

    expect(container1.querySelector('.RiskIndicator')).toBeDefined()
    expect(container1.querySelectorAll('.RiskTypeSetting__subgroup-item')).toHaveLength(1)
    expect(container1.querySelectorAll('.RiskTypeSetting__subgroup-item')[0]).toHaveTextContent(
      'File Shared by Link Externally - Company Owned'
    )

    // alter props here
    const newRiskTypes: DisplayRiskType[] = [{ ...riskType1 }, { ...riskType2, enabled: true, configurable: true }]
    const newRiskCategory: DisplayRiskCategory = { ...riskCategory, riskTypes: newRiskTypes }
    const newProps: RiskTypeSettingItemProps = { ...props, riskCategory: newRiskCategory }
    const { container: container2 } = render(<RiskTypeSettingItem {...newProps} />)

    expect(container2.querySelector('.RiskIndicator')).toBeDefined()
    expect(container2.querySelectorAll('.RiskIndicator')).toHaveLength(2)
    expect(container2.querySelectorAll('.RiskTypeSetting__subgroup-item')).toHaveLength(2)
    expect(container2.querySelectorAll('.RiskTypeSetting__subgroup-item')[0]).toHaveTextContent(
      'File Shared by Link Externally - Company Owned'
    )
    expect(container2.querySelectorAll('.RiskTypeSetting__subgroup-item')[1]).toHaveTextContent(
      'Many Files Downloaded in 24 hours by External Account'
    )
  })

  it('renders edit view', () => {
    const newProps: RiskTypeSettingItemProps = { ...props, editMode: true }
    const { container, getByLabelText } = render(<RiskTypeSettingItem {...newProps} />)

    expect(container.querySelector('.Accordion')).toBeDefined()
    expect(container.querySelector('.Accordion__summary')).toBeDefined()
    expect(container.querySelector('.Accordion__details')).toBeDefined()
    expect(container.querySelector('.RiskTypeSetting__overview')).toBeNull()
    expect(container.querySelector('.RiskTypeSetting__group-item')).toBeDefined()
    expect(container.querySelector('.RiskTypeSetting__subgroup-item')).toBeDefined()
    expect(container.querySelector('label')).toHaveTextContent('Sharing Risks')
    expect(getByLabelText('Sharing Risks')).toBeDefined()
    expect(getByLabelText('File Shared by Link Externally - Company Owned')).toBeDefined()
    expect(getByLabelText('Many Files Downloaded in 24 hours by External Account')).toBeDefined()
  })

  it('renders edit view with enabled checkboxes if Risk Category is configurable', () => {
    const newProps: RiskTypeSettingItemProps = { ...props, editMode: true }
    const { container } = render(<RiskTypeSettingItem {...newProps} />)

    expect(container.querySelector('#sharings')).not.toBeChecked()
    expect(container.querySelector('#sharings')).not.toBeEnabled()
    expect(container.querySelector('#riskType-1020')).toBeChecked()
    expect(container.querySelector('#riskType-1020')).toBeEnabled()
    expect(container.querySelectorAll('.RiskTypeSetting__subgroup-item')[0]).not.toHaveClass(
      'RiskTypeSetting__subgroup-item--disabled'
    )
    expect(container.querySelector('#riskType-3200')).not.toBeChecked()
    expect(container.querySelector('#riskType-3200')).not.toBeEnabled()
    expect(container.querySelectorAll('.RiskTypeSetting__subgroup-item')[1]).toHaveClass(
      'RiskTypeSetting__subgroup-item--disabled'
    )
  })

  it('renders edit view with enabled checkboxes if Risk Category is not configurable', () => {
    const newProps: RiskTypeSettingItemProps = { ...props, editMode: true, editable: false }
    const { container } = render(<RiskTypeSettingItem {...newProps} />)

    expect(container.querySelector('#sharings')).not.toBeChecked()
    expect(container.querySelector('#sharings')).not.toBeEnabled()
    expect(container.querySelector('.RiskTypeSetting__group-item--disabled')).toBeDefined()
  })
})
