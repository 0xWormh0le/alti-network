import React from 'react'
import Accordion, { AccordionProps } from './Accordion'
import AccordionSummary from './AccordionSummary'
import AccordionDetails from './AccordionDetails'
import { render } from '@testing-library/react'
import { noop } from 'test/support/helpers'

describe('Accordion Unit Tests', () => {
  it('renders Accordion correctly', () => {
    const props: AccordionProps = {
      expanded: false,
      onChange: noop
    }
    const { container } = render(<Accordion {...props} />)

    expect(container).toMatchSnapshot()
  })

  it('renders AccordionSummary correctly', () => {
    const { container } = render(<AccordionSummary />)

    expect(container).toMatchSnapshot()
  })

  it('renders AccordionDetails correctly', () => {
    const { container } = render(<AccordionDetails />)

    expect(container).toMatchSnapshot()
  })
})
