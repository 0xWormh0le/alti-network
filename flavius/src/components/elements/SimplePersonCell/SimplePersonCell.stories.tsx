import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import SimplePersonCell, { SimplePersonCellProps } from './SimplePersonCell'
import { BrowserRouter as Router } from 'react-router-dom'
import { personMock } from 'test/mocks'

export default {
  title: 'Elements/SimplePersonCell',
  component: SimplePersonCell
} as Meta

// Rendering a router to allow for link rendering
const Template: Story<SimplePersonCellProps> = (args) => (
  <Router>
    <SimplePersonCell {...args} />
  </Router>
)

export const Default = Template.bind({})
Default.args = {
  personInfo: personMock
}
