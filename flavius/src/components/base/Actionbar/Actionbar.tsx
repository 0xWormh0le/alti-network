import React from 'react'

import Typography, { TypographyVariant } from 'components/elements/Typography'
import './Actionbar.scss'

export interface ActionbarProps {
  titleComponent: React.ReactNode
  closeButtonAction?: () => void
}

const Actionbar: React.FC<ActionbarProps> = ({ titleComponent, closeButtonAction }) => (
  <div className='Actionbar'>
    <Typography variant={TypographyVariant.H4} component='div' className='Actionbar__title-wrapper' weight='normal'>
      {titleComponent}
    </Typography>
    {closeButtonAction && (
      <div className='Actionbar__close' onClick={closeButtonAction}>
        &times;
      </div>
    )}
  </div>
)

export default Actionbar
