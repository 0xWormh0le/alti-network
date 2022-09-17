import React from 'react'

import Phrase from 'components/elements/Phrase'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import exactMatching from '../NewSensitivePhrase/exact-matching.svg'
import partialMatching from '../NewSensitivePhrase/partial-matching.svg'
import './ConfirmPhraseModalContent.scss'

export interface ConfirmPhraseModalContentProps {
  sensitivePhrase: SensitivePhrase
  action: 'add' | 'delete'
}

export const ConfirmPhraseModalContent: React.FC<ConfirmPhraseModalContentProps> = ({ action, sensitivePhrase }) => {
  return (
    <div className='ConfirmPhraseModalContent'>
      <Typography variant={TypographyVariant.H3}>
        {action === 'add' ? 'Is this phrase correct?' : 'Delete this phrase?'}
      </Typography>
      <Phrase phrase={sensitivePhrase.phrase} size='lg' />
      <div className='ConfirmPhraseModalContent__infobox'>
        <div className='ConfirmPhraseModalContent__infobox-text'>
          <Typography variant={TypographyVariant.LABEL} weight='bold'>
            This phrase uses {sensitivePhrase.exact ? 'Exact Match' : 'Partial Match'}
          </Typography>
          <Typography variant={TypographyVariant.BODY_TINY} className='ConfirmPhraseModalContent__infobox-desc'>
            {sensitivePhrase.exact
              ? 'For example, "int" would match the filename "Number or int" but would NOT match "Internal Review Notes".'
              : 'For example, "int" would match the filenames "Integer List" and "Internal Review Notes".'}
          </Typography>
        </div>
        {sensitivePhrase.exact ? (
          <img src={exactMatching} alt='exact matching' className='NewSensitivePhrase__infobox-img' />
        ) : (
          <img src={partialMatching} alt='partial matching' className='NewSensitivePhrase__infobox-img' />
        )}
      </div>
    </div>
  )
}

export default ConfirmPhraseModalContent
