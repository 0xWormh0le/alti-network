import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import PersonAvatar, { PersonAvatarProps } from './PersonAvatar'

export default {
  title: 'Elements/PersonAvatar',
  component: PersonAvatar
} as Meta

const Template: Story<PersonAvatarProps> = (args) => <PersonAvatar {...args} />

export const Default = Template.bind({})
Default.args = {
  person: {
    name: {
      givenName: 'Bobbie',
      familyName: 'Name',
      fullName: 'Bobbie Name'
    },
    accessCount: 1,
    avatar: {
      url: '',
      url_etag: ''
    },
    displayName: 'Bobbie'
  } as any
}
