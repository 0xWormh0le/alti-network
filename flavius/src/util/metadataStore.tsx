import { noop } from 'lodash'
import React, { createContext, useCallback, useReducer } from 'react'

interface MetadataStoreContextFunctions {
  addValue: (key: string, value: any) => void
  removeValue: (key: string) => void
  retrieveValue: <T = any>(key: string, defaultValue?: T) => Maybe<T>
}

export const MetadataStoreContext = createContext<MetadataStoreContextFunctions>({
  addValue: noop,
  removeValue: noop,
  retrieveValue: () => null
})

enum MetadataActionTypes {
  ADD_VALUE = 'ADD_VALUE',
  REMOVE_VALUE = 'REMOVE_VALUE'
}

const metadataReducer = (
  state: Dictionary<any>,
  action: { type: MetadataActionTypes; key: string; value?: any }
): Dictionary<any> => {
  const { type } = action
  switch (type) {
    case MetadataActionTypes.ADD_VALUE:
      return {
        ...state,
        [action.key]: action.value
      }
    case MetadataActionTypes.REMOVE_VALUE:
      return Object.fromEntries(Object.entries(state).filter(([key]) => key !== action.key))

    default:
      return state
  }
}

export const MetadataStore: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(metadataReducer, {})

  const addValue = useCallback(
    (key, value) => dispatch({ key, value, type: MetadataActionTypes.ADD_VALUE }),
    [dispatch]
  )
  const removeValue = useCallback((key) => dispatch({ key, type: MetadataActionTypes.REMOVE_VALUE }), [dispatch])
  const retrieveValue = useCallback((key, defaultValue) => state[key] || defaultValue, [state])

  return (
    <MetadataStoreContext.Provider
      value={{
        addValue,
        removeValue,
        retrieveValue
      }}>
      {children}
    </MetadataStoreContext.Provider>
  )
}

export default MetadataStore
