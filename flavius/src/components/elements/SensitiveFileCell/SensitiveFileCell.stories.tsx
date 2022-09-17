import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import SensitiveFileCell, { SensitiveFileCellProps } from './SensitiveFileCell'

export default {
  title: 'Elements/SensitiveFileCell',
  component: SensitiveFileCell
} as Meta

const Template: Story<SensitiveFileCellProps> = (args) => <SensitiveFileCell {...args} />

export const NoSensitiveContent = Template.bind({})
NoSensitiveContent.args = {
  sensitiveFile: {
    fileCount: 0,
    riskId: '12312',
    riskTypeId: 1011
    // sensitivePhrases: {
    //   ccNumFileCount: 0,
    //   ssnFileCount: 0,
    //   sensitiveKeywordsFileCount: 0,
    //   sensitiveKeywords: undefined
    // }
  }
}

export const hasSensitiveContent = Template.bind({})
hasSensitiveContent.args = {
  sensitiveFile: {
    fileCount: 1,
    riskId: '123123',
    riskTypeId: 1011
    // sensitivePhrases: {
    //   ccNumFileCount: 1,
    //   ssnFileCount: 1,
    //   sensitiveKeywordsFileCount: 1,
    //   sensitiveKeywords: undefined
    // }
  }
}
