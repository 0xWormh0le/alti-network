import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import { AlertContentTemplate, AlertContentTemplateProps } from './AlertContentTemplate'

export default {
  title: 'Elements/AlertContentTemplate',
  component: AlertContentTemplate
} as Meta

const Template: Story<AlertContentTemplateProps> = (args) => <AlertContentTemplate {...args} />

export const Error = Template.bind({})
Error.args = {
  message: 'Message',
  condition: 'error',
  customFields: {
    description: 'Description'
  }
}

export const Warning = Template.bind({})
Warning.args = {
  message: 'Message',
  condition: 'warning',
  customFields: {
    description: 'Description'
  }
}

export const Success = Template.bind({})
Success.args = {
  message: 'Message',
  condition: 'success',
  customFields: {
    description: 'Description'
  }
}

export const Info = Template.bind({})
Info.args = {
  message: 'Message',
  condition: 'info',
  customFields: {
    description: 'Description'
  }
}
