import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import BaseAvatar, { BaseAvatarProps } from './BaseAvatar'

export default {
  title: 'Base/Avatar',
  component: BaseAvatar,
  argTypes: {}
} as Meta

const Template: Story<BaseAvatarProps> = (args) => <BaseAvatar {...args} />

export const OnlyNameProvided = Template.bind({})
OnlyNameProvided.args = {
  name: 'Bobbie Name'
}

export const ImageSourceProvided = Template.bind({})
ImageSourceProvided.args = {
  name: 'Bobbie Name',
  src: 'http://i.pravatar.cc/200?img=15'
}

export const NotRound = Template.bind({})
NotRound.args = {
  name: 'Bobbie Name',
  src: 'http://i.pravatar.cc/200?img=15',
  round: false
}
