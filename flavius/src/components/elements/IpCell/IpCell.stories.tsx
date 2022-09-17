import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import IpCell, { IpCellProps } from './IpCell'

export default {
  title: 'Elements/IpCell',
  component: IpCell
} as Meta

const Template: Story<IpCellProps> = (args) => <IpCell {...args} />

export const Default = Template.bind({})
Default.args = {
  value: '192.168.0.0'
}
