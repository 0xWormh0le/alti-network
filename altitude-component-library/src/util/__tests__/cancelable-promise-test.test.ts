import { PromiseCanceledError, makeCancelable } from 'util/cancelable-promise'

describe('cancelable promise', () => {
  it('works correctly', () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve('success'), 1000)
    })
    const err = new PromiseCanceledError('Promise canceled')
    const { promise: cancelablePromise, cancel } = makeCancelable(promise)
    cancel()
    expect(cancelablePromise).rejects.toEqual(err)
  })
})
