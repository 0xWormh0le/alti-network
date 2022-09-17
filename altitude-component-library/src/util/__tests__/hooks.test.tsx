import React, { useEffect } from 'react'
import { render } from '@testing-library/react'
import useCancelablePromise, { useInterval } from '../hooks'
import { PromiseCanceledError } from '../cancelable-promise'

const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('success'), 1000)
})

interface TestHookProps {
  callback: () => void
}

const TestHook: React.FC<TestHookProps> = (props) => {
  const { callback } = props
  callback()
  return null
}

let cp: any = null

describe('useCancelablePromise', () => {
  it('works correctly', () => {
    const action = () => {
      const cancelablePromise = useCancelablePromise()
      useEffect(() => {
        cp = cancelablePromise(promise)
      }, [])
    }
    const { unmount } = render(<TestHook callback={action} />)
    const err = new PromiseCanceledError('Promise canceled')
    unmount()
    expect(cp).rejects.toEqual(err)
  })
})

describe('useInterval', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('emits interval callback correctly', () => {
    let count = 0
    const timerCallback = () => count++
    const action = () => {
      useInterval(timerCallback, 1000)
    }
    const { unmount } = render(<TestHook callback={action} />)
    jest.advanceTimersByTime(5000)
    unmount()
    expect(count).toBe(5)
  })
})
