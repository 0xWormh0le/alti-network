import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import LinkSharingIndicator, { LinkSharingIndicatorProps } from './LinkSharingIndicator'

export default {
  title: 'Files/LinkSharingIndicator',
  component: LinkSharingIndicator
} as Meta

const Template: Story<LinkSharingIndicatorProps> = (args) => <LinkSharingIndicator {...args} />

export const Group = Template.bind({})
Group.args = {
  value: 'group'
}

export const External = Template.bind({})
External.args = {
  value: 'external'
}

export const ExternalDiscoverable = Template.bind({})
ExternalDiscoverable.args = {
  value: 'external_discoverable'
}

export const Sensitive = Template.bind({})
Sensitive.args = {
  value: 'sensitive'
}

export const Internal = Template.bind({})
Internal.args = {
  value: 'internal'
}

export const InternalDiscoverable = Template.bind({})
InternalDiscoverable.args = {
  value: 'internal_discoverable'
}

export const User = Template.bind({})
User.args = {
  value: 'user'
}

export const Unknown = Template.bind({})
Unknown.args = {
  value: 'unknown'
}

export const Loading = Template.bind({})
Loading.args = {
  loading: true
}
