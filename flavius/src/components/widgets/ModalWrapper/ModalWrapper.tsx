import React from 'react'
import { ModalContainer } from 'react-router-modal'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import './ModalWrapper.scss'

const ModalWrapper: React.FC<RouteComponentProps<any>> = (props) => {
  let className = 'ModalWrapper'
  if (props.location.pathname.indexOf('/resolve/') > -1) {
    className += ' ModalWrapper--sm'
  } else if (props.location.pathname.indexOf('/permissions/') > -1) {
    className += ' ModalWrapper--sm'
  } else {
    className += ' ModalWrapper--bg'
  }
  return <ModalContainer containerClassName='ModalContainer' modalClassName={className} />
}

export default withRouter(ModalWrapper)
