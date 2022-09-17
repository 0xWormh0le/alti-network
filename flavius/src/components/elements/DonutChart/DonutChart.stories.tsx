import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import DonutChart, { DonutChartProps } from './DonutChart'

export default {
  title: 'Elements/DonutChart',
  component: DonutChart
} as Meta

const Template: Story<DonutChartProps> = (args) => (
  <div style={{ width: '10rem', height: '10rem' }}>
    <DonutChart {...args} />
  </div>
)

export const Risk = Template.bind({})
Risk.args = {
  data: {
    values: [10, 20, 30, 40, 50],
    padding: 100,
    subTitleText: 'Sub title',
    valueText: 'Risk',
    valueType: 'risk'
  },
  loading: false
}

export const Download = Template.bind({})
Download.args = {
  data: {
    values: [10, 20, 30, 40, 50],
    padding: 1,
    subTitleText: 'Sub title',
    valueText: 'Files',
    valueType: 'download'
  },
  loading: false
}

export const Auth = Template.bind({})
Auth.args = {
  data: {
    values: [30, 40, 50],
    padding: 1,
    subTitleText: 'Sub title',
    valueText: 'Auth',
    valueType: 'auth'
  },
  loading: false
}

export const Loading = Template.bind({})
Loading.args = {
  data: {
    values: [30, 40, 50],
    padding: 1,
    subTitleText: 'Sub title',
    valueText: 'Auth',
    valueType: 'auth'
  },
  loading: true
}
