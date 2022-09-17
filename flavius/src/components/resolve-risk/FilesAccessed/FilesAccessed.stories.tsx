import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import FilesAccessed, { FilesAccessedProps } from './FilesAccessed'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'ResolveRisk/FilesAccessed',
  component: FilesAccessed
} as Meta

const Template: Story<FilesAccessedProps> = (args) => (
  <BrowserRouter>
    <FilesAccessed {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {}

export const WithData = Template.bind({})
WithData.args = {
  pageCount: 1,
  entityCount: 1,
  pageSize: 1,
  files: [
    {
      fileName: 'File',
      createdAt: 123123,
      createdBy: {
        name: {
          givenName: 'Bobbie',
          familyName: ''
        }
      },
      lastModified: 456780
    } as any
  ]
}
