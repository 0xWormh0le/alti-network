import React from 'react'
import { render } from '@testing-library/react'
import { Phrase, PhraseProps } from './Phrase'

describe('Phrase', () => {
  it('renders small size correctly', () => {
    const props: PhraseProps = {
      size: 'sm',
      phrase: 'internal'
    }
    const { container } = render(<Phrase {...props} />)
    expect(container).toMatchSnapshot()
  })

  it('renders large size correctly', () => {
    const props: PhraseProps = {
      size: 'lg',
      phrase: 'external'
    }
    const { container } = render(<Phrase {...props} />)
    expect(container).toMatchSnapshot()
  })
})
