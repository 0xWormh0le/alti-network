import React from 'react'
import cx from 'classnames'
import './Typography.scss'

export const TypographyVariant = {
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  SUBHEAD1: 'subhead1',
  SUBHEAD2: 'subhead2',
  BODY_LARGE: 'body-large',
  BODY_SMALL: 'body-small',
  BODY_TINY: 'body-tiny',
  BODY: 'body',
  LABEL: 'label',
  LABEL_LARGE: 'label-large'
} as const

type TypographyVariantType = typeof TypographyVariant

type TypographyVariantKeys = keyof TypographyVariantType

export type TypographyVariantValues = typeof TypographyVariant[TypographyVariantKeys]

export type TypographyWeight = 'bold' | 'semibold' | 'medium' | 'normal' | 'light'

export interface TypographyProps {
  variant: TypographyVariantValues
  weight?: TypographyWeight
  children: React.ReactNode
  uppercase?: boolean
  className?: string
  component?: string | React.ComponentType<any>
  onClick?: any
}

const getTagNameFromVariant = (variant: string): string => {
  switch (variant) {
    case TypographyVariant.H1:
    case TypographyVariant.H2:
    case TypographyVariant.H3:
      return variant
    case TypographyVariant.SUBHEAD1:
      return 'h6'
    case TypographyVariant.SUBHEAD2:
      return 'h6'
    case TypographyVariant.BODY:
    case TypographyVariant.BODY_LARGE:
    case TypographyVariant.BODY_SMALL:
      return 'p'
    case TypographyVariant.LABEL:
    case TypographyVariant.LABEL_LARGE:
      return 'span'
    default:
      return 'div'
  }
}

export type Ref = HTMLElement

export const Typography = React.forwardRef<Ref, TypographyProps>(
  ({ children, className, component, variant, uppercase, weight, ...otherProps }, ref) => {
    const Tag = component || getTagNameFromVariant(variant)
    return (
      <Tag
        ref={ref}
        className={cx(
          'Typography',
          `Typography--${variant}`,
          {
            [`Typography--${weight}`]: Boolean(weight),
            'Typography--uppercase': uppercase
          },
          className
        )}
        {...otherProps}>
        {children}
      </Tag>
    )
  }
)

export default Typography
