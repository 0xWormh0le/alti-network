import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import AccessLists, { AccessListsProps } from './AccessLists'

export default {
  title: 'Files/AccessLists',
  component: AccessLists
} as Meta

const Template: Story<AccessListsProps> = (args) => <AccessLists {...args} />

export const Default = Template.bind({})
Default.args = {
  loading: false,
  file: {} as any
}

export const Loading = Template.bind({})
Loading.args = {
  loading: true,
  file: {} as any
}
