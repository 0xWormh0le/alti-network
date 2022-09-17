import Typography, { TypographyVariant } from 'elements/Typography'
import React from 'react'

interface SidebarSectionProps {
  title: string
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children }) => {
  return (
    <div className='Sidebar__section' key={title}>
      <Typography
        variant={TypographyVariant.SUBHEAD1}
        component='div'
        uppercase={true}
        className='Sidebar__group-title'>
        {title}
      </Typography>

      <ul className='Sidebar__list'>{children}</ul>
    </div>
  )
}

export default SidebarSection
