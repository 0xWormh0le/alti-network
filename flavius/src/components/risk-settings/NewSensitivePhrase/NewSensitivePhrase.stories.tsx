import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import NewSensitivePhrase, { NewSensitivePhraseProps } from './NewSensitivePhrase'

export default {
  title: 'RiskSettings/NewSensitivePhrase',
  component: NewSensitivePhrase
} as Meta

const Template: Story<NewSensitivePhraseProps> = (args) => <NewSensitivePhrase {...args} />

export const Default = Template.bind({})
Default.args = {}
