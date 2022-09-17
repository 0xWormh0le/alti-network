import React from 'react'
import './Spinner.scss'

interface SpinnerProps {
  className?: string
}

const Spinner: React.FC<SpinnerProps> = ({ className }) => (
  <svg className={`Spinner ${className}`} viewBox='0 0 50 50'>
    <circle className='path' cx='25' cy='25' r='20' fill='none' strokeWidth='5' />
  </svg>
)

export default Spinner
