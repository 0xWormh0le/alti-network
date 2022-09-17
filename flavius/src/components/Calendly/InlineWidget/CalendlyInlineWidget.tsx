import React from 'react'
import useHeadScript from 'util/hooks/useHeadScript'

interface CalendlyInlineWidgetProps {
  calendlyUrl: string
}

const CalendlyInlineWidget: React.FC<CalendlyInlineWidgetProps> = ({ calendlyUrl }) => {
  useHeadScript({
    url: 'https://assets.calendly.com/assets/external/widget.js'
  })

  return (
    <div
      className='calendly-inline-widget'
      data-url={calendlyUrl}
      style={{
        height: '630px',
        minWidth: '230px'
      }}
    />
  )
}

export default CalendlyInlineWidget
