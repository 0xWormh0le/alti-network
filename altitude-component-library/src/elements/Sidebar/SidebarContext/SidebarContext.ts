import { createContext } from 'react'

interface SidebarContextState {
  focusedNavMenu: string | null
  setFocusedNavMenu: (focusedNavMenu: string | null) => void
}

const SidebarContext = createContext<SidebarContextState>({
  focusedNavMenu: null,
  setFocusedNavMenu: () => null
})

export default SidebarContext
