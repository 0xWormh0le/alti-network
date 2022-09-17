import React from 'react'
import ContentLoader from 'react-content-loader'
import Tooltip from 'components/widgets/Tooltip'
import Marker, { MarkerType } from 'components/elements/Marker'
import withContentLoader from 'hocs/withContentLoader'
import UI_STRINGS from 'util/ui-strings'
import './VisibilityPill.scss'

export const sharingIndicatorLabelMapping = (visibility: LinkVisibility) => {
  switch (visibility) {
    case 'none':
    case 'group':
    case 'user':
      return UI_STRINGS.VISIBILITY.NONE
    case 'internal':
      return UI_STRINGS.VISIBILITY.INTERNAL
    case 'internal_discoverable':
      return UI_STRINGS.VISIBILITY.INTERNAL_DISCOVERABLE
    case 'external':
      return UI_STRINGS.VISIBILITY.EXTERNAL_LINK_SHARING
    case 'external_discoverable':
      return UI_STRINGS.VISIBILITY.EXTERNAL_DISCOVERABLE
    case 'unknown':
      return UI_STRINGS.VISIBILITY.UNKNOWN
    case 'sensitive':
      return UI_STRINGS.VISIBILITY.SENSITIVE_CONTENT
    default:
      throw new Error(`Link visibility can never be ${visibility}`)
  }
}

export const sharingIndicatorTooltipMapping = (visibility: LinkVisibility) => {
  switch (visibility) {
    case 'none':
    case 'group':
    case 'user':
    case 'unknown':
      return ''
    case 'internal':
    case 'internal_discoverable':
      return UI_STRINGS.VISIBILITY.INTERNAL_TOOLTIP
    case 'external':
    case 'external_discoverable':
      return UI_STRINGS.VISIBILITY.EXTERNAL_TOOLTIP
    case 'sensitive':
      return UI_STRINGS.VISIBILITY.SENSITIVE_CONTENT
    default:
      throw new Error(`Link visibility can never be ${visibility}`)
  }
}

export interface VisibilityPillProps {
  visibility: LinkVisibility
}

const VisibilityPill: React.FC<VisibilityPillProps> = ({ visibility }) => {
  const pillLabel = sharingIndicatorLabelMapping(visibility)
  const tooltipText = sharingIndicatorTooltipMapping(visibility)

  if (tooltipText !== '') {
    return (
      <Tooltip text={tooltipText} id={`tooltip-visibility-${pillLabel}`}>
        <Marker type={visibility as MarkerType} />
      </Tooltip>
    )
  } else {
    return <Marker type={visibility as MarkerType} />
  }
}

const VisibilityPillLoading = () => (
  <ContentLoader
    backgroundColor='#f0f0f0'
    foregroundColor='#f7f7f7'
    height={20}
    width={70}
    className='VisibilityPillLoading'
    uniqueKey='VisibilityPillLoading'>
    <rect x={0} y={0} width={70} height={20} />
  </ContentLoader>
)

export default withContentLoader(VisibilityPillLoading)(VisibilityPill)
