import React from 'react'
import { render } from '@testing-library/react'
import Typography, { TypographyVariant } from './Typography'

describe('Typography', () => {
  it('renders correctly', () => {
    const props = {
      variant: TypographyVariant.H3,
    }
    const { container } = render(
      <Typography {...props}>
        <span>hello world</span>
      </Typography>
    )
    expect(container).toMatchSnapshot()
  })
})
