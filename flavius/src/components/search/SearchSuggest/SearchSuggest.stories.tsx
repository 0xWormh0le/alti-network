import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import SearchSuggest, { SearchSuggestProps } from './SearchSuggest'
import { UsageKind, UserKind, AccessLevel } from 'types/common'

export default {
  title: 'Search/SearchSuggest',
  component: SearchSuggest
} as Meta

const Template: Story<SearchSuggestProps> = (args) => <SearchSuggest {...args} />

export const Default = Template.bind({})
Default.args = {}

export const WithPeopleData = Template.bind({})
WithPeopleData.args = {
  people: [
    {
      primaryEmail: {
        address: 'test@email.com',
        kind: UsageKind.personal,
        primary: true,
        accessCount: 0,
        riskCount: 0,
        lastDeletedPermissions: 0
      },
      recoveryEmail: {
        address: 'test@email.com',
        kind: UsageKind.personal,
        primary: true,
        accessCount: 0,
        riskCount: 0,
        lastDeletedPermissions: 0
      },
      name: {
        givenName: 'Test',
        familyName: 'User',
        fullName: ''
      },
      avatar: {
        url: '',
        url_etag: ''
      },
      internalCount: 1,
      externalCount: 0,
      emails: [],
      internal: true,
      accessCount: 0,
      riskCount: 99,
      altnetId: '',
      projectId: '',
      accessLevel: AccessLevel.member,
      userKind: UserKind.person,
      phones: [],
      externalIds: [],
      orgUnitPath: '',
      etag: '',
      isEnrolledInMFA: false,
      creationTime: 0,
      lastLoginTime: 0,
      lastModifiedTime: 0,
      notes: {
        content: '',
        content_type: ''
      }
    } as any
  ]
}
