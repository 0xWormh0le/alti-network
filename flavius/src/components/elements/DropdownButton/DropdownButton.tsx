import React, { useState } from 'react'
import Button from '../Button'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import './DropdownButton.scss'

const Arrow: React.FC<{ arrowClass: string }> = ({ arrowClass }) => {
  return (
    <svg width='12px' height='8px' viewBox='0 0 12 8' version='1.1' className={arrowClass}>
      <polygon id='path-1' points='6 8 12 0 0 0' />
    </svg>
  )
}

export interface ActionType {
  onClick: () => void
  title: string
  link: any
  actionEnabled: boolean
  actionSecondaryText?: string
}

export interface DropdownButtonProps {
  text: string
  actions: ActionType[]
  enabled: boolean
}

const DropdownButton: React.FC<DropdownButtonProps> = (props) => {
  const { text, actions, enabled } = props
  const [arrowClass, setArrowClass] = useState('DropdownPopup--arrow-off')

  return (
    <div className={cx('DropdownWrapper', { disabled: !enabled })} tabIndex={1}>
      <Button
        text={text}
        action='secondary'
        className={cx('Button--dropdown Button--size-medium', enabled ? '' : 'Button--disabled')}
        onMouseOver={() => {
          setArrowClass('DropdownPopup--arrow-on')
        }}
        onMouseOut={() => {
          setArrowClass('DropdownPopup--arrow-off')
        }}
      />
      <Arrow arrowClass={arrowClass} />
      <ul className='DropdownPopup'>
        <span className='DropdownPopup--arrow' />
        {actions.map(({ onClick, title, link, actionEnabled }, index) => {
          return actionEnabled ? (
            <li key={index} className={cx('DropdownPopup--item', { disabled: !actionEnabled })} onClick={onClick}>
              {link === '' ? <span>{title}</span> : <Link to={link}>{title}</Link>}
            </li>
          ) : (
            ''
          )
        })}
      </ul>
    </div>
  )
}

export default DropdownButton
