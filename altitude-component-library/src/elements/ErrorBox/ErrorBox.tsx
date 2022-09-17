import Button from 'elements/Button'
import React, { useState } from 'react'

interface ErrorBoxProps {
  mainMessage?: string
  secondaryMessage?: string
  retryCallback?: () => Promise<void>
}

const ErrorBox: React.FC<ErrorBoxProps> = (props) => {
  const { mainMessage = ' Something is wrong.', secondaryMessage = 'This is likely on our end.', retryCallback } = props
  const [retryLoading, setRetryLoading] = useState(false)

  const handleRetry = () => {
    if (retryCallback) {
      setRetryLoading(true)
      retryCallback().then(() => setRetryLoading(false))
    }
  }

  return (
    <div className='ErrorBox'>
      <div className='ErrorBox__message-container'>
        <div className='ErrorBox__main-message'>{mainMessage}</div>
        <div className='ErrorBox__secondary-message'>{secondaryMessage}</div>
        {retryCallback && (
          <Button
            onClick={handleRetry}
            className='ErrorBox__retry-button'
            isLoading={retryLoading}
            action='tertiary'
            text='Retry'
          />
        )}
      </div>
    </div>
  )
}

export default ErrorBox
