import React, { lazy } from 'react'
import { Switch } from 'react-router-dom'
import { ModalRoute } from 'react-router-modal'

import BaseModalPage from '../BaseModalPage'
import Actionbar from 'components/base/Actionbar'
import Breadcrumb from 'components/elements/Breadcrumb'
import FileIcon from 'icons/inspector'
import FileContainer from 'components/files/FileContainer'
import './FolderInspector.scss'

const EditFilePermission = lazy(() => import('pages/EditFilePermission'))

export default class FolderInspector extends BaseModalPage {
  protected pageName = this.routePathNames.FILE

  public renderPageContent() {
    const { match, location } = this.props

    const breadcrumb = <Breadcrumb pageName='Folder Inspector' Icon={FileIcon} />

    return (
      <>
        <div className='FolderInspectorContainer'>
          <Actionbar titleComponent={breadcrumb} closeButtonAction={this.closeModal} />
          <FileContainer fileId={match.params.fileId} isFolder={true} />
        </div>
        <Switch>
          <ModalRoute
            inClassName='ModalWrapper__EditFilePermission'
            path={`${match.path}/permissions`}
            parentPath={match.url + location.search}
            component={EditFilePermission}
          />
        </Switch>
      </>
    )
  }
}
