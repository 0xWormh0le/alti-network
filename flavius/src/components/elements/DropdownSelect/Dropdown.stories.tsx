import React, { Fragment } from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import DropdownSelect, { DropdownSelectProps } from './DropdownSelect'
import DropdownItem from './DropdownItem'
import { platformImages, platforms } from 'config'
import { DropdownItemAll, DropdownReset, DropdownSelectSubmit } from '.'
import noop from 'lodash/noop'

export default {
  title: 'Elements/DropdownSelect',
  component: DropdownSelect
} as Meta

const Template: Story<DropdownSelectProps> = (args) => (
  <DropdownSelect {...args}>
    <Fragment>
      {platforms.map((p) => {
        return (
          <DropdownItem
            label={p.platformName}
            key={p.platformId}
            value={p.platformId}
            icon={{ type: 'image', src: platformImages[p.platformId].Icon }}
          />
        )
      })}
    </Fragment>

    <DropdownItemAll label='All' />
    <DropdownSelectSubmit text='Apply' onSubmit={noop} canApplyFilter={true} />
    <DropdownReset onReset={noop} text='Reset filter' />
  </DropdownSelect>
)

export const PlatformFilter = Template.bind({})
PlatformFilter.args = {}
