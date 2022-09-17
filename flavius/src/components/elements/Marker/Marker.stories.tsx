import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import Marker, { MarkerProps, MarkerType } from './Marker'

export default {
  title: 'Elements/Marker',
  component: Marker
} as Meta

const Template: Story<MarkerProps> = ({ type }) => <Marker type={type} />

export const extMarker = Template.bind({})
extMarker.args = {
  type: MarkerType.Ext
}

export const sensitiveContentMarker = Template.bind({})
sensitiveContentMarker.args = {
  type: MarkerType.SensitiveContent
}

export const emailExternalMarker = Template.bind({})
emailExternalMarker.args = {
  type: MarkerType.EmailExteranl
}

export const noneMarker = Template.bind({})
noneMarker.args = {
  type: MarkerType.None
}

export const userMarker = Template.bind({})
userMarker.args = {
  type: MarkerType.User
}

export const unknownMarker = Template.bind({})
unknownMarker.args = {
  type: MarkerType.Unknown
}

export const internalDiscoverableMarker = Template.bind({})
internalDiscoverableMarker.args = {
  type: MarkerType.InternalDiscoverable
}

export const externalMarker = Template.bind({})
externalMarker.args = {
  type: MarkerType.External
}

export const externalDiscoverableMarker = Template.bind({})
externalDiscoverableMarker.args = {
  type: MarkerType.ExternalDiscoverable
}

export const sensitiveMarker = Template.bind({})
sensitiveMarker.args = {
  type: MarkerType.Sensitive
}
