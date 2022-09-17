import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import PhraseCount, { PhraseCountProps } from './PhraseCount'

export default {
  title: 'RiskSettings/PhraseCount',
  component: PhraseCount
} as Meta

const Template: Story<PhraseCountProps> = (args) => <PhraseCount {...args} />

export const Default = Template.bind({})
Default.args = {
  count: 4
}

export const Loading = Template.bind({})
Loading.args = {
  loading: true
}
