import React, { lazy } from 'react'
import { Switch } from 'react-router-dom'
import { ModalRoute } from 'react-router-modal'
import BaseModalPage from '../BaseModalPage'
import Actionbar from 'components/base/Actionbar'
import Breadcrumb from 'components/elements/Breadcrumb'
import FileContainer from 'components/files/FileContainer'
import LiteFileContainer from 'components/files/FileContainer/LiteFileContainer'
import FileIcon from 'icons/inspector'
import { getQueryString } from 'util/helpers'
import { isLitePlatform } from 'util/platforms'
import './SingleFile.scss'

const EditFilePermission = lazy(() => import('pages/EditFilePermission'))

export default class SingleFile extends BaseModalPage {
  protected pageName = this.routePathNames.FILE

  public renderPageContent() {
    const { match, location } = this.props
    const platformId = getQueryString('platformId') || ''

    const breadcrumb = <Breadcrumb pageName='File' Icon={FileIcon} />

    return (
      <>
        <div className='SingleFile'>
          <Actionbar titleComponent={breadcrumb} closeButtonAction={this.closeModal} />
          {isLitePlatform(platformId) ? (
            <LiteFileContainer fileId={match.params.fileId} isFolder={false} />
          ) : (
            <FileContainer fileId={match.params.fileId} isFolder={false} />
          )}
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
