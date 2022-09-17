import React from 'react'
import { render } from '@testing-library/react'
import { NewSensitivePhrase, NewSensitivePhraseProps } from './NewSensitivePhrase'
import noop from 'lodash/noop'

describe('NewSensitivePhrase', () => {
  it('renders correctly', () => {
    const props: NewSensitivePhraseProps = {
      onAdd: noop
    }
    const { container } = render(<NewSensitivePhrase {...props} />)
    expect(container).toMatchSnapshot()
  })
})
