import React from 'react'
import BaseModalPage from '../BaseModalPage'
import Actionbar from 'components/base/Actionbar'
import AppSpotlightContainer from 'components/app-spotlight/AppSpotlightContainer'
import Breadcrumb from 'components/elements/Breadcrumb'
import SpotlightIcon from 'icons/spotlight'
import { getQueryString } from 'util/helpers'
import './AppSpotlight.scss'

export default class AppSpotlight extends BaseModalPage {
  protected pageName = this.routePathNames.APP_SPOTLIGHT

  public renderPageContent() {
    const { match } = this.props
    const platformId: string = getQueryString('platformId') || ''

    const breadcrumb = <Breadcrumb pageName='App Spotlight' Icon={SpotlightIcon} />

    return (
      <div className='AppSpotlight'>
        <Actionbar titleComponent={breadcrumb} closeButtonAction={this.closeModal} />
        <AppSpotlightContainer wrapperType='modal' applicationId={match.params.applicationId} platformId={platformId} />
      </div>
    )
  }
}
