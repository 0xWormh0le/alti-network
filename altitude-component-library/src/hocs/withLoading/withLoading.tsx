import React from 'react'
import Loading from 'components/widgets/Loading'
import './withLoading.scss'

interface WithLoadingProps {
  loading: boolean
}

const withLoading = <P extends object, S extends object>(Component: React.ComponentType<P>) =>
  class WithLoading extends React.Component<P & WithLoadingProps, S> {
    public render() {
      const { loading, ...props } = this.props as WithLoadingProps
      return loading ? (
        <div className='Loading__wrapper'>
          <Loading />
        </div>
      ) : (
        <Component {...(props as P)} />
      )
    }
  }
export default withLoading
