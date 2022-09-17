import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import TableHeadingCell, { TableHeadingCellProps } from './TableHeadingCell'

export default {
  title: 'Elements/TableHeadingCell',
  component: TableHeadingCell
} as Meta

const Template: Story<TableHeadingCellProps> = (args) => <TableHeadingCell {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Title',
  cellProperties: {}
}
