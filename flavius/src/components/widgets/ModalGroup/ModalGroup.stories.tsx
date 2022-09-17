import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import ModalGroup, { ModalGroupProps } from './ModalGroup'
import { BrowserRouter } from 'react-router-dom'
import { ModalContainer } from 'react-router-modal'

export default {
  title: 'Widgets/ModalGroup',
  component: ModalGroup
} as Meta

const Template: Story<ModalGroupProps> = (args) => (
  <BrowserRouter>
    <ModalGroup {...args} />

    <ModalContainer />
  </BrowserRouter>
)

export const Fail = Template.bind({})
Fail.args = {
  failModalMessage: 'Fail Message',
  failModalTitle: 'Fail Title',
  failModalVisible: true
}

export const Confirm = Template.bind({})
Confirm.args = {
  confirmModalVisible: true,
  confirmButtonDisabled: false,
  confirmModalTitle: 'Confirm Title',
  confirmModalMessage: (
    <div>
      <span>Message</span>
    </div>
  )
}

export const ConfirmDisabledButton = Template.bind({})
ConfirmDisabledButton.args = {
  confirmModalVisible: true,
  confirmButtonDisabled: true,
  confirmModalTitle: 'Confirm Title',
  confirmModalMessage: (
    <div>
      <span>Message</span>
    </div>
  )
}

export const Processing = Template.bind({})
Processing.args = {
  processingModalMessage: 'Processing message',
  processingModalTitle: 'Processing title',
  processingModalVisible: true
}

export const Success = Template.bind({})
Success.args = {
  successModalMessage: 'Success message',
  successModalTitle: 'Success title',
  successModalVisible: true
}
