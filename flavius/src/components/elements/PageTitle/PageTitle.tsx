import React from 'react'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import './PageTitle.scss'

export interface PageTitleProps {
  title: React.ReactNode | string
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => (
  <Typography variant={TypographyVariant.H2} component='h1' className='PageTitle' weight='normal'>
    {title}
  </Typography>
)

export default PageTitle
