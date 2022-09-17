import React from 'react'

import { Story, Meta } from '@storybook/react/types-6-0'

import CopyEmail, { CopyEmailProps } from './CopyEmail'

export default {
  component: CopyEmail,
  title: 'Spotlight/CopyEmail'
} as Meta

const Template: Story<CopyEmailProps> = ({ email }) => (
  <div style={{ margin: '4em' }}>
    <CopyEmail email={email}>
      <span>{email}</span>
    </CopyEmail>
  </div>
)

export const Default = Template.bind({})
Default.args = {
  email: 'sample@test.com'
}
