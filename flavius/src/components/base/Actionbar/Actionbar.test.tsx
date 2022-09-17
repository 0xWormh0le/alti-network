import React from 'react'
import { render } from '@testing-library/react'

import noop from 'lodash/noop'
import Actionbar from './Actionbar'

const props = {
  closeButtonAction: noop,
  titleComponent: <div />
}

let container: HTMLElement

describe('Actionbar', () => {
  beforeEach(() => {
    container = render(<Actionbar {...props} />).container
  })

  it('renders correctly', () => {
    expect(container).toMatchSnapshot()
  })
})
