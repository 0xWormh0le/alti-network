import { GENERAL_URLS, INTEGRATION_URLS } from 'api/endpoints'
import Amplify from 'aws-amplify'
import React, { Fragment, useEffect } from 'react'

const [internalEndpoints, integrationEndpoints] = [GENERAL_URLS, INTEGRATION_URLS].map((urls) =>
  Object.keys(urls).map((nextKey: string) => {
    return {
      name: nextKey.toLowerCase(),
      endpoint: `/api`
    }
  })
)

const StorybookAmplifyContainer: React.FunctionComponent = (props) => {
  useEffect(() => {
    Amplify.configure({
      API: {
        endpoints: [...internalEndpoints, ...integrationEndpoints]
      }
    })
  }, [])

  return <Fragment>{props.children}</Fragment>
}

export default StorybookAmplifyContainer
