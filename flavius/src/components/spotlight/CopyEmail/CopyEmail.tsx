import React, { useCallback, useState } from 'react'
import { copyToClipboard } from 'util/helpers'
import Tooltip from 'components/widgets/Tooltip'
import greenCheck from 'icons/checkmark.svg'
import UI_STRINGS from 'util/ui-strings'
import './CopyEmail.scss'

export interface CopyEmailProps {
  children: React.ReactElement
  email: string
}

interface CopyEmailTooltipProps {
  email: string
  onCopyClick: () => void
  emailCopied: boolean
}

const CopyEmailTooltip: React.FC<CopyEmailTooltipProps> = ({ email, onCopyClick, emailCopied }) => (
  <>
    <p className='CopyEmail__tooltip-email'>{email}</p>
    <span className='CopyEmail__tooltip-copy' onClick={onCopyClick}>
      {emailCopied ? (
        <>
          <img src={greenCheck} alt='greencheck' />
          &nbsp;
          {UI_STRINGS.SPOTLIGHT.EMAIL_COPIED_TO_CLIPBOARD}
        </>
      ) : (
        UI_STRINGS.SPOTLIGHT.COPY_EMAIL
      )}
    </span>
  </>
)
const CopyEmail: React.FC<CopyEmailProps> = ({ children, email }) => {
  const [emailCopied, setEmailCopied] = useState(false)

  const handleCopyClick = useCallback(() => {
    copyToClipboard(email)
    setEmailCopied(true)
  }, [email])

  const handleVisibilityChange = useCallback((show) => {
    if (!show) {
      setEmailCopied(false)
    }
  }, [])

  return (
    <Tooltip
      text=''
      className='CopyEmail'
      translucent={false}
      onVisibilityChange={handleVisibilityChange}
      width='unset'
      transition={true}
      tooltipComponent={<CopyEmailTooltip email={email} onCopyClick={handleCopyClick} emailCopied={emailCopied} />}>
      {children}
    </Tooltip>
  )
}

export default CopyEmail
