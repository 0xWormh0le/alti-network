import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import noop from 'lodash/noop'
import RiskTypeSettingItem, { RiskTypeSettingItemProps } from './RiskTypeSettingItem'
import { RiskCategoryType } from 'types/common'
import { DisplayRiskCategory, DisplayRiskType } from './RiskTypeSetting'
import '@altitudenetworks/component-library/dist/scss/components/elements/Accordion.scss'

export default {
  title: 'Slack/SlackNotificationItem',
  component: RiskTypeSettingItem
} as Meta

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

const riskCategory1: DisplayRiskCategory = {
  category: RiskCategoryType.SHARING_RISKS,
  label: 'Sharing Risks',
  order: 0,
  riskTypes: [{ ...riskType1 }, { ...riskType2 }]
}

const riskCategory2: DisplayRiskCategory = {
  category: RiskCategoryType.SHARING_RISKS,
  label: 'Sharing Risks',
  order: 0,
  riskTypes: [{ ...riskType1, configurable: false, enabled: false }, { ...riskType2 }]
}

const Template: Story<RiskTypeSettingItemProps> = (args) => (
  <>
    <RiskTypeSettingItem
      riskCategoryIndex={0}
      editMode={false}
      editable={true}
      checked={true}
      displayRiskCategoryInRead={true}
      riskCategory={riskCategory1}
      onToggleRiskCategory={noop}
      onToggleRiskType={noop}
    />
    <RiskTypeSettingItem
      riskCategoryIndex={0}
      editMode={true}
      editable={true}
      checked={true}
      displayRiskCategoryInRead={true}
      riskCategory={riskCategory1}
      onToggleRiskCategory={noop}
      onToggleRiskType={noop}
    />
    <RiskTypeSettingItem
      riskCategoryIndex={0}
      editMode={true}
      editable={false}
      checked={false}
      displayRiskCategoryInRead={true}
      riskCategory={riskCategory2}
      onToggleRiskCategory={noop}
      onToggleRiskType={noop}
    />
  </>
)

export const Default = Template.bind({})
Default.args = {}
