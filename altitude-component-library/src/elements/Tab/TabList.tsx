import React, { ReactNode, useContext, useState, useRef, useCallback } from 'react'
import cx from 'classnames'
import { TabContext } from './Tabs'
import './TabList.scss'

export interface TabListProps {
  children: ReactNode
  className?: string
}

const TabList: React.FC<TabListProps> = ({ children, className }) => {
  const tabListScrollWrapperRef = useRef(null)
  const scrollRef = useRef<HTMLElement | null>(null)
  const tabInfo = useContext(TabContext)
  const [position, setPosition] = useState(0)
  const [hideLeftArrow, setHideLeftArrow] = useState(true)
  const [hideRightArrow, setHideRightArrow] = useState(false)

  const handleRightArrowClick = useCallback(
    (e) => {
      e.stopPropagation()
      if (tabListScrollWrapperRef.current && tabInfo.width) {
        const tabListScrollWrapper = tabListScrollWrapperRef.current as unknown as HTMLElement
        const scrollWrapperWidth = tabListScrollWrapper.offsetWidth

        setHideLeftArrow(false)
        if (Math.abs(position - tabInfo.scrollAmount) <= tabInfo.width - scrollWrapperWidth) {
          setPosition((p) => p - tabInfo.scrollAmount)
        } else {
          setHideRightArrow(true)
          setPosition(scrollWrapperWidth - tabInfo.width)
        }
      }
    },
    [position, tabInfo.scrollAmount, tabInfo.width]
  )

  const handleLeftArrowClick = useCallback(
    (e) => {
      e.stopPropagation()
      setHideRightArrow(false)
      if (position + tabInfo.scrollAmount < 0) {
        setPosition((p) => p + tabInfo.scrollAmount)
      } else {
        setHideLeftArrow(true)
        setPosition(0)
      }
    },
    [position, tabInfo.scrollAmount]
  )

  const getRef = useCallback(elem => scrollRef.current = elem, [])

  return (
    <div className={cx('Tabs__tab-list', className)}>
      {tabInfo.scroll ? (
        <>
          <div className='Tabs__tab-list-scrolled' ref={getRef}>
            <div
              className={cx('Tabs__tab-list-arrow-left', tabInfo.arrowLeftClassName, {
                'Tabs__tab-list-arrow-left--hidden': hideLeftArrow,
                'Tabs__tab-list-arrow-default': !tabInfo.arrowLeft
              })}
              onClick={handleLeftArrowClick}>
              {tabInfo.arrowLeft ?? '‹'}
            </div>

            <div className='Tabs__tab-list-scroll-wrapper' ref={tabListScrollWrapperRef}>
              <div className='Tabs__tab-list-scroll' style={{ left: `${position}px` }}>
                {children}
              </div>
            </div>

            <div
              className={cx('Tabs__tab-list-arrow-right', tabInfo.arrowRightClassName, {
                'Tabs__tab-list-arrow-right--hidden': hideRightArrow,
                'Tabs__tab-list-arrow-default': !tabInfo.arrowRight
              })}
              onClick={handleRightArrowClick}>
              {tabInfo.arrowRight ?? '›'}
            </div>
          </div>
          <div className='Tabs__tab-list-scroll-spacer' style={{ height: `${scrollRef.current?.clientHeight}px` }} />
        </>
      ) : (
        children
      )}
    </div>
  )
}

export default TabList
