import React from 'react'
import { render } from '@testing-library/react'
import { ConfirmPhraseModalContent, ConfirmPhraseModalContentProps } from './ConfirmPhraseModalContent'

describe('ConfirmPhraseModalContent', () => {
  it('renders content for add action correctly', () => {
    const props: ConfirmPhraseModalContentProps = {
      sensitivePhrase: {
        phrase: 'internal',
        exact: true
      },
      action: 'add'
    }
    const { container } = render(<ConfirmPhraseModalContent {...props} />)
    expect(container).toMatchSnapshot()
  })

  it('renders content for delete action correctly', () => {
    const props: ConfirmPhraseModalContentProps = {
      sensitivePhrase: {
        phrase: 'internal',
        exact: true
      },
      action: 'delete'
    }
    const { container } = render(<ConfirmPhraseModalContent {...props} />)
    expect(container).toMatchSnapshot()
  })
})
