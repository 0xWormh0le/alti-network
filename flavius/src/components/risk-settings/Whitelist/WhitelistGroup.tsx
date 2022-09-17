import React, { useMemo, useCallback, useState } from 'react'
import ContentLoader from 'react-content-loader'
import { Accordion, AccordionDetails, AccordionSummary } from '@altitudenetworks/component-library'
import WhitelistTable from './WhitelistTable'
import useRisksSettingsApiClient from 'api/clients/risksSettingsApiClient'
import ModalConfirmationDialog, { ModalConfirmationDialogProps } from 'components/widgets/ModalConfirmationDialog'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import LoadingBar from 'components/elements/LoadingBar'
import UI_STRINGS from 'util/ui-strings'
import { singularize } from 'util/helpers'
import { WhitelistDomainAddForm } from './WhitelistItemAddForm'
import { WhitelistAppAddForm } from './WhitelistItemAddForm'
import './WhitelistGroup.scss'

type ModalType =
  | 'addConfirm'
  | 'deleteConfirm'
  | 'addSuccess'
  | 'deleteSuccess'
  | 'addPending'
  | 'deletePending'
  | 'error'

type WhitelistType = 'whitelistedDomain' | 'internalDomain' | 'whitelistedApp' | 'error'

type ModalState = {
  modalType: ModalType
  whitelistType: WhitelistType
  value?: RiskSettingsApp | RiskSettingsDomain
}

const whitelistTitles = {
  whitelistedDomain: UI_STRINGS.RISK_SETTINGS.WHITELISTED_DOMAINS,
  internalDomain: UI_STRINGS.RISK_SETTINGS.INTERNAL_DOMAINS,
  whitelistedApp: UI_STRINGS.RISK_SETTINGS.WHITELISTED_APPS,
  error: UI_STRINGS.SENSITIVE_PHRASES.ERROR
}

const PAGE_SIZE = 5

// TODO: this method is a temp solution, need to make it more flexible
// the current setup only works when we have a set number of forms
const clearWhitelistAddForm = (type: WhitelistType) => {
  const inputs: HTMLInputElement[] = Array.from(document.querySelectorAll('.WhitelistItemAddForm__input input'))

  switch (type) {
    case 'whitelistedDomain':
      if (inputs.length > 0) {
        inputs[0].value = ''
      }
      break

    case 'whitelistedApp':
      if (inputs.length > 1) {
        inputs[1].value = ''
        inputs[2].value = ''
      }
      break

    case 'internalDomain':
      if (inputs.length > 2) {
        inputs[3].value = ''
      }
      break
  }
}

