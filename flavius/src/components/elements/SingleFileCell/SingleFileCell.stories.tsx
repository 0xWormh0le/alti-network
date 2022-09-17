import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import SingleFileCell, { SingleFileCellProps } from './SingleFileCell'
import { BrowserRouter } from 'react-router-dom'
import { fileMock } from 'test/mocks'

export default {
  title: 'Elements/SingleFileCell',
  component: ({ file }) => {
    return <SingleFileCell file={file} />
  }
} as Meta

const Template: Story<SingleFileCellProps> = (args) => (
  <BrowserRouter>
    <SingleFileCell {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {
  file: fileMock
}
