import React from 'react'
import { render } from '@testing-library/react'
import ActionsCell, { ActionCallback } from './ActionsCell'

let onEmailAction: ActionCallback
let onManagePermissionsAction: ActionCallback
let onLockoutAction: ActionCallback
let onIgnoreRiskAction: ActionCallback
let onPutBackToActiveAction: ActionCallback

beforeEach(() => {
  onEmailAction = jest.fn()
  onManagePermissionsAction = jest.fn()
  onLockoutAction = jest.fn()
  onIgnoreRiskAction = jest.fn()
  onPutBackToActiveAction = jest.fn()
})

it('renders correctly', () => {
  const fileData = new Map()
  fileData.set('fileCount', 10)
  const { container } = render(
    <ActionsCell
      onPutBackToActiveAction={onPutBackToActiveAction}
      onIgnoreRiskAction={onIgnoreRiskAction}
      onEmailAction={onEmailAction}
      state='active'
      emailActionEnabled={false}
      onManagePermissionsAction={onManagePermissionsAction}
      managePermissionsActionEnabled={false}
      onLockoutAction={onLockoutAction}
      file={fileData}
    />
  )
  expect(container).toMatchSnapshot()
})

it('should render 0 actions', () => {
  const fileData = new Map()
  fileData.set('fileCount', 10)
  const { container } = render(
    <ActionsCell
      onPutBackToActiveAction={onPutBackToActiveAction}
      onIgnoreRiskAction={onIgnoreRiskAction}
      onEmailAction={onEmailAction}
      state='active'
      emailActionEnabled={false}
      onManagePermissionsAction={onManagePermissionsAction}
      managePermissionsActionEnabled={false}
      onLockoutAction={onLockoutAction}
      file={fileData}
    />
  )
  expect(container.querySelectorAll('.ActionCell__popup--item').length).toBe(0)
})
