import React, { useCallback, useContext, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import RiskDescriptionCell from 'components/risks/RiskDescriptionCell'
import RiskCatalog, { RelationshipRiskTypeIds } from 'models/RiskCatalog'
import { routePathNames, getRiskLabel, printCSVdate, escapeComma } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import { MetadataStoreContext } from 'util/metadataStore'

export const getRiskEmail = (risk: {
  creator?: RiskResponse['creator']
  riskTarget?: RiskResponse['riskTarget']
  riskTypeId: RiskResponse['riskTypeId']
}): string => {
  const { creator, riskTarget, riskTypeId } = risk
  if (RelationshipRiskTypeIds.includes(riskTypeId)) {
    return riskTarget?.[0]?.id || ''
  } else {
    return creator && creator.primaryEmail ? creator.primaryEmail?.address ?? '' : ''
  }
}

export const mapper = (risk: RiskResponse) => {
  // The fields returned need to match the ColumnDefinition used
  const {
    severity,
    app,
    fileId,
    fileName,
    fileCount,
    riskId,
    riskTypeId,
    riskDescription,
    creator,
    owner,
    datetime,
    plugin,
    sensitivePhrases,
    mimeType,
    sensitiveContent,
    webLink,
    platformId,
    incidentDate,
    userVisibilityState
  } = risk

  const matchingRisk = Object.keys(RiskCatalog).find((riskTypeKey) => RiskCatalog[riskTypeKey].index === riskTypeId)
  const matchingRiskDescription = matchingRisk && RiskCatalog[matchingRisk] ? RiskCatalog[matchingRisk].name : ''

  const email = getRiskEmail(risk)

  const description: DisplayRiskDescription = {
    text: matchingRiskDescription,
    pluginId: plugin ? plugin.id : '',
    pluginName: plugin ? plugin.name : 'Unknown App',
    riskTypeId,
    email,
    riskId,
    personId: creator?.primaryEmail?.address,
    platformId,
    incidentDate
  }

  /* update riskSensitive to use API */
  const riskResult: DisplayRisk = {
    severity,
    riskId,
    riskTypeId,
    app,
    fileCount,
    file: {
      app,
      fileId,
      fileName,
      iconUrl: '',
      fileCount,
      riskId,
      createdBy: owner,
      riskTypeId,
      sensitivePhrases,
      mimeType,
      webLink,
      platformId,
      text: matchingRiskDescription,
      pluginId: plugin ? plugin.id : '',
      pluginName: plugin ? plugin.name : 'Unknown App',
      email,
      personId: creator && creator.primaryEmail ? creator.primaryEmail?.address : '' // altnetId:
    },
    description,
    owner: owner
      ? {
          ...owner,
          fileCount,
          riskTypeId
        }
      : { fileCount, riskTypeId },
    creator,
    datetime,
    action: {
      email,
      riskId,
      riskTypeId,
      owner,
      userVisibilityState,
      file: {
        app,
        fileId,
        fileName,
        fileCount,
        mimeType,
        platformId,
        riskId,
        webLink
      },
      plugin,
      description: riskDescription,
      platformId,
      webLink
    },
    sensitiveContent,
    userVisibilityState
  }

  return riskResult
}

export const alertableRisk = (riskActionInfo: RiskAction) => {
  const { file } = riskActionInfo as { file: FileCell }

  return file.fileCount === 1
}

export const resolvableRisk = (riskActionInfo: RiskAction) => {
  const { riskTypeId } = riskActionInfo
  return riskTypeId < 3000
}

export const handleSendEmail = (riskActionInfo: RiskAction) => {
  const { owner, file, webLink } = riskActionInfo as {
    owner: IPerson
    file: FileCell
    webLink: string
  }

  if (!alertableRisk(riskActionInfo)) {
    return
  }

  // const fileId = file.get('fileId')
  const fileLink: string = webLink
  const newOwner: IPerson = owner
  const ownerEmail: string = owner ? newOwner.primaryEmail?.address || '' : ''

  const subject = encodeURIComponent(UI_STRINGS.RISKS.ACTION_REQUIRED)
  const body = encodeURIComponent(UI_STRINGS.RISKS.EMAIL_CONTENT(ownerEmail, file.fileName, fileLink))
  const mailtoLinkTemplate = `mailto:${encodeURIComponent(ownerEmail)}?&subject=${subject}&body=${body}`
  const link = document.createElement('a')
  link.setAttribute('href', mailtoLinkTemplate)
  document.body.appendChild(link)
  link.click()
}

export const getCSVRiskDescription = (value: DisplayRiskDescription) => {
  const element = document.createElement('div')
  ReactDOM.render(
    <BrowserRouter>
      <RiskDescriptionCell displayRiskDescription={value} />
    </BrowserRouter>,
    element
  )
  return element.textContent || ''
}

const csvLinkBaseUrl: string = window.location ? `${window.location.origin}${routePathNames.RISKS}` : ''
export const rowMapper = (risk: RiskResponse) => {
  const value = mapper(risk)

  if (value.fileCount === 1) {
    return [
      getRiskLabel(value.severity),
      escapeComma(value.description ? getCSVRiskDescription(value.description) : ''),
      `"${value.file?.fileName}"`,
      escapeComma(`${csvLinkBaseUrl}/file/${value.file?.fileId}?platformId=${value.file?.platformId}`),
      escapeComma(value.file?.webLink || ''),
      escapeComma(value.file?.fileId),
      value.file?.platformId,
      value.owner?.primaryEmail?.address,
      `${csvLinkBaseUrl}/spotlight/${encodeURIComponent(value.owner?.primaryEmail?.address ?? '')}`,
      printCSVdate(value.datetime)
    ].join()
  } else {
    return [
      getRiskLabel(value.severity),
      escapeComma(value.description ? getCSVRiskDescription(value.description) : ''),
      escapeComma(`${value.fileCount} Files`),
      escapeComma(`${csvLinkBaseUrl}/files/${value.riskId}`),
      '',
      '',
      value.file?.platformId,
      'Multiple',
      'Multiple',
      printCSVdate(value.datetime)
    ].join()
  }
}

/**
 *
 * @param risksRs The risks response coming from the api
 * @returns Function that cleans up cached data.
 */
export const useCacheIncidentDates = (risksRs: Maybe<RisksResponse>): (() => void) => {
  const incidentDatesMetaKey = 'riskIncidentDates'
  const { addValue, removeValue } = useContext(MetadataStoreContext)
  useEffect(() => {
    const riskIncidentDates =
      risksRs &&
      Object.fromEntries(
        risksRs.risks.map((risk) => {
          const { riskId, incidentDate } = risk
          return [riskId, incidentDate]
        })
      )
    if (addValue) addValue(incidentDatesMetaKey, riskIncidentDates)
  }, [risksRs, addValue, removeValue])

  const cleanupFunction = useCallback(() => removeValue(incidentDatesMetaKey), [incidentDatesMetaKey, removeValue])

  return cleanupFunction
}
