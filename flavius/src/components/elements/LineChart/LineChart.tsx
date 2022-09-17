import React, { useRef, useEffect } from 'react'
import ChartistGraph from 'react-chartist'
import Chartist from 'chartist'
import { DateUtils } from 'util/helpers'
import CONSTANTS from 'util/constants'
import './LineChart.scss'

const { TIME_DISPLAY_FORMAT } = CONSTANTS

export interface LineChartProps {
  data: {
    labels: number[]
    series: number[][]
  }
}

interface ChartistDrawData {
  x: number
  y: number
  type: string
  element: {
    replace: (svg: Chartist.IChartistSvg) => Chartist.IChartistSvg
  }
}

interface IChartistGraph {
  chart: HTMLElement
  chartist: Chartist.IChartistLineChart
}

const formatXaxis = (value: number) => {
  const parsedDate = DateUtils.getMoment(value, true)
  // Print year change every January, prepending with single quote.
  if (parsedDate.month() === 0) {
    return parsedDate.format(TIME_DISPLAY_FORMAT.DATE_FORMAT_MONTH_SHORT_YEAR_SHORT)
  }
  return parsedDate.format(TIME_DISPLAY_FORMAT.DATE_FORMAT_MONTH_SHORT)
}

const chartOptions = {
  low: 0,
  showArea: false,
  lineSmooth: false,
  onlyInteger: true,
  axisX: {
    labelInterpolationFnc: formatXaxis
  },
  axisY: {
    labelInterpolationFnc: (value: number) => Math.floor(value) // Either chartist or the react wrapper doesn't respect integerOnly
  }
}

const listener = {
  draw: (data: ChartistDrawData) => {
    if (data.type === 'point') {
      const circle = new Chartist.Svg(
        'circle',
        {
          cx: data.x,
          cy: data.y,
          r: 4,
          fillOpacity: 1
        },
        'ct-point'
      )

      data.element.replace(circle)
    }
  }
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const chartistRef = useRef<IChartistGraph>(null)
  useEffect(() => {
    const chart = chartistRef?.current?.chart
    let chartWidth = chart?.clientWidth
    const timerId = setInterval(() => {
      if (chartWidth !== chart?.clientWidth) {
        const chartist = chartistRef?.current?.chartist
        chartWidth = chart?.clientWidth
        chartist?.update(chartist.data)
      }
    }, 300)
    return () => {
      clearInterval(timerId)
    }
  }, [chartistRef])
  return (
    <ChartistGraph
      ref={chartistRef}
      className='LineChart ct-double-octave'
      type='Line'
      data={data}
      options={{
        // Show slightly more than the maximum value in y axis scale. Minimum of 5
        high: Math.max(Math.max(...data.series[0]) * 1.2, 5),
        ...chartOptions
      }}
      listener={listener}
    />
  )
}

export default LineChart
