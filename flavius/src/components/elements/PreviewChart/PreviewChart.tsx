import React, { useRef, useEffect, useState } from 'react'
import ChartistGraph from 'react-chartist'
import Chartist from 'chartist'
import moment from 'moment'
import CONSTANTS from 'util/constants'
import cx from 'classnames'
import { largeNumberDisplay, pluralize } from 'util/helpers'
import './PreviewChart.scss'

const { TIME_DISPLAY_FORMAT } = CONSTANTS

export interface PreviewChartProps {
  data: {
    labels: number[]
    series: number[][]
  }
  onMouseMove?: (event: any) => void
  onClick?: (disabled: boolean) => void
  unit: string
  colorful?: boolean
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
  // Moment Unix parser localizes by default, add UTC to avoid that.
  const parsedDate = moment.unix(value).utc()

  return parsedDate.format(TIME_DISPLAY_FORMAT.DATE_FORMAT_MONTH_SHORT_YEAR)
}

const chartOptions = {
  low: 0,
  showArea: true,
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

      graphData.push(data)
    } else if (data.type === 'area') {
      const pathElements = (data as any).path.pathElements as any[]
      let bottomY = pathElements[0].y
      pathElements.forEach((e) => {
        if (e.y > bottomY) {
          bottomY = e.y
        }
      })
      const newDataStr = pathElements
        .map((element) => {
          if (element.y === bottomY) {
            return element.command + element.x + ',' + (bottomY + 2)
          }
          return element.command + element.x + ',' + element.y
        })
        .join('')

      const area = new Chartist.Svg('path', { d: newDataStr }, 'ct-area')
      data.element.replace(area)
    }
  }
}

const graphData: ChartistDrawData[] = []

export const PreviewChart: React.FC<PreviewChartProps> = ({ data, onClick, colorful, unit }) => {
  const chartistRef = useRef<IChartistGraph>(null)
  const hotPointRef = useRef<HTMLDivElement>(null)

  const [state, setState] = useState<string>('')

  const [disabled, setDisabled] = useState<boolean>(false)
  const [color, setColor] = useState<string>('blue')

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

    if (chartistRef && chartistRef.current) {
      if (colorful) {
        const len = data.series.length
        if (len > 2 && data.series[len - 3] > data.series[len - 2] && data.series[len - 2] > data.series[len - 1]) {
          setColor('green')
        } else if (
          len > 2 &&
          data.series[len - 3] < data.series[len - 2] &&
          data.series[len - 2] < data.series[len - 1]
        ) {
          setColor('red')
        }
      }

      chartistRef.current.chart.onmousemove = (event) => {
        const filtered = graphData.filter((point) => point.x < event.offsetX)
        let ptOver: any
        if (filtered.length > 0) {
          ptOver = filtered[filtered.length - 1]
        } else {
          ptOver = graphData[0]
        }

        if (ptOver.x !== undefined && ptOver.y !== undefined) {
          hotPointRef.current?.style.setProperty('left', ptOver.x - 4 - 40 + 'px')
          hotPointRef.current?.style.setProperty('top', ptOver.y - 4 + 'px')
          hotPointRef.current?.classList.remove('hidden')
          const pluralized = pluralize(unit, data.series[0][ptOver.index])
          const strDisplay =
            largeNumberDisplay(data.series[0][ptOver.index]) +
            ' ' +
            pluralized +
            ' | ' +
            formatXaxis(data.labels[ptOver.index])
          setState(strDisplay)
        }
      }
    }

    return () => {
      clearInterval(timerId)
    }
  }, [chartistRef, hotPointRef, setState, data, colorful, unit])

  const onClickHandler = () => {
    if (onClick) {
      onClick(!disabled)
    }
    setDisabled(!disabled)
  }

  return (
    <div className='PreviewChartWrapper' onClick={onClickHandler}>
      <div className={cx('hot-point hidden', { disabled }, color)} ref={hotPointRef} />
      <ChartistGraph
        ref={chartistRef}
        className={cx('PreviewChart ct-double-octave', { disabled }, color)}
        type='Line'
        data={data}
        options={{
          // Show slightly more than the maximum value in y axis scale. Minimum of 5
          high: Math.max(Math.max(...data.series[0]) * 1.2, 5),
          ...chartOptions
        }}
        listener={listener}
      />
      <div className='PreviewChartState'>{state && <span>{state}</span>}</div>
    </div>
  )
}

export default PreviewChart
