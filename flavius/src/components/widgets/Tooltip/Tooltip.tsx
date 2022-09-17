import React, { useCallback, useState } from 'react'
import { ChildrenArg, TooltipArg, TriggerTypes } from 'react-popper-tooltip/dist/types.d'
import cx from 'classnames'
import { Placement } from '@popperjs/core'
import TooltipTrigger from 'react-popper-tooltip'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import 'react-popper-tooltip/dist/styles.css'
import './Tooltip.scss'

type MouseEventHandler = ((event: React.SyntheticEvent) => void) | undefined

let timer: NodeJS.Timeout

export type TooltipProps = {
  id?: string
  text: string
  secondaryText?: string
  placement?: Placement
  children: React.ReactElement
  trigger?: TriggerTypes
  tooltipComponent?: React.ReactElement
  renderTooltipComponent?: (onHideToolTip: MouseEventHandler) => React.ReactElement
  width?: number | 'unset'
  translucent?: boolean
  direction?: string
  className?: string
  transition?: boolean
  [key: string]: any
}

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  placement: direction = 'top',
  secondaryText,
  children,
  tooltipComponent,
  renderTooltipComponent,
  className,
  width,
  transition,
  translucent,
  onVisibilityChange,
  ...props
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [easeOut, setEaseOut] = useState(false)

  const handleVisibilityChange = useCallback(
    (show) => {
      if (transition) {
        if (show) {
          setShowTooltip(true)
          if (onVisibilityChange) {
            onVisibilityChange(true)
          }
        } else {
          setEaseOut(true)
          clearTimeout(timer)
          timer = setTimeout(() => {
            setShowTooltip(false)
            setEaseOut(false)
            if (onVisibilityChange) {
              onVisibilityChange(false)
            }
          }, 300)
        }
      } else if (onVisibilityChange) {
        onVisibilityChange(show)
      }
    },
    [transition, onVisibilityChange]
  )

  return (
    <TooltipTrigger
      {...props}
      tooltipShown={transition ? showTooltip : undefined}
      placement={direction}
      onVisibilityChange={handleVisibilityChange}
      tooltip={({ arrowRef, tooltipRef, getArrowProps, getTooltipProps, placement }: TooltipArg) => {
        const tooltipProps = getTooltipProps({
          ref: tooltipRef,
          className: cx('Tooltip', {
            Tooltip__translucent: translucent,
            Tooltip__easeOut: easeOut,
            Tooltip__easeIn: transition
          })
        })
        return (
          <div {...tooltipProps}>
            <div
              className={cx('Tooltip__container', `Tooltip__container--${placement}`, className)}
              style={width === 'unset' ? undefined : { width: `${width}px`, maxWidth: `${width}px` }}>
              <div
                {...getArrowProps({
                  ref: arrowRef,
                  className: 'Tooltip__arrow',
                  'data-placement': placement
                })}
              />
              <div className='Tooltip__wrap'>
                <Typography variant={TypographyVariant.BODY_SMALL} component='div'>
                  {text}
                </Typography>
                <Typography variant={TypographyVariant.BODY_TINY} component='div'>
                  {secondaryText}
                </Typography>
                {tooltipComponent && tooltipComponent}
                {renderTooltipComponent && renderTooltipComponent(tooltipProps.onMouseLeave)}
              </div>
            </div>
          </div>
        )
      }}>
      {({ getTriggerProps, triggerRef }: ChildrenArg) =>
        React.cloneElement(
          children,
          getTriggerProps({
            ref: triggerRef,
            className: cx(children.props.className, 'trigger')
          })
        )
      }
    </TooltipTrigger>
  )
}

Tooltip.defaultProps = {
  transition: false,
  translucent: true,
  width: 200
}
export default Tooltip
