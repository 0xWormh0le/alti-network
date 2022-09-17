import React, { useCallback, useState, useRef, useEffect } from 'react'
import noop from 'lodash/noop'
import { ErrorBox } from '@altitudenetworks/component-library'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import ModalConfirmationDialog from 'components/widgets/ModalConfirmationDialog'
import Phrase from 'components/elements/Phrase'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import useQueryParam from 'util/hooks/useQueryParam'
import UI_STRINGS from 'util/ui-strings'
import useSensitivePhraseApiClient from 'api/clients/sensitivePhraseApiClient'
import SubmittingModalContent from '../SubmittingModalContent'
import NewSensitivePhrase from '../NewSensitivePhrase'
import PhraseTable from '../PhraseTable'
import PhraseCount from '../PhraseCount'
import ConfirmPhraseModalContent from '../ConfirmPhraseModalContent'
import './SensitivePhrases.scss'

export const checkDuplicates = (sensitivePhrases: SensitivePhrase[], newPhrase: SensitivePhrase) =>
  Boolean(sensitivePhrases.find((item) => item.phrase === newPhrase.phrase))

export const SensitivePhrases: React.FC<{}> = () => {
  const { useGetSensitivePhrases } = useSensitivePhraseApiClient()

  const { useAddSensitivePhrase } = useSensitivePhraseApiClient({
    handleError: (error) => {
      const msg = error.response.data.message
      setErrorMessage(msg.slice(msg.indexOf(': ') + 2))
      setErrorModalType('adding')
    },
    handleSuccess: () => {
      if (resetForm.current) {
        resetForm.current()
      }
      getSensitivePhrases.call({ pageNumber })
      setPhraseAddedModalVisible(true)
    }
  })

  const { useDeleteSensitivePhrase } = useSensitivePhraseApiClient({
    handleError: (error) => {
      const msg = error.response.data.message
      setErrorMessage(msg.slice(msg.indexOf(': ') + 2))
      setErrorModalType('deleting')
    },
    handleSuccess: () => {
      if (sensitivePhrases && pageNumber > 1 && sensitivePhrases.length === 1) {
        setPageNumber(pageNumber - 1)
      } else {
        getSensitivePhrases.call({ pageNumber })
      }
      setPhraseDeletedModalVisible(true)
    }
  })

  const resetForm = useRef<() => void>()
  const [pageNumber, setPageNumber] = useQueryParam<number>('page', 1)
  const [sensitivePhrases, setSensitivePhrases] = useState<SensitivePhrase[]>([])
  const [confirmAddModalVisible, setConfirmAddModalVisible] = useState(false)
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false)
  const [selectedSensitivePhrase, setSelectedSensitivePhrase] = useState<SensitivePhrase | null>(null)
  const [phraseAddedModalVisible, setPhraseAddedModalVisible] = useState(false)
  const [phraseDeletedModalVisible, setPhraseDeletedModalVisible] = useState(false)
  const [errorModalType, setErrorModalType] = useState<'adding' | 'deleting' | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [response, sensitivePhrasesError, isLoading, getSensitivePhrases] = useGetSensitivePhrases(pageNumber)
  const [, , deletePending, deleteSensitivePhrase] = useDeleteSensitivePhrase()
  const [, , addPending, addSensitivePhrase] = useAddSensitivePhrase()

  useEffect(() => {
    setSensitivePhrases(response?.sensitivePhrases || [])
  }, [response])

  const handleAddClick = useCallback((newPhrase: SensitivePhrase, resetFormFn) => {
    if (newPhrase.phrase) {
      resetForm.current = resetFormFn
      setSelectedSensitivePhrase(newPhrase)
      setConfirmAddModalVisible(true)
    }
  }, [])

  const handleRemoveClick = useCallback((phrase: SensitivePhrase) => {
    setSelectedSensitivePhrase(phrase)
    setConfirmDeleteModalVisible(true)
  }, [])

  const handleAddSensitivePhrase = useCallback(() => {
    setConfirmAddModalVisible(false)
    if (!selectedSensitivePhrase) {
      return
    }
    addSensitivePhrase.call({
      phrase: selectedSensitivePhrase.phrase,
      exact: selectedSensitivePhrase.exact
    })
  }, [selectedSensitivePhrase, addSensitivePhrase])

  const handleDeleteSensitivePhrase = useCallback(() => {
    setConfirmDeleteModalVisible(false)
    if (!selectedSensitivePhrase) {
      return
    }
    if (selectedSensitivePhrase.id) {
      deleteSensitivePhrase.call({
        id: selectedSensitivePhrase.id
      })
    }
  }, [selectedSensitivePhrase, deleteSensitivePhrase])

  if (sensitivePhrasesError)
    return (
      <ErrorBox
        mainMessage={UI_STRINGS.ERROR_MESSAGES.SOMETHING_WRONG}
        secondaryMessage={UI_STRINGS.ERROR_MESSAGES.OUR_END}
      />
    )

  return (
    <div className='SensitivePhrases'>
      <NewSensitivePhrase onAdd={handleAddClick} />
      <div className='SensitivePhrases__existing-phrases'>
        <Typography variant={TypographyVariant.H3}>Active Phrases</Typography>
        <PhraseCount loading={isLoading} count={sensitivePhrases.length} />
        <PhraseTable
          loading={isLoading}
          sensitivePhrases={sensitivePhrases}
          hasError={sensitivePhrasesError || false}
          onDelete={handleRemoveClick}
        />
        <EntityCountPagination
          entityCount={response?.sensitivePhrases?.length || 0}
          pageNumber={response?.pageNumber || 0}
          pageSize={response?.pageSize || 0}
          pageCount={response?.pageCount || 0}
          onPageChange={setPageNumber}
        />
      </div>
      {confirmAddModalVisible && selectedSensitivePhrase && (
        <ModalConfirmationDialog
          onConfirm={handleAddSensitivePhrase}
          onCancel={() => setConfirmAddModalVisible(false)}
          verticalAlign='top'
          confirmButtonText={UI_STRINGS.BUTTON_LABELS.CORRECT}
          cancelButtonText={UI_STRINGS.BUTTON_LABELS.CANCEL}
          confirmButtonActionType='primary'
          cancelButtonActionType='secondary'
          dialogTitle={UI_STRINGS.SENSITIVE_PHRASES.CONFIRM_NEW_PHRASE}
          message={<ConfirmPhraseModalContent sensitivePhrase={selectedSensitivePhrase} action='add' />}
        />
      )}
      {confirmDeleteModalVisible && selectedSensitivePhrase && (
        <ModalConfirmationDialog
          onConfirm={handleDeleteSensitivePhrase}
          onCancel={() => setConfirmDeleteModalVisible(false)}
          verticalAlign='top'
          confirmButtonText={UI_STRINGS.SENSITIVE_PHRASES.YES_DELETE}
          cancelButtonText={UI_STRINGS.SENSITIVE_PHRASES.NO_DELETE}
          confirmButtonActionType='alert'
          cancelButtonActionType='secondary'
          dialogTitle={UI_STRINGS.SENSITIVE_PHRASES.CONFIRM_DELETION}
          message={<ConfirmPhraseModalContent sensitivePhrase={selectedSensitivePhrase} action='delete' />}
        />
      )}
      {phraseAddedModalVisible && selectedSensitivePhrase && (
        <ModalConfirmationDialog
          onConfirm={() => setPhraseAddedModalVisible(false)}
          onCancel={() => setPhraseAddedModalVisible(false)}
          verticalAlign='top'
          confirmButtonText={UI_STRINGS.BUTTON_LABELS.OK}
          confirmButtonActionType='primary'
          dialogTitle={UI_STRINGS.SENSITIVE_PHRASES.SENSITIVE_PHRASES_UPDATED}
          message={
            <Typography variant={TypographyVariant.H3}>
              <Phrase phrase={selectedSensitivePhrase.phrase} size='sm' /> {UI_STRINGS.SENSITIVE_PHRASES.HAS_BEEN_ADDED}
              .
            </Typography>
          }
        />
      )}
      {(addPending || deletePending) && (
        <ModalConfirmationDialog
          verticalAlign='top'
          dialogTitle={
            addPending ? UI_STRINGS.SENSITIVE_PHRASES.CONFIRM_NEW_PHRASE : UI_STRINGS.SENSITIVE_PHRASES.CONFIRM_DELETION
          }
          message={<SubmittingModalContent action={addPending ? 'add' : 'delete'} />}
          onConfirm={noop}
          onCancel={noop}
        />
      )}
      {phraseDeletedModalVisible && selectedSensitivePhrase && (
        <ModalConfirmationDialog
          onConfirm={() => setPhraseDeletedModalVisible(false)}
          onCancel={() => setPhraseDeletedModalVisible(false)}
          verticalAlign='top'
          confirmButtonText={UI_STRINGS.BUTTON_LABELS.OK}
          confirmButtonActionType='primary'
          dialogTitle={UI_STRINGS.SENSITIVE_PHRASES.SENSITIVE_PHRASES_UPDATED}
          message={
            <Typography variant={TypographyVariant.H3}>
              <Phrase phrase={selectedSensitivePhrase.phrase} size='sm' />{' '}
              {UI_STRINGS.SENSITIVE_PHRASES.HAS_BEEN_DELETED}.
            </Typography>
          }
        />
      )}
      {errorModalType && (
        <ModalConfirmationDialog
          onConfirm={() => setErrorModalType(null)}
          onCancel={() => setErrorModalType(null)}
          verticalAlign='top'
          confirmButtonText={UI_STRINGS.BUTTON_LABELS.OK}
          confirmButtonActionType='primary'
          dialogTitle={UI_STRINGS.SENSITIVE_PHRASES.ERROR}
          message={
            <Typography variant={TypographyVariant.H3}>
              {errorMessage ?? (
                <>
                  {UI_STRINGS.SENSITIVE_PHRASES.WE_ENCOUNTERED} {errorModalType}{' '}
                  {UI_STRINGS.SENSITIVE_PHRASES.THIS_PHRASE}.
                  <br />
                  {UI_STRINGS.SENSITIVE_PHRASES.PLEASE_TRY_AGAIN}.
                </>
              )}
            </Typography>
          }
        />
      )}
    </div>
  )
}

export default SensitivePhrases
