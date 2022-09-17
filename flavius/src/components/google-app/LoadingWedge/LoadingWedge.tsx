import React from 'react'
import './LoadingWedge.scss'

interface LoadingWedgeProps {
  className?: string
}

const LoadingWedge: React.FC<LoadingWedgeProps> = ({ children, className }) => {
  return (
    <div className={`LoadingWedge ${className}`}>
      <img alt='' src='/animations/wedges.gif' /> {children}
    </div>
  )
}

export default LoadingWedge
