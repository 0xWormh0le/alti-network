import React from 'react'

interface WithContentLoaderProps {
  loading?: boolean
}

const withContentLoader = (loaderComponent: React.FC<{}>) => <P extends object>(Component: React.ComponentType<P>) => {
  const ContentLoaderWrapper: React.FC<P & WithContentLoaderProps> = (props: P) => {
    const { loading, ...componentProps } = props as WithContentLoaderProps
    const Loader = loaderComponent
    return loading ? <Loader /> : <Component {...(componentProps as P)} />
  }
  return ContentLoaderWrapper
}

export default withContentLoader
