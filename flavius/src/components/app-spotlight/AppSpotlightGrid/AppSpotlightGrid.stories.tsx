import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import AppSpotlightGrid, { AppSpotlightGridProps } from './AppSpotlightGrid'

export default {
  title: 'AppSpotlight/AppSpotlightGrid',
  component: AppSpotlightGrid
} as Meta

const Template: Story<AppSpotlightGridProps> = (args) => <AppSpotlightGrid {...args} />

export const Default = Template.bind({})
Default.args = {
  navTabs: [
    {
      label: 'NavTab1',
      seriesKey: 'fileDownloads',
      title: 'NavTab1',
      unit: 'Unit',
      value: {
        valueType: 'risk',
        serieLabels: ['x', 'y'],
        series: [1, 2, 3, 4, 5],
        subTitleText: 'Sub title'
      } as any,
      renderDetailsTable: (appId, wrapperType) => <div />
    }
  ]
}
