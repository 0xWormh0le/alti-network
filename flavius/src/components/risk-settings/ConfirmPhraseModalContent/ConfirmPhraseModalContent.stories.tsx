import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import ConfirmPhraseModalContent, { ConfirmPhraseModalContentProps } from './ConfirmPhraseModalContent'

export default {
  title: 'RiskSettings/ConfirmPhraseModalContent',
  component: ConfirmPhraseModalContent
} as Meta

const Template: Story<ConfirmPhraseModalContentProps> = (args) => <ConfirmPhraseModalContent {...args} />

export const Default = Template.bind({})
Default.args = {
  sensitivePhrase: {
    exact: false,
    phrase: 'A Phrase'
  }
}

export const Exact = Template.bind({})
Exact.args = {
  sensitivePhrase: {
    exact: true,
    phrase: 'A Phrase'
  }
}

export const AddAction = Template.bind({})
AddAction.args = {
  action: 'add',
  sensitivePhrase: {
    exact: true,
    phrase: 'A Phrase'
  }
}
