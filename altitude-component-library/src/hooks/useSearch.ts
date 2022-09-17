import { useEffect, useState } from 'react'

export type Maybe<T> = T | null
export type AsyncStateArray<T> = [Maybe<T>, Maybe<{ error: string }>, boolean]

export default (fetchUrl: string, pageNumber: number, limit: number, filters: any, sorts: any) => {
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const url = fetchUrl
    fetch(url).then((rs) => {
      rs.json().then((json) => {
        setResults(json.data)
        setIsLoading(false)
      })
    })
  }, [fetchUrl, pageNumber, limit, filters, sorts])

  return [results, isLoading]
}

export const useAsyncState = <T>(promiseGen: () => Promise<T> | null, depArr?: any[]): AsyncStateArray<T> => {
  const [result, setResult] = useState<T | null>(null)
  const [error, setError] = useState<{
    error: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setResult(null)
      setError(null)
    }
  }, [isLoading])

  useEffect(() => {
    const promise = promiseGen()
    if (!promise) return
    setIsLoading(true)
    promise
      .catch((err) => {
        setError({
          error: err.message || JSON.stringify(err)
        })
        setIsLoading(false)
      })
      .then((res) => {
        if (res) setResult(res)
        setIsLoading(false)
      })
  }, depArr || [])

  return [result, error, isLoading]
}
