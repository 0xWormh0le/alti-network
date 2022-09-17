import React from 'react'
import { detect } from 'detect-browser'
import ContentLoader from 'react-content-loader'

const TableLoading = () => {
  const browser = detect()
  return browser?.name === 'safari' ? (
    <div className='Table TableLoading'>
      <div className='TableLoading__loading-skeleton' />
      <div className='TableLoading__loading-skeleton' />
      <div className='TableLoading__loading-skeleton' />
      <div className='TableLoading__loading-skeleton' />
      <div className='TableLoading__loading-skeleton' />
      <div className='TableLoading__loading-skeleton TableLoading__loading-skeleton-btn' />
    </div>
  ) : (
    <div className='Table TableLoading'>
      <ContentLoader
        backgroundColor='#f0f0f0'
        foregroundColor='#f7f7f7'
        preserveAspectRatio='none'
        height={365}
        uniqueKey='table-loading'
        className='TableLoading__loader'>
        <rect x={0} y={0} width='100%' height={52} />
        <rect x={0} y={62} width='100%' height={52} />
        <rect x={0} y={124} width='100%' height={52} />
        <rect x={0} y={186} width='100%' height={52} />
        <rect x={0} y={248} width='100%' height={52} />
        <rect x='90%' y={310} width='10%' height={40} />
      </ContentLoader>
    </div>
  )
}

export default TableLoading
