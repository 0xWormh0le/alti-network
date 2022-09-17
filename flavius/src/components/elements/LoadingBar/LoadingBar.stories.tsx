import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import LoadingBar from './LoadingBar'

export default {
  title: 'Elements/LoadingBar',
  component: LoadingBar
} as Meta

const Template: Story<any> = (args) => <LoadingBar {...args} />

export const Default = Template.bind({})
Default.args = {}
