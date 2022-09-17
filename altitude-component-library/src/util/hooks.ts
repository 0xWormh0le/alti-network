import { useEffect, useRef, useMemo } from 'react'
import { makeCancelable, WrappedPromise } from './cancelable-promise'

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
        promises.current.forEach(p => p.cancel())
        promises.current = []
      }
    }
  }, [])

  const cancelablePromise = useMemo(
    () => (p: Promise<any>): Promise<any> => {
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
