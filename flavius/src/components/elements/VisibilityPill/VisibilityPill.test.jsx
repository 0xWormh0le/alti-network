import React from 'react'
import VisibilityPill from './VisibilityPill'
import { render } from '@testing-library/react'

it('renders correctly', () => {
  const { container } = render(<VisibilityPill visibility='internal' />)
  expect(container).toMatchSnapshot()
})

it('renders name and classname for `internal` status', () => {
  const { getByText } = render(<VisibilityPill visibility='internal' />)

  const statusElement = getByText(/internal/i)

  expect(statusElement).toBeInTheDocument()
  expect(statusElement).toHaveClass('Marker__internal')
})

it('renders name and classname for `external` status', () => {
  const { getByText } = render(<VisibilityPill visibility='external' />)

  const statusElement = getByText(/external/i)

  expect(statusElement).toBeInTheDocument()
  expect(statusElement).toHaveClass('Marker__external')
})

it('renders name and classname for `internal_discoverable` status', () => {
  const { getByText } = render(<VisibilityPill visibility='internal_discoverable' />)

  const statusElement = getByText(/internal & discoverable/i)

  expect(statusElement).toBeInTheDocument()
  expect(statusElement).toHaveClass('Marker__internal_discoverable')
})

it('renders name and classname for `external_discoverable` status', () => {
  const { getByText } = render(<VisibilityPill visibility='external_discoverable' />)

  const statusElement = getByText(/external & discoverable/i)

  expect(statusElement).toBeInTheDocument()
  expect(statusElement).toHaveClass('Marker__external_discoverable')
})

describe('renders None visibility', () => {
  const statuses = ['none', 'user', 'group']

  statuses.forEach((status) => {
    it(`renders name and classname for ${status} status`, () => {
      const { getByText } = render(<VisibilityPill visibility={status} />)

      const statusElement = getByText(/No Link Sharing/i)

      expect(statusElement).toBeInTheDocument()
      expect(statusElement).toHaveClass(`Marker__${status}`)
    })
  })
})

it('renders tooltip correctly', () => {
  const { container } = render(<VisibilityPill visibility='external_discoverable' />)
  expect(container.querySelector('.Marker')).toHaveClass('trigger')
})
