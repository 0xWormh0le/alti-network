import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import FileContentInspection, { FileContentInspectionProps } from './FileContentInspection'

export default {
  title: 'Files/FileContentInspection',
  component: FileContentInspection
} as Meta

const Template: Story<FileContentInspectionProps> = (args) => <FileContentInspection {...args} />

export const Default = Template.bind({})
Default.args = {
  ccn: 1,
  sensitiveKeywords: [
    {
      keyword: 'someSensitiveKeyword',
      count: 1
    }
  ],
  ssn: 1
}

export const Loading = Template.bind({})
Loading.args = {
  ccn: 1,
  sensitiveKeywords: [
    {
      keyword: 'someSensitiveKeyword',
      count: 1
    }
  ],
  ssn: 1,
  loading: true
}

export const OnlySensitivePhrases = Template.bind({})
OnlySensitivePhrases.args = {
  sensitiveKeywords: [
    {
      keyword: 'someSensitiveKeyword',
      count: 1
    },
    {
      keyword: 'otherSensitiveWord',
      count: 10
    }
  ]
}
