import React from 'react'
import BaseModalPage from '../BaseModalPage'
import Actionbar from 'components/base/Actionbar'
import EditFilePermissionContainer from 'components/edit-permission/EditFilePermissionContainer'
import EditLiteFilePermissionContainer from 'components/edit-permission/EditFilePermissionContainer/EditLiteFilePermissionContainer'
import { getQueryString } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import { isLitePlatform } from 'util/platforms'
import './EditFilePermission.scss'

export default class EditFilePermission extends BaseModalPage {
  public renderPageContent() {
    const { match } = this.props
    const platformId: string = getQueryString('platformId') || ''

    return (
      <div className='EditFilePermission'>
        <Actionbar
          titleComponent={UI_STRINGS.EDIT_PERMISSIONS.EDIT_FILE_PERMISSIONS}
          closeButtonAction={this.closeModal}
        />
        {isLitePlatform(platformId) ? (
          <EditLiteFilePermissionContainer fileId={match.params.fileId} platformId={platformId} />
        ) : (
          <EditFilePermissionContainer
            fileId={match.params.fileId}
            riskId={match.params.riskId}
            platformId={platformId}
          />
        )}
      </div>
    )
  }
}
