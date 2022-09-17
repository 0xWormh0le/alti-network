import React from 'react'
import cx from 'classnames'

import './Phrase.scss'

export interface PhraseProps {
  phrase: string
  size: 'sm' | 'lg'
}

export const Phrase: React.FC<PhraseProps> = ({ size = 'sm', phrase }) => {
  return <div className={cx('Phrase', `Phrase--${size}`)}>{phrase}</div>
}

export default Phrase
