import React from 'react'
import { render } from '@testing-library/react'

import BasePage from './BasePage'

let container: HTMLElement

describe('BasePage', () => {
  it('renders correctly', () => {
    container = render(<BasePage />).container
    expect(container).toMatchSnapshot()
  })
})
