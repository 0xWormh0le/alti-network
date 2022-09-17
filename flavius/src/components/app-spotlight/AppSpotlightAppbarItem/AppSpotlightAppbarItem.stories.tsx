import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import AppSpotlightAppbarItem, { AppSpotlightAppbarItemProp } from './AppSpotlightAppbarItem'

export default {
  title: 'AppSpotlight/AppSpotlightAppbarItem',
  component: AppSpotlightAppbarItem
} as Meta

const Template: Story<AppSpotlightAppbarItemProp> = (args) => <AppSpotlightAppbarItem {...args} />

export const admin = Template.bind({})
admin.args = {
  image: '/services/admin.png',
  name: 'admin'
}

export const analytics = Template.bind({})
analytics.args = {
  image: '/services/analytics.png',
  name: 'analytics'
}

export const AppScripts = Template.bind({})
AppScripts.args = {
  image: '/services/apps-script.png',
  name: 'apps-script'
}

export const calendar = Template.bind({})
calendar.args = {
  image: '/services/calendar.png',
  name: 'calendar'
}

export const classroom = Template.bind({})
classroom.args = {
  image: '/services/classroom.png',
  name: 'classroom'
}

export const cloud = Template.bind({})
cloud.args = {
  image: '/services/cloud.png',
  name: 'cloud'
}

export const cloudprint = Template.bind({})
cloudprint.args = {
  image: '/services/cloudprint.png',
  name: 'cloudprint'
}

export const CloudSql = Template.bind({})
CloudSql.args = {
  image: '/services/cloud-sql.png',
  name: 'cloudsql'
}

export const docs = Template.bind({})
docs.args = {
  image: '/services/docs.png',
  name: 'docs'
}

export const drive = Template.bind({})
drive.args = {
  image: '/services/drive.png',
  name: 'drive'
}

export const firebase = Template.bind({})
firebase.args = {
  image: '/services/firebase.png',
  name: 'firebase'
}

export const forms = Template.bind({})
forms.args = {
  image: '/services/forms.png',
  name: 'forms'
}

export const gmail = Template.bind({})
gmail.args = {
  image: '/services/gmail.png',
  name: 'gmail'
}

export const google = Template.bind({})
google.args = {
  image: '/services/google.png',
  name: 'google'
}

export const hangouts = Template.bind({})
hangouts.args = {
  image: '/services/hangouts.png',
  name: 'hangouts'
}

export const meet = Template.bind({})
meet.args = {
  image: '/services/meet.png',
  name: 'meet'
}

export const other = Template.bind({})
other.args = {
  image: '/services/other.png',
  name: 'other'
}

export const presentations = Template.bind({})
presentations.args = {
  image: '/services/presentations.png',
  name: 'presentations'
}

export const photos = Template.bind({})
photos.args = {
  image: '/services/photos.png',
  name: 'photos'
}

export const picasa = Template.bind({})
picasa.args = {
  image: '/services/picasa.png',
  name: 'picasa'
}

export const people = Template.bind({})
people.args = {
  image: '/services/people.png',
  name: 'people'
}

export const sheets = Template.bind({})
sheets.args = {
  image: '/services/sheets.png',
  name: 'sheets'
}

export const tasks = Template.bind({})
tasks.args = {
  image: '/services/tasks.png',
  name: 'tasks'
}

export const wallet = Template.bind({})
wallet.args = {
  image: '/services/wallet.png',
  name: 'wallet'
}

export const webstore = Template.bind({})
webstore.args = {
  image: '/services/webstore.png',
  name: 'webstore'
}

export const youtube = Template.bind({})
youtube.args = {
  image: '/services/youtube.png',
  name: 'youtube'
}

export const selected = Template.bind({})
selected.args = {
  isSelected: true,
  image: '/services/tasks.png',
  name: 'tasks'
}
