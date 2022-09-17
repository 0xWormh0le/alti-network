import React from 'react'
import ContentLoader from 'react-content-loader'

import './DashboardRiskTileLoading.scss'

export const DashboardRiskTileLoading = () => (
  <div className='DashboardRiskTile DashboardRiskTileLoading'>
    <ContentLoader
      backgroundColor='#eeeeee'
      foregroundColor='#fdfdfd'
      height={50}
      className='DashboardRiskTileLoading__title'
      uniqueKey='DashboardRiskTileLoading__title'>
      <rect x={0} y={0} width='100%' height={50} />
    </ContentLoader>
    <div className='DashboardRiskTileLoading__top'>
      <ContentLoader
        backgroundColor='#eeeeee'
        foregroundColor='#fdfdfd'
        height={30}
        width={30}
        className='DashboardRiskTileLoading__avatar'
        uniqueKey='DashboardRiskTileLoading__avatar'>
        <circle cx={20} cy={20} r={20} />
      </ContentLoader>
      <ContentLoader
        backgroundColor='#eeeeee'
        foregroundColor='#fdfdfd'
        height={30}
        className='DashboardRiskTileLoading__desc'
        uniqueKey='DashboardRiskTileLoading__desc'>
        <rect x={0} y={0} width='100%' height={40} />
      </ContentLoader>
    </div>
    <ContentLoader
      backgroundColor='#eeeeee'
      foregroundColor='#fdfdfd'
      height={67}
      className='DashboardRiskTileLoading__button'
      uniqueKey='DashboardRiskTileLoading__button'>
      <rect x={0} y={0} width='100%' height={67} />
    </ContentLoader>
  </div>
)

export default DashboardRiskTileLoading
