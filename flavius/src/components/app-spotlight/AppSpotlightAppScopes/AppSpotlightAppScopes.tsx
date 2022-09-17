import React from 'react'

import './AppSpotlightAppScopes.scss'

export interface AppSpotlightAppScopesProps {
  scopes: string[]
}

export const AppSpotlightAppScopes: React.SFC<AppSpotlightAppScopesProps> = ({ scopes }) => {
  return (
    <ul className='AppSpotlightAppScopes'>
      {scopes?.map((scope, index) => (
        <li key={index.toString()}>{scope}</li>
      ))}
    </ul>
  )
}

export default AppSpotlightAppScopes
