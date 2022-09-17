import React from 'react'
import cx from 'classnames'
import Button from 'elements/Button'
import './SlidingPanel.scss'
import UI_STRINGS from 'util/ui-strings'

export interface SlidingPanelProps {
  visible?: boolean
  title?: string
  onConfirm?: (...args: any[]) => any
  onCancel?: (...args: any[]) => any
}

const SlidingPanel: React.FC<SlidingPanelProps> = ({ visible, title, children, onConfirm, onCancel }) => (
  <aside className={cx('SlidingPanel', { 'SlidingPanel--visible': visible })}>
    <button className='SlidingPanel__close-button' aria-label='Close sliding panel' onClick={onCancel}>
      &times;
    </button>
    <h3 className='SlidingPanel__title'>{title}</h3>
    <section className='SlidingPanel__content'>{children}</section>
    <div className='SlidingPanel__buttons'>
      <Button className='SlidingPanel__button' action='primary' onClick={onConfirm} text={UI_STRINGS.SIDEBAR.CONFIRM} />
      <Button
        className='SlidingPanel__button'
        action='cancel_primary'
        onClick={onCancel}
        text={UI_STRINGS.BUTTON_LABELS.CANCEL}
      />
    </div>
  </aside>
)

export default SlidingPanel
