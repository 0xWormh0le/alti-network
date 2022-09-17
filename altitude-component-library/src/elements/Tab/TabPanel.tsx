import React, { ReactNode, useCallback, useContext, useState } from 'react'
import cx from 'classnames'
import { TabContext } from './Tabs'
import { getTabPanelIndexOf } from './helpers'
import './TabPanel.scss'

export interface TabPanelProps {
  children: ReactNode
  className?: string
}

const TabPanel: React.FC<TabPanelProps> = ({ children, className }) => {
  const [selected, setSelected] = useState(false)

  const [visited, setVisited] = useState(false)

  const tabInfo = useContext(TabContext)

  const handleRef = useCallback(
    (elem) => {
      const tabIndex = elem ? getTabPanelIndexOf(elem) : null
      setSelected(tabInfo.activeTab === tabIndex)
      if (tabInfo.activeTab === tabIndex) {
        setVisited(true)
      }
    },
    [tabInfo.activeTab]
  )

  const cls = ['Tabs__tab-panel', className, tabInfo.panelClassName].join(' ')

  return (
    <div ref={handleRef} aria-roledescription='tabPanel' className={cx({ [cls]: selected, hidden: !selected })}>
      {(tabInfo.remountOnSelect && selected || !tabInfo.remountOnSelect && visited) && children}
    </div>
  )
}

export default TabPanel
