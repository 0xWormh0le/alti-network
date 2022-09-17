import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import PermissionDeletionStatus, { PermissionDeletionStatusProps } from './PermissionDeletionStatus'
import StorybookAmplifyContainer from 'components/storybook-widgets/StorybookAmplifyContainer'
import { rest } from 'msw'

export default {
  title: 'Elements/PermissionDeletionStatus',
  component: PermissionDeletionStatus
} as Meta

const Template: Story<PermissionDeletionStatusProps> = (args) => {
  return (
    <StorybookAmplifyContainer>
      <PermissionDeletionStatus {...args} />
    </StorybookAmplifyContainer>
  )
}

export const All = Template.bind({})
All.args = {
  riskId: 'all'
}
All.parameters = {
  msw: [
    rest.get('/api/dev-01/permissions/status', (req, res, ctx) => {
      return res(
        ctx.json({
          active: 1,
          completed: 2,
          failed: 3,
          pending: 4,
          totalCount: 10
        })
      )
    })
  ]
}

export const Pending = Template.bind({})
Pending.args = {
  riskId: 'pending'
}
Pending.parameters = {
  msw: [
    rest.get('/api/dev-01/permissions/status', (req, res, ctx) => {
      return res(
        ctx.json({
          active: 0,
          completed: 0,
          failed: 0,
          pending: 4,
          totalCount: 4
        })
      )
    })
  ]
}

export const Completed = Template.bind({})
Completed.args = {
  riskId: 'completed'
}
Completed.parameters = {
  msw: [
    rest.get('/api/dev-01/permissions/status', (req, res, ctx) => {
      return res(
        ctx.json({
          active: 0,
          completed: 4,
          failed: 0,
          pending: 0,
          totalCount: 4
        })
      )
    })
  ]
}

export const Failed = Template.bind({})
Failed.args = {
  riskId: 'failed'
}
Failed.parameters = {
  msw: [
    rest.get('/api/dev-01/permissions/status', (req, res, ctx) => {
      return res(
        ctx.json({
          active: 0,
          completed: 0,
          failed: 4,
          pending: 0,
          totalCount: 4
        })
      )
    })
  ]
}
