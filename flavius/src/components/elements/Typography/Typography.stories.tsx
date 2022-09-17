import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import Typography, { TypographyProps } from './Typography'

export default {
  title: 'Elements/Typography',
  component: Typography
} as Meta

const Template: Story<TypographyProps> = (args) => <Typography {...args} />

export const Default = Template.bind({})
Default.args = {
  children: 'Text'
}

export const Uppercase = Template.bind({})
Uppercase.args = {
  children: 'Text',
  uppercase: true
}

export const Bold = Template.bind({})
Bold.args = {
  children: 'Text',
  weight: 'bold'
}

export const Light = Template.bind({})
Light.args = {
  children: 'Text',
  weight: 'light'
}

export const Medium = Template.bind({})
Medium.args = {
  children: 'Text',
  weight: 'medium'
}

export const Semibold = Template.bind({})
Semibold.args = {
  children: 'Text',
  weight: 'semibold'
}

export const Body = Template.bind({})
Body.args = {
  children: 'Text',
  variant: 'body'
}

export const BodySmall = Template.bind({})
BodySmall.args = {
  children: 'Text',
  variant: 'body-small'
}

export const BodyTiny = Template.bind({})
BodyTiny.args = {
  children: 'Text',
  variant: 'body-tiny'
}

export const BodyLarge = Template.bind({})
BodyLarge.args = {
  children: 'Text',
  variant: 'body-large'
}

export const Heading1 = Template.bind({})
Heading1.args = {
  children: 'Text',
  variant: 'h1'
}

export const Heading2 = Template.bind({})
Heading2.args = {
  children: 'Text',
  variant: 'h2'
}

export const Heading3 = Template.bind({})
Heading3.args = {
  children: 'Text',
  variant: 'h3'
}

export const Subhead1 = Template.bind({})
Subhead1.args = {
  children: 'Text',
  variant: 'subhead1'
}

export const Subhead2 = Template.bind({})
Subhead2.args = {
  children: 'Text',
  variant: 'subhead2'
}

export const Label = Template.bind({})
Label.args = {
  children: 'Text',
  variant: 'label'
}

export const LabelLarge = Template.bind({})
LabelLarge.args = {
  children: 'Text',
  variant: 'label-large'
}
