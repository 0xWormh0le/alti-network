import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import PageNumberInput, { PageNumberInputProps } from './PageNumberInput'

export default {
  title: 'Elements/PageNumberInput',
  component: PageNumberInput
} as Meta

const Template: Story<PageNumberInputProps> = (args) => <PageNumberInput {...args} />

export const Default = Template.bind({})
Default.args = {
  pageCount: 3
}
