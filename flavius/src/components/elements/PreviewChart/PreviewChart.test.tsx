import React from 'react'
import { render } from '@testing-library/react'
import PreviewChart, { PreviewChartProps } from './PreviewChart'
import noop from 'lodash/noop'
import { previewChartData } from 'test/mocks'

jest.mock('@aws-amplify/api/lib')

describe('PreviewChart', () => {
  it('renders correctly', () => {
    const props: PreviewChartProps = {
      data: previewChartData,
      unit: 'downloads',
      onClick: noop,
      colorful: true
    }
    const { container } = render(<PreviewChart {...props} />)
    expect(container).toMatchSnapshot()
  })
})
