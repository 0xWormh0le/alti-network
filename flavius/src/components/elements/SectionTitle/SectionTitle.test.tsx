import React from 'react'
import { render } from '@testing-library/react'
import { SectionTitle, SectionTitleProps } from './SectionTitle'

describe('SectionTitle', () => {
  it('renders correctly', () => {
    const props: SectionTitleProps = {
      titleText: 'Test title'
    }
    const { container } = render(<SectionTitle {...props} />)
    expect(container).toMatchSnapshot()
  })
})
