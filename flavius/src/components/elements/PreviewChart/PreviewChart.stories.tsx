import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import PreviewChart, { PreviewChartProps } from './PreviewChart'

export default {
  title: 'Elements/PreviewChart',
  component: PreviewChart
} as Meta

const Template: Story<PreviewChartProps> = (args) => <PreviewChart {...args} />

export const Default = Template.bind({})
Default.args = {
  data: {
    labels: [1, 2, 3, 4, 5, 6],
    series: [
      [1, 2, 3, 4, 5, 6],
      [4, 5, 6, 7, 8, 9]
    ]
  }
}
