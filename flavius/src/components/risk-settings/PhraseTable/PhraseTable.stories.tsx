import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import PhraseTable, { PhraseTableProps } from './PhraseTable'

export default {
  title: 'RiskSettings/PhraseTable',
  component: PhraseTable
} as Meta

const Template: Story<PhraseTableProps> = (args) => <PhraseTable {...args} />

export const Default = Template.bind({})
Default.args = {
  sensitivePhrases: [
    {
      exact: true,
      phrase: 'Foo'
    },
    {
      exact: false,
      phrase: 'Bar'
    },
    {
      exact: true,
      phrase: 'Baz'
    }
  ]
}

export const Loading = Template.bind({})
Loading.args = {
  loading: true,
  sensitivePhrases: []
}

export const HasError = Template.bind({})
HasError.args = {
  hasError: true,
  sensitivePhrases: []
}
