import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import AvatarList, { AvatarListProps } from './AvatarList'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Elements/AvatarList',
  component: AvatarList
} as Meta

const Template: Story<AvatarListProps> = (args) => (
  <BrowserRouter>
    <AvatarList {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {
  people: [
    {
      displayName: 'BobbieHawaii',
      name: {
        givenName: 'Bobbie',
        familyName: 'Hawaii',
        fullName: 'Bobbie Hawaii'
      },
      riskCount: 2
    },
    {
      displayName: 'FooBar',
      name: {
        givenName: 'Foo',
        familyName: 'Bar',
        fullName: 'Foo Bar'
      },
      riskCount: 2
    }
  ] as any
}
