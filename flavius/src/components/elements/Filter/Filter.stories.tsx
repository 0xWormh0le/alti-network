import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import Filter, { FilterProps } from './Filter'
import { noop } from 'lodash'
import GoogleLogo from 'icons/google-logo.svg'
import Office365Logo from 'icons/office-365.svg'

export default {
  title: 'Elements/Filter',
  component: Filter
} as Meta

const Template: Story<FilterProps> = (args) => <Filter {...args} />

export const FilterActivity = Template.bind({})
FilterActivity.args = {
  headerLabel: 'File Activity',
  displayAllOption: true,
  items: [
    {
      id: '1',
      value: '1',
      selected: false,
      label: 'Content workflow abnomal download activity'
    },
    {
      id: '2',
      value: '2',
      selected: true,
      label: 'Content workflow sharing policy violation'
    },
    {
      id: '3',
      value: '3',
      selected: true,
      label: 'Content workflow upload policy voilation'
    }
  ],
  resetItems: [
    {
      id: '1',
      value: '1',
      selected: true,
      label: 'Content workflow abnomal download activity'
    },
    {
      id: '2',
      value: '2',
      selected: true,
      label: 'Content workflow sharing policy violation'
    },
    {
      id: '3',
      value: '3',
      selected: true,
      label: 'Content workflow upload policy voilation'
    }
  ],
  onSubmit: noop
}

export const FilterSeverity = Template.bind({})
FilterSeverity.args = {
  headerLabel: 'Severity',
  displayAllOption: true,
  items: [
    {
      id: 'high',
      value: 'high',
      selected: true,
      renderComponent: <div>High</div>
    },
    {
      id: 'medium',
      value: 'medium',
      selected: true,
      renderComponent: <div>Medium</div>
    },
    {
      id: 'low',
      value: 'low',
      selected: true,
      renderComponent: <div>Low</div>
    }
  ],
  onSubmit: noop
}

export const FilterPlatform = Template.bind({})
FilterPlatform.args = {
  containerClass: 'container-class',
  headerLabel: 'Platform',
  displayAllOption: true,
  tooltipText: `'Press "apply" after selections are made to update Risks table'`,
  items: [
    {
      id: 'gsuite',
      value: 'gsuite',
      selected: false,
      renderComponent: (
        <div>
          <img src={GoogleLogo} alt='gsuite' title='gsuite' />
          <span style={{ marginLeft: '0.5rem' }}>Google Workspace</span>
        </div>
      )
    },
    {
      id: 'o365',
      value: 'o365',
      selected: false,
      renderComponent: (
        <div>
          <img src={Office365Logo} alt='osuite' title='osuite' />
          <span style={{ marginLeft: '0.5rem' }}>Microsoft 365</span>
        </div>
      )
    }
  ],
  onSubmit: noop
}

export const FilterPlatformSingleSelect = Template.bind({})
FilterPlatformSingleSelect.args = {
  containerClass: 'container-class',
  headerLabel: 'Platform',
  items: [
    {
      id: 'gsuite',
      value: 'gsuite',
      selected: true,
      label: 'Google Workspace',
      renderComponent: (
        <div>
          <img src={GoogleLogo} alt='gsuite' title='gsuite' />
          <span style={{ marginLeft: '0.5rem' }}>Google Workspace</span>
        </div>
      )
    },
    {
      id: 'o365',
      value: 'o365',
      selected: false,
      label: 'Microsoft 365',
      renderComponent: (
        <div>
          <img src={Office365Logo} alt='osuite' title='osuite' />
          <span style={{ marginLeft: '0.5rem' }}>Microsoft 365</span>
        </div>
      )
    }
  ],
  isSingleSelect: true,
  onSubmit: noop
}
