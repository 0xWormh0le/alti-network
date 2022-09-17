import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import BasePage from '../BasePage'
import './BaseModalPage.scss'

export interface BaseModalPageProps extends RouteComponentProps<any> {
  closeModal?: () => void
}

declare global {
  interface Window {
    visibleModalCount: number
  }
}

class BaseModalPage extends BasePage<BaseModalPageProps, {}> {
  protected closeModal = () => {
    const { closeModal } = this.props

    if (window.visibleModalCount !== undefined) {
      if (window.visibleModalCount > 1) {
        return
      }
    }

    if (closeModal) {
      closeModal()
    }
  }

  protected onEscKeyDown() {
    this.closeModal()
  }

  protected renderPageContent() {
    console.error('This should be overridden.')
    return <div />
  }

  public render() {
    return <div className='ModalPage'>{this.renderPageContent()}</div>
  }
}

export default BaseModalPage
