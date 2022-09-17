import React from 'react'
import { render } from '@testing-library/react'
import { LineChart, LineChartProps } from './LineChart'

const data = {
  labels: [1, 2],
  series: [[0, 1], [3, 5]]
}
describe('LineChart', () => {
  it('renders correctly', () => {
    const props: LineChartProps = {
      data
    }
    const { container } = render(<LineChart {...props} />)
    expect(container).toMatchSnapshot()
  })
})
