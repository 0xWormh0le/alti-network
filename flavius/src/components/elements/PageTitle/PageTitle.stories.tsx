import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import PageTitle, { PageTitleProps } from './PageTitle'

export default {
  title: 'Elements/PageTitle',
  component: PageTitle
} as Meta

const Template: Story<PageTitleProps> = (args) => <PageTitle {...args} />

export const Default = Template.bind({})
Default.args = {
  title: 'Sample Title'
}
