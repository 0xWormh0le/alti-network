import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { getParamValue, queryToParamValue } from 'util/helpers'

/**
 * @param queryKey  Query Param key
 * @param defaultValue  Default value if no value is found
 * @param companionParamsOnChange Companion Param values that change whenever the target query changes
 * @param prefix Optional prefix name, in case we want to prefix the query param,
 * e.g. if pass 'files', the query name will be files-queryKey instead of queryKey
 */
const useQueryParam = <T extends QueryParamValue>(
  queryKey: string,
  defaultValue: T,
  companionParamsOnChange: { [k: string]: QueryParamValue } = {},
  prefix?: string
) => {
  const history = useHistory()
  const location = useLocation()

  const search = location?.search
  const initialQuery = new URLSearchParams(search)
  const key: string = prefix ? `${prefix}-${queryKey}` : queryKey // files-platformIds

  // Get the initial queries used simply for the initial state, no other use.
  const [queryValueRaw, setQueryValueRaw] = useState<string | null>(initialQuery.get(key))

  const [value, setValue] = useState<T>(() => {
    // Only generate a new param value if value raw is provided, otherwise use default
    if (queryValueRaw) {
      return queryToParamValue<T>(queryValueRaw)
    }
    return defaultValue
  })

  // This is the only time the value is directly updated.
  useEffect(() => {
    const newValue = (queryValueRaw && queryToParamValue<T>(queryValueRaw)) || defaultValue

    // Stringifying to compare all types the same way
    if (JSON.stringify(newValue) !== JSON.stringify(value)) {
      setValue(newValue)
    }
  }, [setValue, queryValueRaw, value, defaultValue])

  // Simply updating the specific value raw for that key
  useEffect(() => {
    const query = new URLSearchParams(search)
    setQueryValueRaw(query.get(key))
  }, [search, key])

  // This does not (and should not) touch state directly.
  // This alters the above search indirectly, which therein alters state.
  const setNewValue = (newValue: T): void => {
    if (key && newValue && value !== newValue) {
      const newQuery = new URLSearchParams(history.location.search)

      newQuery.set(key, getParamValue(newValue))
      Object.entries(companionParamsOnChange).forEach(([companionKey, companionValue]) => {
        newQuery.set(companionKey, getParamValue(companionValue))
      })

      history.push({ search: newQuery.toString() })
    }
  }

  return [value, setNewValue] as const
}

export default useQueryParam
