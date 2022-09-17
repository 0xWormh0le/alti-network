import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import AppSpotlightGridNav, { AppSpotlightGridNavProps } from './AppSpotlightGridNav'

export default {
  title: 'AppSpotlight/AppSpotlightGridNav',
  component: AppSpotlightGridNav
} as Meta

const Template: Story<AppSpotlightGridNavProps> = (args) => <AppSpotlightGridNav {...args} />

export const Risk = Template.bind({})
Risk.args = {
  subNavTab: {
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
}

export const Download = Template.bind({})
Download.args = {
  subNavTab: {
    label: 'NavTab1',
    seriesKey: 'fileDownloads',
    title: 'NavTab1',
    unit: 'Unit',
    value: {
      valueType: 'download',
      serieLabels: ['x', 'y'],
      series: [1, 2, 3, 4, 5],
      subTitleText: 'Sub title'
    } as any,
    renderDetailsTable: (appId, wrapperType) => <div />
  }
}

export const Authorized = Template.bind({})
Authorized.args = {
  subNavTab: {
    label: 'NavTab1',
    seriesKey: 'fileDownloads',
    title: 'NavTab1',
    unit: 'Unit',
    value: {
      valueType: 'auth',
      serieLabels: ['x', 'y'],
      series: [1, 2, 3, 4, 5],
      subTitleText: 'Sub title'
    } as any,
    renderDetailsTable: (appId, wrapperType) => <div />
  }
}
