import React from 'react'
import { render } from '@testing-library/react'
import DonutChart, { DonutChartProps } from './DonutChart'

describe('DonutChart', () => {
  it('renders correctly', () => {
    const props: DonutChartProps = {
      loading: false,
      data: {
        valueText: 'hello',
        subTitleText: 'world',
        values: [4, 7, 4, 2, 5],
        padding: 10,
        valueType: 'value-type-example',
      },
    }
    const { container } = render(<DonutChart {...props} />)
    expect(container).toMatchSnapshot()
  })
})
