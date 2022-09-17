import React from 'react'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import { UI_STRINGS } from 'util/ui-strings'
import cx from 'classnames'
import './Marker.scss'

export interface MarkerProps {
  type: MarkerType
  className?: string
}

export enum MarkerType {
  Ext = 'ext',
  SensitiveContent = 'sensitive_content',
  EmailExteranl = 'email_external',
  None = 'none',
  Group = 'group',
  User = 'user',
  Unknown = 'unknown',
  Internal = 'internal',
  InternalDiscoverable = 'internal_discoverable',
  External = 'external',
  ExternalDiscoverable = 'external_discoverable',
  Sensitive = 'sensitive'
}

const markerText = {
  ext: UI_STRINGS.SPOTLIGHT.EXT,
  sensitive_content: UI_STRINGS.RISKS.TOOLTIP_FILES_AT_RISK,
  email_external: UI_STRINGS.SPOTLIGHT.EXTERNAL,
  none: UI_STRINGS.VISIBILITY.NONE,
  group: UI_STRINGS.VISIBILITY.NONE,
  user: UI_STRINGS.VISIBILITY.NONE,
  internal: UI_STRINGS.VISIBILITY.INTERNAL,
  internal_discoverable: UI_STRINGS.VISIBILITY.INTERNAL_DISCOVERABLE,
  external: UI_STRINGS.VISIBILITY.EXTERNAL_LINK_SHARING,
  external_discoverable: UI_STRINGS.VISIBILITY.EXTERNAL_DISCOVERABLE,
  unknown: UI_STRINGS.VISIBILITY.UNKNOWN,
  sensitive: UI_STRINGS.VISIBILITY.SENSITIVE_CONTENT
}

const Marker = React.forwardRef<HTMLElement, MarkerProps>(({ type, className }, ref) => (
  <Typography
    ref={ref}
    variant={TypographyVariant.BODY}
    component='span'
    className={cx(className, `Marker Marker__${type}`)}>
    {markerText[type]}
  </Typography>
))

export default Marker
