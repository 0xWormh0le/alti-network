import React from 'react'
import ContentLoader from 'react-content-loader'

export const PlatformCardLoading = () => (
  <div className='PlatformCard PlatformCardLoading'>
    <ContentLoader
      backgroundColor='#eeeeee'
      foregroundColor='#fdfdfd'
      height={50}
      className='PlatformCard__loading-title'
      uniqueKey='PlatformCard__loading-title'>
      <rect x={0} y={0} width='100%' height={50} />
    </ContentLoader>
    <ContentLoader
      backgroundColor='#eeeeee'
      foregroundColor='#fdfdfd'
      height={150}
      width='100%'
      className='PlatformCard__loading-body'
      uniqueKey='PlatformCardLoading__loading-body'>
      <rect x={0} y={0} width='100%' height={150} />
    </ContentLoader>
  </div>
)

export default PlatformCardLoading
