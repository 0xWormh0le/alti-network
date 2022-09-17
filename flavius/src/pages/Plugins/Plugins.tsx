import React from 'react'
import Actionbar from 'components/base/Actionbar'
import BasePage from '../BasePage'
import config from 'config'
import './Plugins.scss'

export default class Plugins extends BasePage<{}, {}> {
  protected pageName = config.navigationItemsNames.PLUGINS

  public renderPageContent() {
    return (
      <div className='Plugins'>
        <Actionbar titleComponent='Plugins' />
      </div>
    )
  }
}
