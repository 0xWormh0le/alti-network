import { useCollapse } from 'hooks/styleHooks'
import React, { useContext, useEffect } from 'react'
import SidebarContext from '../SidebarContext/SidebarContext'
import { default as ChevronDown } from '../../../icons/chevron-down.svg'

interface SidebarNavMenuProps {
  title: string
  Icon?: React.ReactNode
  children: React.ReactNode[]
}

const SidebarNavMenu: React.FC<SidebarNavMenuProps> = (props) => {
  const { title, children, Icon } = props

  const { focusedNavMenu, setFocusedNavMenu } = useContext(SidebarContext)

  const isOpen = focusedNavMenu === title

  const [ref, maxHeight, setCollapse] = useCollapse()

  useEffect(() => {
    setCollapse(isOpen)
  }, [isOpen])

  return (
    <div className='Sidebar__nav-menu'>
      <span
        onClick={() => {
          if (!isOpen) setFocusedNavMenu(title)
          else setFocusedNavMenu(null)
        }}
        className='Sidebar__item'>
        {Icon && <span className='Sidebar__icon'>{Icon}</span>}
        <span className='Sidebar__link'>
          <span>{title}</span>
          <span className={`Sidebar__nav-menu-arrow ${(isOpen && `Sidebar__nav-menu-arrow--inverted`) || ''} `}>
            <ChevronDown />
          </span>
        </span>
      </span>
      <div ref={ref} style={{ maxHeight }} className='Sidebar__nav-menu-links'>
        {children}
      </div>
    </div>
  )
}

export default SidebarNavMenu
