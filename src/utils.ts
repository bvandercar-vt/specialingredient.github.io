import isEqual from 'lodash/isEqual'

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function retryPromise<T>(
  promise: () => Promise<T>,
  { retries, timeout, onRetry }: { retries: number; timeout?: number; onRetry?: () => void },
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (timeout) setTimeout(() => reject('error: timeout'), timeout)

    const wrapper = (currentRetry: number) => {
      promise()
        .then((res) => resolve(res))
        .catch((err) => {
          if (currentRetry > 0) {
            if (onRetry) onRetry()
            wrapper(currentRetry - 1)
          } else {
            reject(err)
          }
        })
    }

    return wrapper(retries)
  })
}

export function checkHasExactKeys(obj: Record<string, unknown>, keys: string[]) {
  if (!isEqual(Object.keys(obj).sort(), keys.sort()))
    throw new Error(
      `expected object to have keys ${keys.sort()} | object: ${JSON.stringify(obj, null, 2)}`,
    )
}
