import React from 'react'

export type SetAuthenticatedUser = (user: AuthenticatedUser | null) => void

export interface IUserContext {
  authenticatedUser: AuthenticatedUser
  domains: string[]
  userHasAuthenticated: SetAuthenticatedUser
  setShowWelcomeDialog: (setShowWelcomeDialog: boolean) => void
  showWelcomeDialog: boolean
}

export const UserContext = React.createContext({} as IUserContext)

export const UserContextProvider = UserContext.Provider
export const UserContextConsumer = UserContext.Consumer
