import React, { useEffect, useRef } from 'react'

export interface SidebarLinkProps {
  Icon?: React.ReactElement<HTMLOrSVGElement>
  children: React.ReactNode
  isActive?: boolean
}

const SidebarItem: React.FC<SidebarLinkProps> = ({ children, Icon, isActive }) => {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const isMultipleLinks = children && children.hasOwnProperty('length')
    if (!isMultipleLinks) {
      if (ref.current) {
        const { firstElementChild } = ref.current
        if (firstElementChild) {
          firstElementChild.className = `${firstElementChild.className} Sidebar__link`
        }
      }
    }
  }, [])

  return (
    <div className={`Sidebar__item ${(isActive && 'Sidebar__item--active') || ''}`}>
      {Icon && <span className='Sidebar__icon'>{Icon}</span>}
      <span ref={ref}>{children}</span>
    </div>
  )
}

export default SidebarItem
