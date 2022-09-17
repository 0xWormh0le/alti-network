import React, { useRef } from 'react'
import ScrollMenu from 'react-horizontal-scrolling-menu'
import { capitalize } from 'lodash'
import AppSpotlightAppbarItem from '../AppSpotlightAppbarItem'
import { useBoundingClientRect } from 'util/hooks/custom'
import './AppSpotlightAppbar.scss'

export interface AppbarProps {
  serviceNames: string[]
  selected: string
  onSelectionChanged: (selectedServiceName: string) => void
}

const ITEM_WIDTH = 111

export const AppSpotlightAppbar: React.FC<AppbarProps> = (props) => {
  const { selected, serviceNames } = props
  // const [selectedServiceName, setSelectedServiceName] = useState(selected)
  const { onSelectionChanged } = props

  const wrapperRef = useRef<any>()
  const boundingClientRect = useBoundingClientRect(wrapperRef)
  const handleItemClick = (serviceName: string) => {
    // setSelectedServiceName(serviceName)
    onSelectionChanged(serviceName)
  }
  const { width: clientWidth } = boundingClientRect

  const itemsToRender = serviceNames.map((name, index) => {
    return (
      <AppSpotlightAppbarItem
        key={index.toString()}
        name={capitalize(name)}
        isSelected={selected === name}
        // isSelected={selectedServiceName === name}
        image={`/services/${name}.png`}
        index={index}
        onClick={() => handleItemClick(name)}
      />
    )
  })

  return (
    <div className='AppSpotlightAppbar' ref={wrapperRef}>
      {clientWidth && itemsToRender.length * ITEM_WIDTH < clientWidth - 128 - 244 ? (
        <div className='AppSpotlightAppbar__no-scroll'>{itemsToRender}</div>
      ) : (
        <ScrollMenu
          data={itemsToRender}
          arrowLeft={<div className='AppSpotlightAppbar__arrow'>‹</div>}
          arrowRight={<div className='AppSpotlightAppbar__arrow'>›</div>}
          wheel={false}
          alignCenter={false}
          alignOnResize={false}
          dragging={false}
          hideSingleArrow={true}
          hideArrows={true}
          arrowDisabledClass='AppSpotlightAppbar__arrow-wrapper--disabled'
          itemClass='AppSpotlightAppbar__item'
          arrowClass='AppSpotlightAppbar__arrow-wrapper'
        />
      )}
    </div>
  )
}

export default AppSpotlightAppbar
