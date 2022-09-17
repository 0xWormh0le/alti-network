import React from 'react'

import Typography, { TypographyVariant } from 'components/elements/Typography'
import './SectionTitle.scss'

export interface SectionTitleProps {
  titleText: string
  className?: string
  children?: React.ReactNode
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ titleText, className, children }) => (
  <Typography variant={TypographyVariant.H3} className={className || 'SectionTitle'}>
    {titleText}
    {children}
  </Typography>
)

export default SectionTitle