const WhitelistGroup: React.FC<{}> = () => {
  const [errorMessage, setErrorMessage] = useState('')
  const [modal, setModal] = useState<Maybe<ModalState>>(null)

  const [whitelistedDomainPageNumber, setWhitelistedDomainPageNumber] = useState(1)
  const [whitelistedAppPageNumber, setWhitelistedAppPageNumber] = useState(1)
  const [internalDomainPageNumber, setInternalDomainPageNumber] = useState(1)

  const [whitelistedDomainsResponse, setWhitelistedDomainsResponse] = useState<WhitelistedDomainsResponse | null>(null)
  const [whitelistedAppsResponse, setWhitelistedAppsResponse] = useState<WhitelistedAppsResponse | null>(null)
  const [internalDomainsResponse, setInternalDomainsResponse] = useState<InternalDomainsResponse | null>(null)

  const handleError = useCallback((error) => {
    const msg = error.response.data.message
    setErrorMessage(msg.slice(msg.indexOf(': ') + 2))
    setModal({ modalType: 'error', whitelistType: 'error' })
  }, [])

  // whitelist domains
  const { useGetWhitelistedDomains } = useRisksSettingsApiClient({
    handleError,
    handleSuccess: (response: WhitelistedDomainsResponse) => {
      setWhitelistedDomainsResponse(response)
    }
  })

  const { useAddWhitelistedDomain } = useRisksSettingsApiClient({
    handleError,
    handleSuccess: (response: WhitelistedDomainsResponse) => {
      setWhitelistedDomainsResponse(response)
      setWhitelistedDomainPageNumber(response.pageNumber)
      setModal({ modalType: 'addSuccess', whitelistType: 'whitelistedDomain' })
      clearWhitelistAddForm('whitelistedDomain')
    }
  })

  const { useDeleteWhitelistedDomain } = useRisksSettingsApiClient({
    handleError,
    handleSuccess: (response: WhitelistedDomainsResponse) => {
      setWhitelistedDomainsResponse(response)
      setWhitelistedDomainPageNumber(response.pageNumber)
      setModal({ modalType: 'deleteSuccess', whitelistType: 'whitelistedDomain' })
    }
  })

  // internal domains
  const { useGetInternalDomains } = useRisksSettingsApiClient({
    handleError,
    handleSuccess: (response: InternalDomainsResponse) => {
      setInternalDomainsResponse(response)
    }
  })

  const { useAddInternalDomain } = useRisksSettingsApiClient({
    handleError,
    handleSuccess: (response: InternalDomainsResponse) => {
      setInternalDomainsResponse(response)
      setInternalDomainPageNumber(response.pageNumber)
      setModal({ modalType: 'addSuccess', whitelistType: 'internalDomain' })
      clearWhitelistAddForm('internalDomain')
    }
  })

  const { useDeleteInternalDomain } = useRisksSettingsApiClient({
    handleError,
    handleSuccess: (response: InternalDomainsResponse) => {
      setInternalDomainsResponse(response)
      setInternalDomainPageNumber(response.pageNumber)
      setModal({ modalType: 'deleteSuccess', whitelistType: 'internalDomain' })
    }
  })

  // whitelist Apps
  const { useGetWhitelistedApps } = useRisksSettingsApiClient({
    handleError,
    handleSuccess: (response: WhitelistedAppsResponse) => {
      setWhitelistedAppsResponse(response)
    }
  })

  const { useAddWhitelistedApp } = useRisksSettingsApiClient({
    handleError,
    handleSuccess: (response: WhitelistedAppsResponse) => {
      setWhitelistedAppsResponse(response)
      setWhitelistedAppPageNumber(response.pageNumber)
      setModal({ modalType: 'addSuccess', whitelistType: 'whitelistedApp' })
      clearWhitelistAddForm('whitelistedApp')
    }
  })

  const { useDeleteWhitelistedApp } = useRisksSettingsApiClient({
    handleError,
    handleSuccess: (response: WhitelistedAppsResponse) => {
      setWhitelistedAppsResponse(response)
      setWhitelistedAppPageNumber(response.pageNumber)
      setModal({ modalType: 'deleteSuccess', whitelistType: 'whitelistedApp' })
    }
  })

  const [, , whitelistedDomainsLoading] = useGetWhitelistedDomains(whitelistedDomainPageNumber, { pageSize: PAGE_SIZE })
  const [, , addWhitelistedDomainPending, addWhitelistedDomain] = useAddWhitelistedDomain({
    pageSize: PAGE_SIZE,
    pageNumber: whitelistedDomainPageNumber
  })
  const [, , deleteWhitelistedDomainPending, deleteWhitelistedDomain] = useDeleteWhitelistedDomain({
    pageSize: PAGE_SIZE,
    pageNumber: whitelistedDomainPageNumber
  })

  const [, , whitelistedAppsLoading] = useGetWhitelistedApps(whitelistedAppPageNumber, { pageSize: PAGE_SIZE })
  const [, , addWhitelistedAppPending, addWhitelistedApp] = useAddWhitelistedApp({
    pageSize: PAGE_SIZE,
    pageNumber: whitelistedAppPageNumber
  })
  const [, , deleteWhitelistedAppPending, deleteWhitelistedApp] = useDeleteWhitelistedApp({
    pageSize: PAGE_SIZE,
    pageNumber: whitelistedAppPageNumber
  })

  const [, , internalDomainsLoading] = useGetInternalDomains(internalDomainPageNumber, { pageSize: PAGE_SIZE })
  const [, , addInternalDomainPending, addInternalDomain] = useAddInternalDomain({
    pageSize: PAGE_SIZE,
    pageNumber: internalDomainPageNumber
  })
  const [, , deleteInternalDomainPending, deleteInternalDomain] = useDeleteInternalDomain({
    pageSize: PAGE_SIZE,
    pageNumber: internalDomainPageNumber
  })

  const renderModalType: Maybe<ModalState> = useMemo(() => {
    if (addWhitelistedDomainPending) {
      return {
        modalType: 'addPending',
        whitelistType: 'whitelistedDomain'
      }
    } else if (addInternalDomainPending) {
      return {
        modalType: 'addPending',
        whitelistType: 'internalDomain'
      }
    } else if (addWhitelistedAppPending) {
      return {
        modalType: 'addPending',
        whitelistType: 'whitelistedApp'
      }
    } else if (deleteWhitelistedDomainPending) {
      return {
        modalType: 'deletePending',
        whitelistType: 'whitelistedDomain'
      }
    } else if (deleteInternalDomainPending) {
      return {
        modalType: 'deletePending',
        whitelistType: 'internalDomain'
      }
    } else if (deleteWhitelistedAppPending) {
      return {
        modalType: 'deletePending',
        whitelistType: 'whitelistedApp'
      }
    } else {
      return modal
    }
  }, [
    addWhitelistedDomainPending,
    deleteWhitelistedDomainPending,
    addWhitelistedAppPending,
    deleteWhitelistedAppPending,
    addInternalDomainPending,
    deleteInternalDomainPending,
    modal
  ])

  const renderModal = useCallback(
    (modalData: ModalState) => {
      const whitelistType = singularize(whitelistTitles[modalData.whitelistType])
      const whitelistElement = modalData.whitelistType === 'whitelistedApp' ? 'App' : 'Domain'
      const listName = modalData.whitelistType === 'internalDomain' ? 'internal list' : 'whitelist'

      const dialogTitle = {
        addConfirm: UI_STRINGS.RISK_SETTINGS.WHITELIST_DIALOG_TITLE.ADD_CONFIRM(whitelistType),
        deleteConfirm: UI_STRINGS.RISK_SETTINGS.WHITELIST_DIALOG_TITLE.DELETE_CONFIRM(whitelistType),
        addPending: UI_STRINGS.RISK_SETTINGS.WHITELIST_DIALOG_TITLE.ADD_PENDING(whitelistType),
        deletePending: UI_STRINGS.RISK_SETTINGS.WHITELIST_DIALOG_TITLE.DELETE_PENDING(whitelistType),
        addSuccess: UI_STRINGS.RISK_SETTINGS.WHITELIST_DIALOG_TITLE.ADD_SUCCESS(whitelistType),
        deleteSuccess: UI_STRINGS.RISK_SETTINGS.WHITELIST_DIALOG_TITLE.DELETE_SUCCESS(whitelistType),
        error: UI_STRINGS.SENSITIVE_PHRASES.ERROR
      }

      const message = {
        addSuccess: UI_STRINGS.RISK_SETTINGS.WHITELIST_DIALOG_MESSAGE.ADD_SUCCESS(whitelistElement, listName),
        deleteSuccess: UI_STRINGS.RISK_SETTINGS.WHITELIST_DIALOG_MESSAGE.DELETE_SUCCESS(whitelistElement, listName),
        addPending: UI_STRINGS.RISK_SETTINGS.WHITELIST_DIALOG_MESSAGE.ADD_PENDING(whitelistElement, listName),
        deletePending: UI_STRINGS.RISK_SETTINGS.WHITELIST_DIALOG_MESSAGE.DELETE_PENDING(whitelistElement, listName),
        updateConfirm: UI_STRINGS.RISK_SETTINGS.WHITELIST_DIALOG_MESSAGE.UPDATE_CONFIRM(
          whitelistElement,
          modalData.modalType
        ),
        error: errorMessage
      }

      const modalConfig: ModalConfirmationDialogProps = {
        verticalAlign: 'top',
        confirmButtonActionType: 'primary',
        cancelButtonActionType: 'secondary',
        dialogTitle: dialogTitle[modalData.modalType],
        message: ''
      }

      if (['addConfirm', 'deleteConfirm'].includes(modalData.modalType)) {
        const onConfirm = {
          whitelistedDomain: {
            addConfirm: () => addWhitelistedDomain.call(modalData.value as RiskSettingsDomain),
            deleteConfirm: () => {
              if (
                whitelistedDomainsResponse &&
                whitelistedDomainsResponse.settings.whitelistedDomains.length % PAGE_SIZE === 1 &&
                whitelistedDomainPageNumber > 1
              ) {
                setWhitelistedDomainPageNumber((prev) => prev - 1)
              }
              deleteWhitelistedDomain.call(modalData.value as RiskSettingsDomain)
            }
          },
          internalDomain: {
            addConfirm: () => addInternalDomain.call({ domain: (modalData.value as RiskSettingsDomain).domain }),
            deleteConfirm: () => deleteInternalDomain.call({ domain: (modalData.value as RiskSettingsDomain).domain })
          },
          whitelistedApp: {
            addConfirm: () => {
              const value: RiskSettingsApp = modalData.value as RiskSettingsApp
              addWhitelistedApp.call({
                appId: value.appId,
                appDesc: value.appDesc
              })
            },
            deleteConfirm: () => {
              if (
                whitelistedAppsResponse &&
                whitelistedAppsResponse.settings.whitelistedApps.length % PAGE_SIZE === 1 &&
                whitelistedAppPageNumber > 1
              ) {
                setWhitelistedAppPageNumber((prev) => prev - 1)
              }

              const value: RiskSettingsApp = modalData.value as RiskSettingsApp
              deleteWhitelistedApp.call({
                appId: value.appId,
                appDesc: value.appDesc
              })
            }
          }
        }
        modalConfig.onConfirm = onConfirm[modalData.whitelistType][modalData.modalType]
        modalConfig.onCancel = () => setModal(null)
        modalConfig.confirmButtonText = UI_STRINGS.BUTTON_LABELS.YES
        modalConfig.cancelButtonText = UI_STRINGS.BUTTON_LABELS.NO
        modalConfig.message = message.updateConfirm
      } else if (['addSuccess', 'deleteSuccess', 'error'].includes(modalData.modalType)) {
        modalConfig.onConfirm = () => setModal(null)
        modalConfig.confirmButtonText = UI_STRINGS.BUTTON_LABELS.OK
        modalConfig.message = <Typography variant={TypographyVariant.H3}>{message[modalData.modalType]}</Typography>
        modalConfig.dialogTitle = dialogTitle[modalData.modalType]
      } else if (['addPending', 'deletePending'].includes(modalData.modalType)) {
        modalConfig.dialogTitle = dialogTitle[modalData.modalType]
        modalConfig.message = (
          <div>
            <div>{message[modalData.modalType]}</div>
            <LoadingBar className='WhitelistGroup__loading' />
          </div>
        )
      }

      return <ModalConfirmationDialog {...modalConfig} />
    },
    [
      addWhitelistedDomain,
      deleteWhitelistedDomain,
      errorMessage,
      whitelistedDomainPageNumber,
      whitelistedDomainsResponse,
      whitelistedAppPageNumber,
      addWhitelistedApp,
      deleteWhitelistedApp,
      addInternalDomain,
      deleteInternalDomain,
      whitelistedAppsResponse
    ]
  )

  const initialLoading: boolean =
    (whitelistedDomainsLoading && !whitelistedDomainsResponse) || (internalDomainsLoading && !internalDomainsResponse)

  const handleConfirmShow = useCallback(
    (modalType: ModalType, whitelistType: WhitelistType) => (value: RiskSettingsDomain | RiskSettingsApp) => {
      setModal({ modalType, whitelistType, value })
    },
    []
  )

  if (initialLoading) {
    return (
      <div className='WhitelistGroup'>
        <WhitelistGroupLoader />
        <WhitelistGroupLoader />
      </div>
    )
  }

  return (
    <>
      <div className='WhitelistGroup'>
        <Accordion>
          <AccordionSummary>{UI_STRINGS.RISK_SETTINGS.WHITELISTED_DOMAINS}</AccordionSummary>
          <AccordionDetails>
            <WhitelistDomainAddForm onAddNew={handleConfirmShow('addConfirm', 'whitelistedDomain')} />
            <WhitelistTable
              mapResponseToData={(data: WhitelistedDomainsResponse) => data.settings.whitelistedDomains}
              column='Whitelisted Domains'
              pageNumber={whitelistedDomainPageNumber}
              onPageChange={setWhitelistedDomainPageNumber}
              render={(value) => (
                <span className='whitelistItem__table-item'>{(value as RiskSettingsDomain).domain}</span>
              )}
              response={whitelistedDomainsResponse}
              isLoading={whitelistedDomainsLoading}
              onDelete={handleConfirmShow('deleteConfirm', 'whitelistedDomain')}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>{UI_STRINGS.RISK_SETTINGS.WHITELISTED_APPS}</AccordionSummary>
          <AccordionDetails>
            <WhitelistAppAddForm onAddNew={handleConfirmShow('addConfirm', 'whitelistedApp')} />
            <WhitelistTable
              mapResponseToData={(data: WhitelistedAppsResponse) => data.settings.whitelistedApps}
              column='Whitelisted Apps'
              pageNumber={whitelistedAppPageNumber}
              onPageChange={setWhitelistedAppPageNumber}
              render={(value) => (
                <span className='whitelistItem__table-item'>
                  {(value as RiskSettingsApp).appId}
                  <br />
                  {(value as RiskSettingsApp).appDesc}
                </span>
              )}
              response={whitelistedAppsResponse}
              isLoading={whitelistedAppsLoading}
              onDelete={handleConfirmShow('deleteConfirm', 'whitelistedApp')}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>{UI_STRINGS.RISK_SETTINGS.INTERNAL_DOMAINS}</AccordionSummary>
          <AccordionDetails>
            <WhitelistDomainAddForm onAddNew={handleConfirmShow('addConfirm', 'internalDomain')} />
            <WhitelistTable
              mapResponseToData={(data: InternalDomainsResponse) => data.settings.internalDomains}
              column={UI_STRINGS.RISK_SETTINGS.INTERNAL_DOMAINS}
              pageNumber={internalDomainPageNumber}
              onPageChange={setInternalDomainPageNumber}
              render={(value) => (
                <span className='whitelistItem__table-item'>{(value as RiskSettingsDomain).domain}</span>
              )}
              response={internalDomainsResponse}
              isLoading={internalDomainsLoading}
              onDelete={handleConfirmShow('deleteConfirm', 'internalDomain')}
              useAllowDelete={true}
            />
          </AccordionDetails>
        </Accordion>
      </div>
      {renderModalType && renderModal(renderModalType)}
    </>
  )
}

const WhitelistGroupLoader = () => (
  <ContentLoader
    backgroundColor='#F0F0F0'
    foregroundColor='#F7F7F7'
    className='WhitelistGroup__loading'
    height={150}
    width='100%'
    uniqueKey='DefaultThreshold__input'>
    <rect x={0} y={0} width='100%' height={150} rx={4} ry={4} />
  </ContentLoader>
)

export default WhitelistGroup
