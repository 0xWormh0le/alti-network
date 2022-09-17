import React, { createContext, Fragment, useCallback, useContext } from 'react'
import Tooltip from 'components/widgets/Tooltip'
import Marker, { MarkerType } from 'components/elements/Marker'
import {
  getKeywords,
  hasKeywords,
  hasSensitiveContentSimple,
  modalBasePath,
  renderAttributeIfDev,
  searchWithoutModalParams
} from 'util/helpers'
import { UI_STRINGS } from 'util/ui-strings'
import { SensitiveContentStatus } from 'types/common'
import { Link } from 'react-router-dom'
import './SensitiveFileCell.scss'

export interface SensitiveFileCellProps {
  sensitiveFile: SensitiveSingleFile | SensitiveMultiFile
  sensitiveContentDetected?: SensitiveContentStatus
}

interface FileRiskProps {
  onOpenFile?: (e: React.SyntheticEvent) => void
}

interface IContext {
  riskId?: string
  sensitivePhrases?: SensitivePhraseMultiFile | SensitivePhraseSingleFile
  sensitiveKeywords?:
    | {
        phrases: SensitiveObjectKeywordDetail[]
        additional: number
      }
    | undefined
  isSingleFileRisk: boolean
  fileCount: number | undefined
  sensitiveContentDetected?: SensitiveContentStatus
}

const SensitiveFileContext = createContext({} as IContext)

export const SensitiveFileCell: React.FC<SensitiveFileCellProps> = ({ sensitiveFile, sensitiveContentDetected }) => {
  if (!sensitiveFile) return null

  const { fileCount } = sensitiveFile

  const isSingleFileRisk = sensitiveFile.sensitivePhrases?.sensitiveKeywordsFileCount === undefined

  let width = 230

  let sensitiveKeywords: IContext['sensitiveKeywords']

  if (sensitiveFile) {
    if (isSingleFileRisk) {
      width = 246
      sensitiveKeywords =
        sensitiveFile.sensitivePhrases && sensitiveFile.sensitivePhrases.sensitiveKeywordsFileCount === undefined
          ? getKeywords(sensitiveFile.sensitivePhrases)
          : {
              phrases: [],
              additional: 0
            }
    } else {
      width = 230
      sensitiveKeywords = {
        phrases: [],
        additional: 0
      }
    }
  }

  const contextValue: IContext = {
    sensitivePhrases: sensitiveFile.sensitivePhrases,
    isSingleFileRisk,
    fileCount,
    riskId: sensitiveFile.riskId,
    sensitiveKeywords,
    sensitiveContentDetected
  }

  return (
    <SensitiveFileContext.Provider value={contextValue}>
      <Tooltip
        width={width}
        translucent={false}
        text=''
        placement='right'
        renderTooltipComponent={(hideTooltip) => {
          if (sensitiveContentDetected) return <RiskMessage onOpenFile={() => hideTooltip} />
          else return <RiskDetails onOpenFile={hideTooltip} />
        }}>
        <div className='sensitiveFileAlert' {...renderAttributeIfDev({ 'data-testid': 'sensitiveFileAlert' })}>
          <Marker type={MarkerType.SensitiveContent} />
        </div>
      </Tooltip>
    </SensitiveFileContext.Provider>
  )
}

