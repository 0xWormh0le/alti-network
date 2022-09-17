import React from 'react'
import { Link } from 'react-router-dom'
import Button, { ButtonProps } from '../Button'
import './NavButton.scss'

export interface NavButtonProps extends ButtonProps {
  route: string
}

// A wrapper around the html5 button that supports native navigation such as secondary click to open in new tab
export class NavButton extends React.Component<NavButtonProps> {
  public render() {
    const { route, action, isLoading, text, loadingText, className, disabled, size, ...otherProps } = this.props

    return (
      <Link className='NavButton' to={route}>
        <Button
          size={size}
          action={action}
          isLoading={isLoading}
          text={text}
          loadingText={loadingText}
          className={className}
          disabled={disabled}
          {...otherProps}
        />
      </Link>
    )
  }
}

export default NavButton
