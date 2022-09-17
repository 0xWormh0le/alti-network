import React, { Component } from 'react'
import * as Sentry from '@sentry/browser'
import Analytics from 'util/analytics'
import config from 'config'
import './BasePage.scss'

const { navigationItemsNames } = config

class BasePage<P extends object, S extends object> extends Component<P, S> {
  protected pageName: string = ''
  protected routePathNames = navigationItemsNames

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
      this.onEscKeyDown()
    }
  }

  protected onEscKeyDown() {
    return // this method should be overriden
  }

  protected renderPageContent() {
    return <div /> // this method should be overriden
  }

  public async componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false)

    try {
      // Don't track logged out pages since we need an auth token to hit /altimeter
      if (
        this.pageName !== this.routePathNames.LOGIN &&
        this.pageName !== this.routePathNames.NOT_FOUND &&
        this.pageName !== this.routePathNames.SIGN_UP
      ) {
        await Analytics.page(this.pageName)
      }
    } catch (error) {
      Sentry.captureException(error)
    }

    if (process.env.REACT_APP_STAGE === 'production' || process.env.REACT_APP_STAGE === 'demo') {
      if (window.hasOwnProperty('Intercom')) {
        const intercomWindow: any = window
        intercomWindow.Intercom('update')
      }
    }
  }

  public componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false)
  }

  public render() {
    return <div className='Page'>{this.renderPageContent()}</div>
  }
}

export default BasePage
