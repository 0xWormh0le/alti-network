import React from 'react'
import { render } from '@testing-library/react'
import { PhraseCount, PhraseCountProps } from './PhraseCount'

describe('PhraseCount', () => {
  it('renders correctly', () => {
    const props: PhraseCountProps = {
      count: 10,
      loading: false
    }
    const { container } = render(<PhraseCount {...props} />)
    expect(container).toMatchSnapshot()
  })

  it('renders loading status correctly', () => {
    const props: PhraseCountProps = {
      count: 10,
      loading: true
    }
    const { container } = render(<PhraseCount {...props} />)
    expect(container).toMatchSnapshot()
  })
})
