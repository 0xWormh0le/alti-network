import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import FilterPills, { FilterPillsProps } from './FilterPills'

export default {
  title: 'Elements/FilterPills',
  component: FilterPills
} as Meta

const Template: Story<FilterPillsProps> = (args) => <FilterPills {...args} />

export const Default = Template.bind({})
Default.args = {
  selectedFilterIds: [0, 10, 1011]
}
