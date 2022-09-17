import React from 'react'
import cx from 'classnames'
import ChartistGraph from 'react-chartist'
import ContentLoader from 'react-content-loader'
import './DonutChart.scss'

export interface DonutChartProps {
  data: {
    valueText: string
    subTitleText: string
    values: number[]
    padding: number
    valueType: string
  }
  loading: boolean
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, loading }) => {
  const values = {
    series: data.padding !== -1 ? data.values.concat(data.padding) : data.values
  }

  const chartOptions = {
    donut: true,
    donutWidth: 4,
    donutSolid: true,
    startAngle: 0,
    showLabel: false
  }

  const className = 'DonutChart__' + data.valueType

  return (
    <div className={cx('DonutChart', className)}>
      <ChartistGraph data={values} options={chartOptions} type='Pie' key={data.valueText} />
      <div className='DonutChart__body'>
        <div className='DonutChart__body--title'>
          {loading ? (
            <ContentLoader
              backgroundColor='#F0F0F0'
              foregroundColor='#F7F7F7'
              height={20}
              width={50}
              uniqueKey='DonutChart__body--title'>
              <rect x={10} y={0} width={30} height={20} rx={4} ry={4} />
            </ContentLoader>
          ) : (
            data.valueText
          )}
        </div>
        <div className='DonutChart__body--subtitle'>{data.subTitleText}</div>
      </div>
    </div>
  )
}

export default DonutChart
