import React from 'react'

import Typography, { TypographyVariant } from 'components/elements/Typography'
import { Link } from 'react-router-dom'
import './DashboardRiskTile.scss'

export interface DashboardRiskTileProps {
  count: number
  label: string
  linkTo: string
  title: string
  children: React.ReactNode
}

export const DashboardRiskTile: React.FC<DashboardRiskTileProps> = ({ count, label, linkTo, title, children }) => {
  const { H1, LABEL } = TypographyVariant

  return (
    <div className='DashboardRiskTile'>
      <Typography variant={LABEL} component='div' className='DashboardRiskTile__title'>
        {title}
      </Typography>
      {children}
      <Link to={linkTo}>
        <button className='DashboardRiskTile__button'>
          <Typography variant={H1} component='span' className='DashboardRiskTile__count'>
            {count}
          </Typography>
          <Typography variant={LABEL} component='span' className='DashboardRiskTile__label'>
            {label}
          </Typography>
        </button>
      </Link>
    </div>
  )
}

export default DashboardRiskTile
