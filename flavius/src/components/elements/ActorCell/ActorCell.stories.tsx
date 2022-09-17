import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import ActorCell, { ActorCellProps } from './ActorCell'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Elements/ActorCell',
  component: ActorCell
} as Meta

const Template: Story<ActorCellProps> = (args) => (
  <BrowserRouter>
    <ActorCell {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {
  value: {
    get: (x) => x
  }
}

export const Anonymous = Template.bind({})
Anonymous.args = {}
