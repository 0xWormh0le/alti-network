import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import SectionTitle, { SectionTitleProps } from './SectionTitle'

export default {
  title: 'Elements/SectionTitle',
  component: SectionTitle
} as Meta

const Template: Story<SectionTitleProps> = (args) => <SectionTitle {...args} />

export const Default = Template.bind({})
Default.args = {
  titleText: 'A Title'
}

export const Dark = Template.bind({})
Dark.args = {
  titleText: 'A Title',
  className: 'SectionTitleDark'
}
