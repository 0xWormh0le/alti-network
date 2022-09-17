import React from 'react'
import { render } from '@testing-library/react'
import { SubmittingModalContent, SubmittingModalContentProps } from './SubmittingModalContent'

describe('SubmittingModalContent', () => {
  it('renders content for add action correctly', () => {
    const props: SubmittingModalContentProps = {
      action: 'add'
    }
    const { container } = render(<SubmittingModalContent {...props} />)
    expect(container).toMatchSnapshot()
  })

  it('renders content for delete action correctly', () => {
    const props: SubmittingModalContentProps = {
      action: 'delete'
    }
    const { container } = render(<SubmittingModalContent {...props} />)
    expect(container).toMatchSnapshot()
  })
})
