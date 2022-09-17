import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import Brand from './Brand'

export default {
  title: 'Base/Brand',
  component: Brand
} as Meta

const Template: Story<any> = (args) => <Brand {...args} />

export const Default = Template.bind({})
Default.args = {}
