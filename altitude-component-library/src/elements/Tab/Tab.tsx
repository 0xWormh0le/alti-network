import React, { ElementType, ReactNode, useRef, useState, useCallback, useContext, useMemo } from 'react'
import cx from 'classnames'
import { TabContext } from './Tabs'
import { getTabIndexOf } from './helpers'
import { useEffect } from 'react'
import './Tab_.scss'

type RenderComponentFunc = (selected: boolean) => ReactNode

export interface TabProps {
  children?: ReactNode
  className?: string
  selectedClassName?: string
  component?: ReactNode | RenderComponentFunc
  as?: ElementType
  [key: string]: any
}

const Tab: React.FC<TabProps> = ({ as: Comp = 'div', children, className, selectedClassName, component, ...other }) => {
  const tabRef = useRef<HTMLElement>()

  const tabInfo = useContext(TabContext)

  const [selected, setSelected] = useState(false)

  const setSelectedState = useCallback(
    (elem: HTMLElement | undefined) =>
      setSelected(() => {
        const tabIndex = elem ? getTabIndexOf(elem) : null
        return tabInfo.activeTab === tabIndex
      }),
    [tabInfo.activeTab]
  )

  useEffect(() => {
    setSelectedState(tabRef.current)
  }, [tabInfo.activeTab, setSelectedState])

  const handleRef = useCallback(
    (e) => {
      setSelectedState(e)
      tabRef.current = e
    },
    [setSelectedState]
  )

  const render = useMemo(() => {
    if (component) {
      if (React.isValidElement(component)) {
        return component
      } else {
        return (component as RenderComponentFunc)(selected)
      }
    } else {
      return children
    }
  }, [component, children, selected])

  return (
    <Comp
      ref={handleRef}
      aria-roledescription='tab'
      className={cx('Tabs__tab', className, selected ? ['Tabs__tab--selected', selectedClassName] : null)}
      {...other}>
      {render}
    </Comp>
  )
}
export default Tab
