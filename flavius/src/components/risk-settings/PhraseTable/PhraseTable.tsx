import React from 'react'
import ContentLoader from 'react-content-loader'
import { ErrorBox, ModernTable } from '@altitudenetworks/component-library'
import Phrase from 'components/elements/Phrase'
import Checkmark from 'icons/checkmark'
import Button from 'components/elements/Button'
import UI_STRINGS from 'util/ui-strings'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import './PhraseTable.scss'

export interface PhraseTableProps {
  loading?: boolean
  onDelete: (sensitivePhrase: SensitivePhrase) => void
  sensitivePhrases: SensitivePhrase[]
  hasError?: boolean
}

export const PhraseTable: React.FC<PhraseTableProps> = ({ onDelete, loading, sensitivePhrases, hasError }) => {
  if (hasError)
    return <ErrorBox mainMessage={UI_STRINGS.RISK_SETTINGS.UNABLE_TO_RETRIEVE_SENSITIVE_PHRASE} secondaryMessage='' />

  // TODO: Add custom "No Results Found" message to ModernTable
  if ((!Array.isArray(sensitivePhrases) || sensitivePhrases.length === 0) && !loading)
    return (
      <div className='PhraseTable__no-results'>
        <Typography variant={TypographyVariant.BODY_LARGE} className='PhraseTable__no-results-text'>
          {hasError
            ? UI_STRINGS.RISK_SETTINGS.UNABLE_TO_RETRIEVE_SENSITIVE_PHRASE
            : UI_STRINGS.RISK_SETTINGS.NO_SENSITIVE_PHRASES_CREATED}
        </Typography>
      </div>
    )

  sensitivePhrases.sort((a, b) => {
    return Number(a.exact < b.exact)
  })

  return (
    <ModernTable
      isLoading={loading}
      loadingComponent={<PhraseTableLoading />}
      className='PhraseTable'
      items={sensitivePhrases}
      fields={['sensitive phrase', 'exact matching']}
      scopedSlots={{
        'sensitive phrase': (val) => {
          return <Phrase size='sm' phrase={val.phrase} />
        },
        'exact matching': (val) => {
          return val.exact && <Checkmark className='PhraseRow__icon' />
        }
      }}
      actions={(val) => {
        return (
          <Button
            className='PhraseTable__delete'
            action='pagination'
            onClick={() => {
              onDelete(val)
            }}
            text='Delete'
          />
        )
      }}
    />
  )
}

const PhraseTableLoading = () => (
  <ContentLoader
    backgroundColor='#f0f0f0'
    foregroundColor='#f7f7f7'
    preserveAspectRatio='none'
    height={300}
    uniqueKey='phrase-table-loading'
    className='PhraseTableLoading'>
    <rect x={0} y={0} width='100%' height={60} />
    <rect x={0} y={120} width='100%' height={60} />
    <rect x={0} y={240} width='100%' height={60} />
  </ContentLoader>
)

export default PhraseTable
