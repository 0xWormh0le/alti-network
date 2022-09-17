import React from 'react'
import { waitForElement, fireEvent, render } from '@testing-library/react'
import PageNumberInput from './PageNumberInput'
import noop from 'lodash/noop'

describe('PageNumberInput', () => {
  it('renders correctly', async () => {
    const { container } = render(<PageNumberInput onPageChange={noop} pageCount={10} />)

    const input = await waitForElement(() => container.querySelectorAll('.PageNumberInput__input-wrapper > input')[0])
    const goButton = await waitForElement(() => container.querySelectorAll('.PageNumberInput__submit')[0])

    fireEvent.change(input, { target: { value: '2' } })
    fireEvent.click(goButton)

    expect(container).toMatchSnapshot()
  })
})
