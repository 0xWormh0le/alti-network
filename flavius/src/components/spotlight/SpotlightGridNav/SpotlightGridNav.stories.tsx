import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import SpotlightGridNav, { SpotlightGridNavProps } from './SpotlightGridNav'

export default {
  title: 'Spotlight/SpotlightGridNav',
  component: SpotlightGridNav
} as Meta

const Template: Story<SpotlightGridNavProps> = (args) => <SpotlightGridNav {...args} />

export const Default = Template.bind({})
Default.args = {
  subNavLoaded: true,
  subNavTabs: [
    {
      label: 'Label1',
      unit: 'unit',
      value: 12321,
      valueType: 'risk'
    } as any
  ]
}
