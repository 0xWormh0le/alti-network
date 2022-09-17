import { FilterItem } from 'components/elements/Filter/Filter'
import { fileActivityOptions } from './activityUtils'

type ActionMap<M extends { [k: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key
      }
    : {
        type: Key
        payload: M[Key]
      }
}

// File Activity state, actions, reducer
export interface FileActivityState {
  activityOptions: FilterItem[]
  createdBefore: string
  createdAfter: string
  limit: string
  accounts: string[]
}

export enum FileActivityActionType {
  CHANGE_ACTIVITY_OPTIONS = 'CHANGE_ACTIVITY_OPTIONS',
  CHANGE_CREATED_BEFORE = 'CHANGE_CREATED_BEFORE',
  CHANGE_CREATED_AFTER = 'CHANGE_CREATED_AFTER',
  CHANGE_LIMIT = 'CHANGE_LIMIT',
  CHANGE_ACCOUNT = 'CHANGE_ACCOUNT',
  ADD_ACCOUNT = 'ADD_ACCOUNT',
  REMOVE_ACCOUNT = 'REMOVE_ACCOUNT',
  RESET = 'RESET'
}

export type FileActivityPayload = {
  [FileActivityActionType.CHANGE_ACTIVITY_OPTIONS]: {
    items: FilterItem[]
  }
  [FileActivityActionType.CHANGE_CREATED_BEFORE]: {
    value: string
  }
  [FileActivityActionType.CHANGE_CREATED_AFTER]: {
    value: string
  }
  [FileActivityActionType.CHANGE_LIMIT]: {
    value: string
  }
  [FileActivityActionType.CHANGE_ACCOUNT]: {
    value: string
    index: number
  }
  [FileActivityActionType.ADD_ACCOUNT]: undefined
  [FileActivityActionType.REMOVE_ACCOUNT]: {
    index: number
  }
  [FileActivityActionType.RESET]: {
    resetState: FileActivityState
  }
}

export type FileActivityAction = ActionMap<FileActivityPayload>[keyof ActionMap<FileActivityPayload>]

export const fileActivityInitialState: FileActivityState = {
  activityOptions: fileActivityOptions,
  createdBefore: '',
  createdAfter: '',
  limit: '100',
  accounts: ['']
}

export const fileActivityInit = (state: FileActivityState): FileActivityState => {
  return state
}

export const fileActivityReducer = (state: FileActivityState, action: FileActivityAction): FileActivityState => {
  switch (action.type) {
    case FileActivityActionType.CHANGE_ACTIVITY_OPTIONS:
      const newActivityOptions = action.payload.items.map((item, i) => ({
        id: item.id,
        value: item.value,
        selected: item.selected,
        label: fileActivityOptions[i].label
      }))

      return {
        ...state,
        activityOptions: newActivityOptions
      }
    case FileActivityActionType.CHANGE_CREATED_BEFORE:
      return {
        ...state,
        createdBefore: action.payload.value
      }
    case FileActivityActionType.CHANGE_CREATED_AFTER:
      return {
        ...state,
        createdAfter: action.payload.value
      }
    case FileActivityActionType.CHANGE_LIMIT:
      return {
        ...state,
        limit: action.payload.value
      }
    case FileActivityActionType.CHANGE_ACCOUNT:
      const { value, index } = action.payload
      const newAccounts = [...state.accounts]
      newAccounts[index] = value

      return {
        ...state,
        accounts: newAccounts
      }
    case FileActivityActionType.ADD_ACCOUNT:
      return {
        ...state,
        accounts: [...state.accounts, '']
      }
    case FileActivityActionType.REMOVE_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.filter((account, i) => i !== action.payload.index)
      }
    case FileActivityActionType.RESET:
      return fileActivityInit(action.payload.resetState)
    default:
      throw new Error('Invalid action type')
  }
}
