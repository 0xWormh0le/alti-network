import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import Checkmark from './checkmark'
import NotificationWarning from './notification-warning'
import NotificationSuccess from './notification-success'
import NotificationError from './notification-error'
import History from './history'
import Help from './help'
import TooltipWrappedManagerPermissionsIcon from './TooltipWrappedManagePermissionsIcon'
import TooltipWrappedLockoutIcon from './TooltipWrappedLockoutIcon'
import TooltipWrappedGlobeIcon from './TooltipWrappedGlobeIcon'
import TooltipWrappedEmailIcon from './TooltipWrappedEmailIcon'
import View from './view'

describe('People', () => {
  const props = {
    className: 'icon-class',
    text: 'icon'
  }

  it('renders correctly', () => {
    let container = renderWithRouter(<Checkmark {...props} />).container
    expect(container.querySelector('svg')).toHaveClass('icon-class')

    container = renderWithRouter(<NotificationWarning {...props} />).container
    expect(container.querySelector('svg')).toHaveClass('icon-class')

    container = renderWithRouter(<NotificationSuccess {...props} />).container
    expect(container.querySelector('svg')).toHaveClass('icon-class')

    container = renderWithRouter(<NotificationError {...props} />).container
    expect(container.querySelector('svg')).toHaveClass('icon-class')

    container = renderWithRouter(<History {...props} />).container
    expect(container.querySelector('svg')).toHaveClass('icon-class')

    container = renderWithRouter(<Help {...props} />).container
    expect(container.querySelector('svg')).toHaveClass('icon-class')

    container = renderWithRouter(<TooltipWrappedManagerPermissionsIcon {...props} />).container
    expect(container.querySelector('svg')).toHaveClass('icon-class')

    container = renderWithRouter(<TooltipWrappedLockoutIcon {...props} />).container
    expect(container.querySelector('svg')).toHaveClass('icon-class')

    container = renderWithRouter(<TooltipWrappedGlobeIcon {...props} />).container
    expect(container.querySelector('svg')).toHaveClass('icon-class')

    container = renderWithRouter(<TooltipWrappedEmailIcon {...props} />).container
    expect(container.querySelector('svg')).toHaveClass('icon-class')

    container = renderWithRouter(<View {...props} />).container
    expect(container.querySelector('svg')).toHaveClass('icon-class')
  })
})
