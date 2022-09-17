import React, { lazy } from 'react'
import { Switch } from 'react-router-dom'
import { ModalRoute } from 'react-router-modal'
import BaseModalPage, { BaseModalPageProps } from '../BaseModalPage'
import Actionbar from 'components/base/Actionbar'
import Breadcrumb from 'components/elements/Breadcrumb'
import ResolveRiskContainer from 'components/resolve-risk/ResolveRiskContainer'
import { parseQueryString } from 'util/helpers'
import './ResolveRisk.scss'

interface ResolveRiskProps extends BaseModalPageProps {
  requestRisk: () => void
}

const EditFilePermission = lazy(() => import('pages/EditFilePermission'))

export default class ResolveRisk<P extends ResolveRiskProps> extends BaseModalPage {
  protected pageName = this.routePathNames.RESOLVE_RISK

  public renderPageContent() {
    const {
      requestRisk,
      match,
      location: { search }
    } = this.props as P
    const parsedQuery = parseQueryString(search)
    const { email, fileCount, appName, appId, riskTypeId } = parsedQuery
    const breadcrumb = <Breadcrumb pageName='Resolve Risk' />

    return (
      <div className='ResolveRisk'>
        <Actionbar titleComponent={breadcrumb} closeButtonAction={this.closeModal} />
        <ResolveRiskContainer
          riskId={match.params.riskId}
          email={email}
          fileCount={Number(fileCount)}
          appName={appName}
          appId={appId}
          requestRisk={requestRisk}
          riskTypeId={riskTypeId}
        />
        <Switch>
          <ModalRoute
            inClassName='ModalWrapper__EditFilePermission'
            path={`${match.path}/permissions/:fileId`}
            parentPath={match.url + search}
            component={EditFilePermission}
          />
        </Switch>
      </div>
    )
  }
}
