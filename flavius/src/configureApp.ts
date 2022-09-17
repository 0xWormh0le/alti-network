import * as Sentry from '@sentry/browser'
import { configureAmplify } from './api/apiConfiguration'

const configureSentry = () => {
  Sentry.init({
    dsn: 'https://4345e62a3abc48049f9965ccc17ed310@sentry.io/1306610',
    environment: process.env.REACT_APP_STAGE,
    release: `flavius@${process.env.REACT_APP_VERSION}`,
    integrations: [
      new Sentry.Integrations.Breadcrumbs({
        console: process.env.REACT_APP_STAGE === 'production'
      })
    ]
  })
}

const configureIntercom = () => {
  const currentStage = process.env.REACT_APP_STAGE
  const isNotDev = currentStage === 'production' || currentStage === 'demo' || currentStage === 'staging'

  if (isNotDev && window.hasOwnProperty('Intercom')) {
    const castedWindow: any = window
    castedWindow.Intercom('boot', {
      app_id: 'ec9jort1'
    })
  }
}

export function configureApp() {
  configureAmplify(false)
  configureSentry()
  configureIntercom()
}
