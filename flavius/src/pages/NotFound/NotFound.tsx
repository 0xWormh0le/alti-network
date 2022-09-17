import React from 'react'
import Actionbar from 'components/base/Actionbar'
import BasePage from '../BasePage'
import config from 'config'
import UI_STRINGS from 'util/ui-strings'

import './NotFound.scss'

class NotFound extends BasePage<{}, {}> {
  protected pageName = config.navigationItemsNames.NOT_FOUND

  public renderPageContent() {
    return (
      <div className='NotFound'>
        <Actionbar titleComponent={UI_STRINGS.NOT_FOUND.PAGE_NOTFOUND} />
      </div>
    )
  }
}

export default NotFound
