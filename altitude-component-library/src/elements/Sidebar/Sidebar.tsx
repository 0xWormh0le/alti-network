import React, { useState } from 'react'
import './Sidebar.scss'
import SidebarContext from './SidebarContext'

export interface SidebarProps {
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({ children, className }) => {
  const [focusedNavMenu, setFocusedNavMenu] = useState<string | null>(null)
  return (
    <SidebarContext.Provider
      value={{
        focusedNavMenu,
        setFocusedNavMenu
      }}>
      <nav className={`Sidebar ${className || ''}`}>{children}</nav>
    </SidebarContext.Provider>
  )
}

export default Sidebar
