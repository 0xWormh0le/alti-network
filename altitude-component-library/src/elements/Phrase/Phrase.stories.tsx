import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import Phrase, { PhraseProps } from './Phrase'

export default {
  title: 'Elements/Phrase',
  component: Phrase
} as Meta

const Template: Story<PhraseProps> = (args) => <Phrase {...args} />

export const Small = Template.bind({})
Small.args = {
  size: 'sm',
  phrase: 'Phrase'
}

export const Large = Template.bind({})
Large.args = {
  size: 'lg',
  phrase: 'Phrase'
}