const SingleFileRisk: React.FC<{}> = () => {
  const { sensitivePhrases: sensitiveSingleFile } = useContext(SensitiveFileContext)

  if (!sensitiveSingleFile || sensitiveSingleFile.sensitiveKeywordsFileCount !== undefined) return null

  const patternsFound: boolean = sensitiveSingleFile.ssn > 0 || sensitiveSingleFile.ccNum > 0
  return (
    <div className='sensitiveFileWrapper' {...renderAttributeIfDev({ 'data-testid': 'sensitiveFileAlertSingle' })}>
      <div className='sensitiveFileWrapper__title'>{UI_STRINGS.RISKS.TOOLTIP_SENSITIVE_PATTERNS}</div>
      {patternsFound ? (
        <div className='sensitiveFileWrapper__columns'>
          {sensitiveSingleFile.ssn > 0 && (
            <React.Fragment>
              <div>
                <div className='sensitiveFileWrapper__subtitle'>SSN</div>
                <div {...renderAttributeIfDev({ 'data-testid': 'single-file-ssn' })}>
                  {sensitiveSingleFile.ssn} {sensitiveSingleFile.ssn > 1 ? 'instances' : 'instance'} found
                </div>
              </div>
              <div />
            </React.Fragment>
          )}
          {sensitiveSingleFile.ccNum > 0 && (
            <div>
              <div className='sensitiveFileWrapper__subtitle'>CC#</div>
              <div {...renderAttributeIfDev({ 'data-testid': 'single-file-ccNum' })}>
                {sensitiveSingleFile.ccNum} {sensitiveSingleFile.ccNum > 1 ? 'instances' : 'instance'} found
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className='sensitiveFileWrapper__empty'
          {...renderAttributeIfDev({ 'data-testid': 'sensitive-no-ssn-or-ccNum' })}>
          {UI_STRINGS.RISKS.TOOLTIP_SENSITIVE_NONE_DETECTED}
        </div>
      )}

      <SingleFileKeywords />
    </div>
  )
}

const MutlipleFileRisk: React.FC<FileRiskProps> = ({ onOpenFile }) => {
  const { sensitivePhrases /* fileCount */ } = useContext(SensitiveFileContext)
  const { riskId } = useContext(SensitiveFileContext)
  const linkUrl = `${modalBasePath()}/files/${riskId}${searchWithoutModalParams()}`
  // const total = getTotalCount(sensitivePhrases)

  const handleOpenFile = useCallback(
    (e) => {
      if (onOpenFile) {
        onOpenFile(e)
      }
    },
    [onOpenFile]
  )
  if (!sensitivePhrases || sensitivePhrases.sensitiveKeywordsFileCount === undefined) return null

  return (
    <div className='sensitiveFileWrapper'>
      {/* <div className='sensitiveFileWrapper__multipleTitle'>
          <div>
            {total} out of {fileCount} files contain sensitive content
          </div>
        </div> */}
      <div className='sensitiveFileWrapper__multipleTitle'>{UI_STRINGS.RISKS.TOOLTIP_MULTIPLE_TITLE}</div>
      <div className='sensitiveFileWrapper__columns'>
        {sensitivePhrases.ssnFileCount > 0 && (
          <React.Fragment>
            <div>
              <div className='sensitiveFileWrapper__multipleSubtitle'>SSN</div>
              <div {...renderAttributeIfDev({ 'data-testid': 'multi-ssn' })}>
                Found in {sensitivePhrases.ssnFileCount} files
              </div>
            </div>
            <div />
          </React.Fragment>
        )}
        {sensitivePhrases.ccNumFileCount > 0 && (
          <React.Fragment>
            <div>
              <div className='sensitiveFileWrapper__multipleSubtitle'>CC#</div>
              <div {...renderAttributeIfDev({ 'data-testid': 'multi-ccNum' })}>
                Found in {sensitivePhrases.ccNumFileCount} files
              </div>
            </div>
            <div />
          </React.Fragment>
        )}
        {sensitivePhrases.sensitiveKeywordsFileCount > 0 && (
          <React.Fragment>
            <div>
              <div className='sensitiveFileWrapper__multipleSubtitle'>SP</div>
              <div {...renderAttributeIfDev({ 'data-testid': 'multi-keywords' })}>
                Found in {sensitivePhrases.sensitiveKeywordsFileCount} files
              </div>
            </div>
            <div />
          </React.Fragment>
        )}
      </div>
      <div
        {...renderAttributeIfDev({ 'data-testid': 'sensitiveCellMultipleFiles' })}
        className=' sensitiveFileWrapper__spacer'>
        <Link to={linkUrl} className='sensitiveFileWrapper__link' onClick={handleOpenFile}>
          {UI_STRINGS.RISKS.TOOLTIP_FILES_AT_RISK}
        </Link>
      </div>
      <div className='sensitiveFileWrapper__multipleKey'>
        <ul>
          <li>{UI_STRINGS.RISKS.TOOLTIP_SENSITIVE_SSN}</li>
          <li>CC#: Credit Card Number</li>
          <li>SP: Sensitive Phrases</li>
        </ul>
      </div>
      <div className='sensitiveFileWrapper__multipleLink'>
        <Link to={linkUrl} className='sensitiveFileWrapper__link' onClick={handleOpenFile}>
          View Files
        </Link>
      </div>
    </div>
  )
}

const SingleFileKeywords: React.FC<{}> = () => {
  const { sensitiveKeywords, sensitivePhrases } = useContext(SensitiveFileContext)

  if (sensitiveKeywords === undefined) return null

  const more =
    sensitiveKeywords.additional && sensitiveKeywords.additional > 0 ? (
      <div className='sensitiveFileWrapper__moreText'>and {sensitiveKeywords.additional} more</div>
    ) : (
      <div />
    )
  return (
    <div>
      <div className='sensitiveFileWrapper__title  sensitiveFileWrapper__spacer'>
        {UI_STRINGS.RISKS.TOOLTIP_SENSITIVE_PHRASES}
      </div>
      {hasKeywords(sensitivePhrases) ? (
        <React.Fragment>
          <div
            className='sensitiveFileWrapper__columns'
            {...renderAttributeIfDev({ 'data-testid': 'sensitive-phrases' })}>
            {sensitiveKeywords.phrases.map((item, index) => (
              <React.Fragment key={item.keyword}>
                <div>
                  <div className='sensitiveFileWrapper__phrase'>{item.keyword}</div>
                  <div
                    className='sensitiveFileWrapper__phraseDetails'
                    {...renderAttributeIfDev({ 'data-testid': `sensitive-phrase-${index}` })}>
                    {item.count} {item.count > 1 ? 'instances' : 'instance'}
                  </div>
                </div>
                {index !== 4 && <div />}
              </React.Fragment>
            ))}
          </div>
          {more}
        </React.Fragment>
      ) : (
        <div
          className='sensitiveFileWrapper__empty'
          {...renderAttributeIfDev({ 'data-testid': 'sensitive-phrases-none' })}>
          {UI_STRINGS.RISKS.TOOLTIP_SENSITIVE_NONE_DETECTED}
        </div>
      )}
    </div>
  )
}

const RiskDetails: React.FC<FileRiskProps> = ({ onOpenFile }) => {
  const { isSingleFileRisk } = useContext(SensitiveFileContext)
  if (isSingleFileRisk) {
    return <SingleFileRisk />
  } else {
    return <MutlipleFileRisk onOpenFile={onOpenFile} />
  }
}

const RiskMessage: React.FC<{ onOpenFile: () => void }> = ({ onOpenFile }) => {
  const { sensitiveContentDetected, fileCount, riskId } = useContext(SensitiveFileContext)

  const linkUrl = `${modalBasePath()}/files/${riskId}${searchWithoutModalParams()}`

  const handleOpenFile = useCallback(() => {
    if (onOpenFile) {
      onOpenFile()
    }
  }, [onOpenFile])

  if (!hasSensitiveContentSimple(sensitiveContentDetected)) {
    return null
  }

  return (
    <div className='sensitiveFileWrapper__risk-message'>
      <div className='sensitiveFileWrapper' {...renderAttributeIfDev({ 'data-testid': 'sensitiveFileAlertSingle' })}>
        <div className='sensitiveFileWrapper__multipleTitle'>
          {sensitiveContentDetected === SensitiveContentStatus.FOUND_SENSITIVE_CONTENT &&
            UI_STRINGS.RISKS.TOOLTIP_SENSITIVE_FOUND}
          {sensitiveContentDetected === SensitiveContentStatus.FAILED_DETECTION &&
            UI_STRINGS.RISKS.TOOLTIP_SENSITIVE_FAILED}
        </div>
        {fileCount && fileCount > 1 && sensitiveContentDetected === SensitiveContentStatus.FOUND_SENSITIVE_CONTENT && (
          <Fragment>
            <div className='sensitiveFileWrapper__static-message'>
              {UI_STRINGS.RISKS.TOOLTIP_SENSITIVE_CONTENT_IN_FILES}
            </div>
            <div className='sensitiveFileWrapper__multipleLink'>
              <Link to={linkUrl} className='sensitiveFileWrapper__link' onClick={handleOpenFile}>
                {UI_STRINGS.RISKS.VIEW_FILES}
              </Link>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default SensitiveFileCell
