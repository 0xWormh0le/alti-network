import React from 'react'
import cx from 'classnames'
import VisibilityPill from 'components/elements/VisibilityPill'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import './LinkSharingIndicator.scss'

export interface LinkSharingIndicatorProps {
  value: LinkVisibility
  loading?: boolean
  className?: string
}

export const LinkSharingIndicator: React.FC<LinkSharingIndicatorProps> = ({ value, className, loading }) => (
  <Typography
    variant={TypographyVariant.BODY_SMALL}
    component='div'
    weight='bold'
    className={cx('LinkSharingIndicator', className)}>
    <span className='LinkSharingIndicator__label'>Link sharing: </span>
    <VisibilityPill visibility={value} loading={loading} />
  </Typography>
)

export default LinkSharingIndicator
