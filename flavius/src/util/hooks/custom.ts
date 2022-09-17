import React, { useEffect, useRef, useMemo, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { makeCancelable, WrappedPromise } from '../cancelable-promise'
import { retrieveFromStorage, storeInStorage } from '../storage'
import useQueryParam from './useQueryParam'
import CONSTANTS from '../constants'

export const usePrevious = <T>(value: T | undefined): T | undefined => {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export default function useCancelablePromise(cancelable = makeCancelable) {
  const emptyPromise = Promise.resolve(true)

  // test if the input argument is a cancelable promise generator
  if (cancelable(emptyPromise).cancel === undefined) {
    throw new Error('promise wrapper argument must provide a cancel() function')
  }

  const promises = useRef<Array<WrappedPromise<any>>>()

  useEffect(() => {
    promises.current = promises.current || []
    return function cancel() {
      if (promises.current) {
        promises.current.forEach((p) => p.cancel())
        promises.current = []
      }
    }
  }, [])

  const cancelablePromise = useMemo(
    () =>
      (p: Promise<any>): Promise<any> => {
        const cPromise = cancelable(p)
        if (promises.current) {
          promises.current.push(cPromise)
        }
        return cPromise.promise
      },
    [cancelable]
  )

  return cancelablePromise
}

export const useInterval = (callback: () => any, delay = 0, immediate = false) => {
  const savedCallback = useRef(() => null)

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      const anyCallback = savedCallback as any
      anyCallback.current()
    }
    if (immediate) {
      tick()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
    return () => null
  }, [delay, immediate])
}

export function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: (e: Event) => void) {
  useEffect(() => {
    const listener = (event: Event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref?.current || ref?.current.contains(event.target as Node)) {
        return
      }
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

export const makePageSizeKey = (key: string | undefined) => {
  return key
    ? `${key
        .replace(new RegExp('(/|:)', 'g'), '.')
        .split('.')
        .filter((v) => !!v)
        .map((s) => s[0])
        .join('')}-${Array.from(key).reduce((pv, cv) => pv + cv.charCodeAt(0), 0)}-pageSize`
    : 'pageSize'
}

const { MAX_PAGE_SIZE, MIN_PAGE_SIZE, DEFAULT_PAGE_SIZE } = CONSTANTS

export const useGetCachedPageSize = (
  companionParamsOnChange?: Dictionary<QueryParamValue>
): [number, (size: number) => void] => {
  const routeMatch = useRouteMatch()
  const mainKey = 'page-size'
  const key = routeMatch?.path

  const initial = retrieveFromStorage<Dictionary<number>>(mainKey)

  const pageSize = initial && initial[key]

  // Null checking for UTs to work without rendering a router
  const [queryPageSize, setQueryPageSize] = useQueryParam(makePageSizeKey(key), pageSize, {
    ...companionParamsOnChange
  })

  const setCachedPageSize = (size: number) => {
    const pagingObject = retrieveFromStorage<Dictionary<number>>(mainKey)
    storeInStorage(mainKey, { ...pagingObject, [key]: size })
    setQueryPageSize(size)
  }

  // Page Size can never be more than MAX_PAGE_SIZE or less than MIN_PAGE_SIZE,
  // default to DEFAULT_PAGE_SIZE is no query param or preference is available
  const isBadPageSize =
    !queryPageSize || queryPageSize > MAX_PAGE_SIZE || queryPageSize < MIN_PAGE_SIZE || !Number.isInteger(queryPageSize)

  // Extra null guard checking for different tslint versions to let this compile
  const filteredPageSize = isBadPageSize || !queryPageSize ? DEFAULT_PAGE_SIZE : queryPageSize

  return [filteredPageSize, setCachedPageSize]
}

export const useBoundingClientRect = (wrapperRef: React.RefObject<HTMLElement>) => {
  const [boundingClientRect, setBoundingClientRect] = useState<DOMRect>({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0
  } as DOMRect)

  useEffect(() => {
    const resizeHandler = () => {
      if (wrapperRef.current) {
        setBoundingClientRect(wrapperRef.current.getBoundingClientRect())
      }
    }

    resizeHandler()
    window.addEventListener('resize', resizeHandler)

    return () => window.removeEventListener('resize', resizeHandler)
  }, [wrapperRef])

  return boundingClientRect
}
