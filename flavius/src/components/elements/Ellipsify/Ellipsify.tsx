import React, { useRef, useEffect, useState, useCallback } from 'react'
import Tooltip from 'components/widgets/Tooltip'
import { renderAttributeIfDev } from 'util/helpers'
import './Ellipsify.scss'

/*
  This component is deigned to keep text to it's container size and showing an ellispes for overflow
  required: parent should have a height set within its css properties
*/

interface EllipsifyProps {
  text: string
  wordWrap?: boolean
  showTooltip?: boolean
}

let computedStyle
let parentComputedStyle
let computedWidth = 100
let fontSize = 16
let computedHeight = 100
let fontWeight = 'normal'
let fontFamily = 'arial'
let lineHeight = 16

const Ellipsify: React.FC<EllipsifyProps> = (props) => {
  const text = props.text
  const wordWrap = props.wordWrap !== undefined ? props.wordWrap : true
  const showTooltip = props.showTooltip !== undefined ? props.showTooltip : true
  const [displayTooltip, setDisplayTooltip] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)
  const [parentRef, setParentRef] = useState<HTMLElement | undefined>(undefined)
  const [displayText, setDisplayText] = useState('')

  const setComputedProperties = useCallback(() => {
    if (divRef && divRef.current && parentRef) {
      parentRef.style.overflow = 'hidden'
      computedStyle = window.getComputedStyle(divRef.current)
      parentComputedStyle = window.getComputedStyle(parentRef)
      computedHeight = parseFloat(parentComputedStyle.getPropertyValue('height'))
      computedWidth = parseFloat(parentComputedStyle.getPropertyValue('width'))
      fontSize = parseInt(computedStyle.getPropertyValue('font-size'), 10)
      lineHeight = parseInt(computedStyle.getPropertyValue('line-height'), 10)
      if (isNaN(lineHeight)) {
        lineHeight = fontSize
      }
      fontWeight = computedStyle.getPropertyValue('font-weight')
      fontFamily = computedStyle.getPropertyValue('font-family')
    }
  }, [divRef, parentRef])

  const truncateText = useCallback(
    (str) => {
      setComputedProperties()
      const maxLines = Math.floor(computedHeight / lineHeight)
      const textWidth = getTextWidth(str + '...', `${fontWeight} ${fontSize}px ${fontFamily}`)
      const avgFontWidth = textWidth / str.length
      const totalChars = (computedWidth / avgFontWidth) * maxLines
      let diff = str.length > totalChars ? Math.floor(str.length - totalChars) : 0
      let truncatedText
      if (diff > 0) {
        diff += 6
        truncatedText = str.slice(0, -diff)
        truncatedText += '...'
        return truncatedText
      } else {
        return str
      }
    },
    [setComputedProperties]
  )

  const listener = useCallback(() => {
    let timer
    if (timer) {
      timer = null
    }
    timer = window.setTimeout(() => {
      setDisplayText(truncateText(text))
    }, 350)
  }, [text, truncateText])

  useEffect(() => {
    if (divRef.current && divRef.current.parentNode) {
      setParentRef(divRef.current.parentNode as HTMLElement)
      window.addEventListener('resize', listener)
    }
    return () => {
      window.removeEventListener('resize', listener)
    }
  }, [divRef, listener])

  useEffect(() => {
    if (hasOverflow(parentRef) && divRef && divRef.current && parentRef) {
      const truncatedText = truncateText(text)
      setDisplayText(truncatedText)
      if (showTooltip) {
        setDisplayTooltip(true)
      }
    } else {
      setDisplayText(text)
    }
  }, [parentRef, setDisplayText, text, setComputedProperties, truncateText, showTooltip])

  return (
    <div ref={divRef}>
      {displayTooltip ? (
        <Tooltip text={text}>
          <div className={wordWrap ? 'wrapped' : ''} {...renderAttributeIfDev({ 'data-testId': 'truncated-text' })}>
            {displayText}
          </div>
        </Tooltip>
      ) : (
        <React.Fragment>
          <div>
            <div className={wordWrap ? 'wrapped' : ''} {...renderAttributeIfDev({ 'data-testid': 'truncated-text' })}>
              {displayText}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  )
}

function hasOverflow(element: HTMLElement | null | undefined) {
  if (element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth
  }
  return false
}

function getTextWidth(text: string, font: any) {
  // re-use canvas object for better performance
  let canvas: HTMLCanvasElement
  canvas = document.querySelector('#textCanvas') || document.createElement('canvas')
  canvas.id = 'textCanvas'

  const context: any = canvas.getContext('2d')
  context.font = font
  const metrics = context.measureText(text)
  return metrics.width
}

export default Ellipsify
