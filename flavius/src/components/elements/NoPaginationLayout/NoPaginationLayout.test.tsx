import React from 'react'
import { render } from '@testing-library/react'
import { NoPaginationLayout, NoPaginationLayoutProps } from './NoPaginationLayout'

describe('NoPaginationLayout', () => {
  it('renders correctly', () => {
    const props: NoPaginationLayoutProps = {
      Table: () => <table />
    }
    const { container } = render(<NoPaginationLayout {...props} />)
    expect(container).toMatchSnapshot()
  })
})
