import React from 'react'
import Spinner from '../Spinner'
import './Loading.scss'

const Loading: React.FC<{}> = () => (
  <div className='Loading'>
    <Spinner />
    <img className='Loading__logo' alt='Altitude Networks logo' src='/logo.png' />
  </div>
)

export default Loading
