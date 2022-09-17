import { useState, useEffect, useRef } from 'react'
export const useCollapse = (
  collapsedByDefault?: boolean
): [React.MutableRefObject<any>, string, (collapsed: boolean) => void] => {
  const [maxHeight, setMaxHeight] = useState<string>('0px')
  const [collapse, setCollapse] = useState<boolean>(collapsedByDefault || false)

  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (ref.current) {
      if (!ref.current.style.overflow) {
        ref.current.style.overflow = 'hidden'
      }
      setMaxHeight(collapse ? `${ref.current.scrollHeight}px` : '0px')
    }
  }, [collapse])

  return [ref, maxHeight, setCollapse]
}
