import React, { MouseEvent, useState, ReactNode, useEffect, useCallback, useRef } from 'react'
import cx from 'classnames'
import { getTabIndexOf } from './helpers'
import './Tabs.scss'

export interface TabsProps {
  children: ReactNode
  width?: number
  className?: string
  panelClassName?: string
  defaultActiveTab?: number
  activeTab?: number
  arrowLeft?: ReactNode
  arrowRight?: ReactNode
  arrowLeftClassName?: string
  arrowRightClassName?: string
  remountOnSelect?: boolean
  onSelect?: (index: number) => void
}

type TabContextType = {
  activeTab?: number
  width?: number
  arrowLeft?: ReactNode
  arrowRight?: ReactNode
  arrowLeftClassName?: string
  arrowRightClassName?: string
  panelClassName?: string
  scroll: boolean
  remountOnSelect: boolean
  scrollAmount: number
}

export const TabContext = React.createContext<TabContextType>({
  scroll: false,
  scrollAmount: 0,
  remountOnSelect: false
})

const Tabs: React.FC<TabsProps> = ({
  children,
  width,
  className,
  defaultActiveTab,
  activeTab,
  arrowLeft,
  arrowRight,
  arrowLeftClassName,
  arrowRightClassName,
  panelClassName,
  remountOnSelect,
  onSelect
}) => {
  const tabsRef = useRef<HTMLElement | null>(null)

  const [clientWidth, setClientWidth] = useState(0)

  const [activeTabIndex, setActiveTabIndex] = useState(Math.max(defaultActiveTab ?? 0, 0))

  const actualActiveTab = activeTab ?? activeTabIndex ?? 0

  const handleTabClick = useCallback(
    (e: MouseEvent) => {
      let element = e.target as HTMLElement

      while (element && element.parentElement && element.getAttribute('aria-roledescription') !== 'tab') {
        if (tabsRef.current === element) {
          return
        }
        element = element.parentElement
      }

      if (element.getAttribute('aria-roledescription') !== 'tab') {
        return
      }

      const clickedTab = getTabIndexOf(element)

      if (onSelect) {
        onSelect(clickedTab)
      }

      if (activeTab === undefined) {
        setActiveTabIndex(clickedTab)
      }
    },
    [activeTab, onSelect]
  )

  useEffect(() => {
    const resizeHandler = () => {
      if (tabsRef.current) {
        setClientWidth(tabsRef.current.clientWidth)
      }
    }

    resizeHandler()
    window.addEventListener('resize', resizeHandler)

    return () => window.removeEventListener('resize', resizeHandler)
  }, [tabsRef])

  const getTabsRef = useCallback(elem => tabsRef.current = elem, [])

  return (
    <div className={cx('Tabs', className)} onClick={handleTabClick} ref={getTabsRef}>
      <TabContext.Provider
        value={{
          activeTab: actualActiveTab,
          width,
          arrowLeft,
          arrowRight,
          arrowLeftClassName,
          arrowRightClassName,
          panelClassName,
          remountOnSelect,
          scroll: width ? clientWidth < width : false,
          scrollAmount: clientWidth / 3
        }}>
        {children}
      </TabContext.Provider>
    </div>
  )
}

Tabs.defaultProps = {
  remountOnSelect: false
}

export default Tabs
