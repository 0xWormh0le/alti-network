import React, { useState, useEffect, CSSProperties, useCallback } from 'react'
import ReactFlow, { Handle, NodeProps, Position } from 'react-flow-renderer'
import SectionTitle from 'components/elements/SectionTitle'
import UI_STRINGS from 'util/ui-strings'
import { edges, nodes } from './DashboardRiskGraphData'
import { platforms } from 'config'
import { useMapNodeData } from './DashboardGraphHooks'
import ContentLoader from 'react-content-loader'
import { ErrorBox } from '@altitudenetworks/component-library'
import Filter, { FilterItem } from 'components/elements/Filter/Filter'
import useStatApiClient from 'api/clients/statApiClient'
import GoogleLogo from 'icons/google-logo.svg'
import Office365Logo from 'icons/office-365.svg'
import './DashboardRiskGraph.scss'

interface ISource {
  positionType: string
  id: string
  position: Position
  style: CSSProperties
}

type ITarget = ISource

const CustomNode: React.FC<
  NodeProps<{
    statColor?: string
    circleClassname?: string
    stat: string | number
    statLabel?: string
    sources?: ISource[]
    targets?: ITarget[]
    labelClassname?: string
    label?: string
  }>
> = ({ data }) => {
  const formatNumber = (stat: number | string | null) => {
    let num
    if (stat === null) {
      return '-'
    } else if (stat && typeof stat === 'string') {
      num = parseInt(stat.replace(/[^0-9]/g, ''), 10)
      if (isNaN(num)) {
        return '-'
      }
      return num.toLocaleString()
    } else {
      return stat.toLocaleString()
    }
  }

  const color = data?.statColor ? data.statColor : '#333'

  return (
    <div className='nodeContainer'>
      <div style={{ border: '10px solid transparent' }}>
        <div className={data.circleClassname}>
          <div className='stat' style={{ color }}>
            <div>{formatNumber(data.stat)}</div>
            {data.statLabel && <div>{data.statLabel}</div>}
          </div>
          {data?.sources &&
            data.sources.map((source: ISource) => (
              <Handle
                type='source'
                position={source.positionType as Position}
                id={source.id}
                style={source.hasOwnProperty('style') ? source.style : {}}
                key={source.id}
                isConnectable={false}
              />
            ))}

          {data?.targets &&
            data.targets.map((target: ITarget) => (
              <Handle
                type='target'
                position={target.positionType as Position}
                id={target.id}
                key={target.id}
                style={target.hasOwnProperty('style') ? target.style : {}}
                isConnectable={false}
              />
            ))}
        </div>
      </div>
      <div className={data.labelClassname}>{data.label}</div>
    </div>
  )
}

const nodeTypes = {
  special: CustomNode
}

const platformImages = {
  gsuite: GoogleLogo,
  o365: Office365Logo
}
// TODO: possibly move these data to the new util/platforms once the Box Lite PR is merged, same code snippet in Risks.tsx
const availablePlatforms: FilterItem[] = platforms.map((platform, i) => ({
  id: platform.platformId,
  value: platform.platformId,
  label: platform.platformName,
  selected: i === 0,
  renderComponent: (
    <div>
      {/* TODO: replace this icon with PlatformIcon component once Box Lite PR is merged which involves changing of the PlatformIcon component */}
      <img src={platformImages[platform.platformId]} alt={platform.platformName} />
      <span style={{ marginLeft: '0.5rem' }}>{platform.platformName}</span>
    </div>
  )
}))

const DashboardRiskGraph: React.FC<{}> = () => {
  const [selectedOption, setSelectedOption] = useState<FilterItem>()
  const [platformOptions, setPlatformOptions] = useState<FilterItem[]>([])

  const { useGetDashboardStats } = useStatApiClient()
  const [data, error, isLoading] = useGetDashboardStats()

  const [dataNodes] = useMapNodeData(selectedOption ? selectedOption.value : '', data, nodes)
  const [elements, setElements] = useState<any>([])

  useEffect(() => {
    setSelectedOption(platformOptions[0])
  }, [platformOptions])

  useEffect(() => {
    if (dataNodes.length) {
      setElements([...dataNodes, ...edges])
    }
  }, [dataNodes, setElements])

  useEffect(() => {
    setPlatformOptions(availablePlatforms)
  }, [setPlatformOptions])

  const handleSelectedOptionChange = useCallback((nextSelectedOption: FilterItem[]) => {
    setSelectedOption(nextSelectedOption.find((item) => item.selected))
  }, [])

  if (error) return null

  return (
    <div className='RiskGraph__container'>
      <div className='RiskGraph__top'>
        {isLoading ? (
          <div>
            <ContentLoader
              backgroundColor='#F0F0F0'
              foregroundColor='#F7F7F7'
              height={40}
              width={600}
              uniqueKey='loading-wrapper'>
              <rect x={0} y={0} width={600} height={50} rx={4} ry={1} />
            </ContentLoader>
          </div>
        ) : (
          <React.Fragment>
            <SectionTitle titleText={UI_STRINGS.DASHBOARD.FILE_SHARING} />
            {selectedOption && (
              <Filter
                containerClass='RiskGraph__platforms__filter-container'
                dropdownClass='RiskGraph__platforms__filter-dropdown'
                headerLabel='Platform'
                displayAllOption={true}
                items={platformOptions}
                isSingleSelect={true}
                onSubmit={handleSelectedOptionChange}
              />
            )}
          </React.Fragment>
        )}
      </div>

      <div className={!dataNodes.length || isLoading ? 'RiskGraph__graph_empty' : 'RiskGraph__graph_container'}>
        {isLoading ? (
          <ContentLoader
            backgroundColor='#F0F0F0'
            foregroundColor='#F7F7F7'
            height='500'
            width='100%'
            uniqueKey='loading-wrapper-2'>
            <rect x={0} y={20} height='500' width='100%' rx={4} ry={4} />
          </ContentLoader>
        ) : (
          <React.Fragment>
            {!dataNodes.length ? (
              <ErrorBox mainMessage={'No results found'} secondaryMessage='' />
            ) : (
              <ReactFlow
                elements={elements}
                nodeTypes={nodeTypes}
                nodesDraggable={false}
                paneMoveable={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                preventScrolling={false}
              />
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

export default DashboardRiskGraph
