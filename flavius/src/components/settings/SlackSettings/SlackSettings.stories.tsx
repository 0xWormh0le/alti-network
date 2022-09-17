import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import SlackSettings from './SlackSettings'

export default {
  title: 'Slack/SlackSettings',
  component: SlackSettings
} as Meta

const Template: Story<any> = (args) => <SlackSettings {...args} />

export const Default = Template.bind({})
Default.args = {}
