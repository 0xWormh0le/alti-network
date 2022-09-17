import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import Pagination, { PaginationProps } from './Pagination'

export default {
  title: 'Elements/Pagination',
  component: Pagination
} as Meta

const Template: Story<PaginationProps> = (args) => <Pagination {...args} />

export const Default = Template.bind({})
Default.args = {
  pageNumber: 1,
  pageSize: 2,
  totalCount: 10
}

export const HiddenNumbers = Template.bind({})
HiddenNumbers.args = {
  pageNumber: 1,
  pageSize: 2,
  totalCount: 10,
  hidePageNumbers: true
}

export const PageSize1 = Template.bind({})
PageSize1.args = {
  pageNumber: 1,
  pageSize: 1,
  totalCount: 20
}
