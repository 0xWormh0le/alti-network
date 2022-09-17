import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import Spinner from './Spinner'

export default {
  title: 'Widgets/Spinner',
  component: Spinner
} as Meta

const Template: Story<any> = (args) => <Spinner {...args} />

export const Default = Template.bind({})
