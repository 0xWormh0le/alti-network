export interface WrappedPromise<T> {
  promise: Promise<T>
  cancel: () => void
}

export class PromiseCanceledError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PromiseCanceledError'
  }
}

export function makeCancelable<T>(promise: Promise<T>): WrappedPromise<T> {
  let isCanceled = false

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise
      .then(val => (isCanceled ? reject(new PromiseCanceledError('Promise canceled')) : resolve(val)))
      .catch(error => (isCanceled ? reject(new PromiseCanceledError('Promise canceled')) : reject(error)))
  })

  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true
    }
  }
}
