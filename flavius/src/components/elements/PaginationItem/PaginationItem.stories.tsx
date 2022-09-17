import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import PaginationItem, { PaginationItemProps } from './PaginationItem'

export default {
  title: 'Elements/PaginationItem',
  component: PaginationItem
} as Meta

const Template: Story<PaginationItemProps> = (args) => <PaginationItem {...args} />

export const Default = Template.bind({})
Default.args = {
  pageNumber: 1
}

export const Disabled = Template.bind({})
Disabled.args = {
  pageNumber: 1,
  disabled: true
}

export const Active = Template.bind({})
Active.args = {
  pageNumber: 1,
  active: true
}
