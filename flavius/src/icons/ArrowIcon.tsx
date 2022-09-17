import React from 'react'
import CSS from 'csstype'

interface ArrowIconProps {
  fill?: string
  direction?: string
  style?: CSS.Properties
  className?: string
}

const ArrowRightIcon: React.FC<ArrowIconProps> = (props) => {
  const direction = props.direction === 'left' ? { transform: 'rotate(180deg)' } : {}
  const style = props.style ? { ...props.style, ...direction } : direction
  const className = props.className || ''

  return (
    <svg
      width='14'
      height='10'
      viewBox='0 0 14 10'
      xmlns='http://www.w3.org/2000/svg'
      style={style}
      className={className}>
      <path d='M13.7709 4.44699L13.7702 4.44624L9.68797 0.383747C9.38215 0.0794116 8.8875 0.0805441 8.58309 0.386403C8.27871 0.692223 8.27988 1.18687 8.5857 1.49125L11.3265 4.21874H0.78125C0.349766 4.21874 0 4.56851 0 4.99999C0 5.43148 0.349766 5.78124 0.78125 5.78124H11.3264L8.58574 8.50874C8.27992 8.81312 8.27875 9.30776 8.58313 9.61358C8.88754 9.91948 9.38223 9.92054 9.68801 9.61624L13.7702 5.55374L13.7709 5.553C14.0769 5.24761 14.0759 4.75136 13.7709 4.44699Z' />
    </svg>
  )
}

export default ArrowRightIcon
