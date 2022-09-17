import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import SensitivePhrases from './SensitivePhrases'

export default {
  title: 'RiskSettings/SensitivePhrases',
  component: SensitivePhrases
} as Meta

const Template: Story<any> = (args) => <SensitivePhrases {...args} />

export const Default = Template.bind({})
Default.args = {}
