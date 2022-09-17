import React, { useEffect, useState, useRef, useCallback, createContext, useContext } from 'react'
import Tooltip from 'components/widgets/Tooltip'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import * as Sentry from '@sentry/browser'
import { UI_STRINGS } from 'util/ui-strings'
import { select } from 'd3'
import { geoMercator, geoPath, GeoPermissibleObjects } from 'd3-geo'
import GeoData from './GeoChart.world.geo.json'
import GeoStates from './us-states.json'
import { useCancelablePromise } from 'util/hooks'
import Analytics from 'util/analytics'
import Telescope from 'icons/telescope.svg'
import { renderAttributeIfDev } from 'util/helpers'
import { retrieveFromStorage, storeInStorage } from 'util/storage'
import './TooltipIp.scss'

export const STORAGE_NAME: string = 'local_storage_ip'
export const IP_API_KEY = 'd138c23248c54135b9a844191a4982b2'
export const IP_API_URL = `https://api.ipgeolocation.io/ipgeo?apiKey=${IP_API_KEY}`
const defaultWidth: number = 200
const defaultHeight: number = 150
const withMapWidth: number = 289
const withMapHeight: number = 340

export interface TooltipIpProps {
  ipAddress?: string
}

export interface TooltipIpErrorProps {
  error: string
}

export interface WorldMapProps {
  longitude?: number
  latitude?: number
  country: string
}

export interface IGeoLocation {
  countryName: string
  organization?: string
  city: string
  stateProv?: string
  longitude: number
  latitude: number
}

interface IDimensions {
  width: number
  height: number
  setDimensions(width: number, height: number): void
}

export const storeIpAddressDetails = (ipKey: string, ipData: IGeoLocation) => {
  const storageData = retrieveFromStorage<{ [k: string]: IGeoLocation }>(STORAGE_NAME)
  storeInStorage(STORAGE_NAME, {
    ...storageData,
    [ipKey]: ipData
  })
}

export const getIpAddressDetails = (ipKey: string): Maybe<IGeoLocation> => {
  const storageData = retrieveFromStorage<{ [k: string]: IGeoLocation }>(STORAGE_NAME)
  if (storageData) return storageData[ipKey]
  return null
}

const defaultDimensions: IDimensions = { width: defaultWidth, height: defaultHeight, setDimensions: () => null }
const DimensionsContext = createContext<IDimensions>(defaultDimensions)

const TooltipIp: React.FC<TooltipIpProps> = ({ ipAddress }) => {
  const _IpAddress = ipAddress
  const [width, setWidth] = useState(defaultDimensions.width)
  const [height, setHeight] = useState(defaultDimensions.height)
  const [text, setText] = useState(UI_STRINGS.TOOLTIP_IP.NO_IP)
  useEffect(() => {
    const userId = retrieveFromStorage<string>('userId')
    Analytics.track('View IP Map: ', {
      actor: userId ? userId : 'Unknown Actor'
    })
  })

  useEffect(() => {
    if (_IpAddress) {
      setText(_IpAddress)
    }
  }, [_IpAddress])

  const setDimensions = (newWidth: number, newHeight: number) => {
    setWidth(newWidth)
    setHeight(newHeight)
  }

  const contextValue: IDimensions = { width, height, setDimensions }

  return (
    <DimensionsContext.Provider value={contextValue}>
      <div className='TooltipIp-wrapper'>
        <div className='TooltipIpCell'>
          <Tooltip
            tooltipComponent={<TooltipIpContent ipAddress={_IpAddress} />}
            width={width}
            text=''
            placement='right'>
            <div {...renderAttributeIfDev({ 'data-testid': 'ipaddress' })}>
              <Typography
                variant={TypographyVariant.BODY_SMALL}
                weight='normal'
                className='TooltipIpContainer__displayIp'>
                {text}
              </Typography>
            </div>
          </Tooltip>
        </div>
      </div>
    </DimensionsContext.Provider>
  )
}

const fetchData = async (url: string) => {
  const response = await fetch(url)
  return await response.json()
}

export const getLocationInfo = async (ipAddress: string) => {
  return new Promise<IGeoLocation>(async (resolve, reject) => {
    try {
      const url = `${IP_API_URL}&ip=${ipAddress}`
      const json = await fetchData(url)
      if (json.hasOwnProperty('message')) {
        reject({ errorMessage: UI_STRINGS.TOOLTIP_IP.LOCATION_ERROR })
      }
      const result: IGeoLocation = {
        countryName: json.country_name,
        organization: json.organization,
        city: json.city,
        stateProv: json.state_prov,
        longitude: json.longitude,
        latitude: json.latitude
      }
      return resolve(result)
    } catch (error) {
      Sentry.captureException(error)
      return reject({ errorMessage: UI_STRINGS.TOOLTIP_IP.LOCATION_ERROR })
    }
  })
}

const initialLocation: IGeoLocation = {
  countryName: '',
  organization: '',
  city: '',
  stateProv: '',
  longitude: 0,
  latitude: 0
}

function formatLocation(locationObject: IGeoLocation): string {
  const locationArray: Array<string | undefined> = [
    locationObject.city,
    locationObject.stateProv,
    locationObject.countryName
  ]
  return locationArray.filter((location) => !!location).join(', ')
}

function getIpDataFromLocalStorage(ipAddress: string) {
  return getIpAddressDetails(ipAddress)
}

function saveData(ipAddress: string, data: IGeoLocation) {
  storeIpAddressDetails(ipAddress, data)
}

function WorldMap({ longitude, latitude, country }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const width: number = 249
  const height: number = 150

  useEffect(() => {
    if (longitude && latitude) {
      let scale
      let dataSrc
      if (country === 'United States') {
        scale = 600
        dataSrc = GeoStates.features
      } else {
        scale = 250
        dataSrc = GeoData.features
      }
      const projection = geoMercator()
        .center([longitude, latitude])
        .scale(scale)
        .translate([width / 2, height / 2])
      const svg = select(svgRef.current)
      const path = geoPath().projection(projection)

      svg
        .selectAll('.country')
        .data(dataSrc as any)
        .join('path')
        .attr('class', 'country')
        .attr('fill', '#ccc')
        .attr('stroke', '#000')
        .attr('d', (feature) => path(feature as GeoPermissibleObjects))

      const coords = [{ longitude, latitude }]

      svg
        .selectAll('circle')
        .data(coords)
        .enter()
        .append('circle')
        .attr('r', 8)
        .attr('cx', (d) => {
          const obj = projection([d.longitude!, d.latitude!])
          if (obj && obj !== undefined) {
            return obj[0]
          } else {
            return 0
          }
        })
        .attr('cy', (d) => {
          const obj = projection([d.longitude, d.latitude])
          if (obj && obj !== undefined) {
            return obj[1]
          } else {
            return 0
          }
        })
        .attr('fill', '#f9773d')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
    }
  }, [longitude, latitude, country])

  if (longitude && latitude) {
    return (
      <div className='SvgMapWrapper'>
        <svg width={width} height={height} className='SvgMap' ref={svgRef} viewBox={`0 0 ${width} ${height}`} />
      </div>
    )
  } else {
    return (
      <div>
        <h3>{UI_STRINGS.TOOLTIP_IP.NO_MAP}</h3>
      </div>
    )
  }
}

function getMapData(ipAddress: string): Promise<IGeoLocation> {
  let mapObject = getIpDataFromLocalStorage(ipAddress)
  return new Promise(async (success, reject) => {
    if (!mapObject) {
      try {
        mapObject = await getLocationInfo(ipAddress)
        saveData(ipAddress, mapObject)
        success(mapObject)
      } catch (e) {
        reject(e)
      }
    } else {
      success(mapObject)
    }
  })
}

const TooltipIpContent: React.FC<TooltipIpProps> = ({ ipAddress }: TooltipIpProps) => {
  const cancelablePromise = useCancelablePromise()
  const [locationObject, setLocationObject] = useState<IGeoLocation>(initialLocation)
  const [formattedLocation, setFormatLocation] = useState<string>('')
  const [longitude, setLongitude] = useState(0)
  const [latitude, setlatitude] = useState(0)
  const [country, setCountry] = useState('')
  const [error, setError] = useState('')
  const [mapError, setMapError] = useState('')
  const { setDimensions, height } = useContext(DimensionsContext)

  const getData = useCallback(async () => {
    if (ipAddress && ipAddress !== UI_STRINGS.TOOLTIP_IP.NO_IP) {
      const fetchLocation = async () => {
        try {
          const mapObject = await getMapData(ipAddress)
          if (mapObject) {
            if (mapObject.latitude < 0 && mapObject.longitude < 0) {
              setMapError(UI_STRINGS.TOOLTIP_IP.MAP_COORDINATES_ERROR)
              setDimensions(withMapWidth, 225)
            } else {
              setDimensions(withMapWidth, withMapHeight)
            }
            setLocationObject(mapObject)
            setFormatLocation(formatLocation(mapObject))
            setLongitude(mapObject.longitude)
            setlatitude(mapObject.latitude)
            setCountry(mapObject.countryName)
          }
        } catch (e) {
          setDimensions(defaultWidth, defaultHeight)
          setError(e.errorMessage)
        }
      }
      fetchLocation()
    } else {
      setError(UI_STRINGS.TOOLTIP_IP.NO_IP_ERROR)
    }
  }, [ipAddress, setDimensions])

  useEffect(() => {
    cancelablePromise(getData())
  }, [ipAddress, cancelablePromise, getData])

  return (
    <div
      className='TooltipIpContainer'
      style={{ minHeight: `${height}px` }}
      {...renderAttributeIfDev({ 'data-testid': 'TooltipIpContainer' })}>
      {ipAddress && formattedLocation && !error && (
        <div>
          <Typography variant={TypographyVariant.LABEL_LARGE} weight='normal' className='TooltipIpContainer__header'>
            {UI_STRINGS.TOOLTIP_IP.IP_DETAILS}
          </Typography>
          <div className='TooltipIpContainer__infoBox'>
            <div className='TooltipIpContainer__row'>
              <div>
                <Typography
                  variant={TypographyVariant.BODY_SMALL}
                  weight='normal'
                  className='TooltipIpContainer__infoLabel'>
                  {UI_STRINGS.TOOLTIP_IP.IP}
                </Typography>
              </div>
              <div className='TooltipIpContainer__infoText'>
                <div className='TooltipIpContainer__infoIp'>{ipAddress}</div>
              </div>
            </div>
            <div className='TooltipIpContainer__row'>
              <div>
                <Typography
                  variant={TypographyVariant.BODY_SMALL}
                  weight='normal'
                  className='TooltipIpContainer__infoLabel'>
                  {UI_STRINGS.TOOLTIP_IP.LOCATION}
                </Typography>
              </div>
              <div
                {...renderAttributeIfDev({ 'data-testid': 'formattedLocation' })}
                className='TooltipIpContainer__infoText'>
                {formattedLocation && formattedLocation}
              </div>
            </div>
            <div className='TooltipIpContainer__row'>
              <div>
                <Typography
                  variant={TypographyVariant.BODY_SMALL}
                  weight='normal'
                  className='TooltipIpContainer__infoLabel'>
                  {UI_STRINGS.TOOLTIP_IP.ORG}
                </Typography>
              </div>
              <div className='TooltipIpContainer__infoText'>{locationObject.organization}</div>
            </div>
            <React.Fragment>
              {mapError ? (
                <div
                  className='TooltipIpContainer__mapError'
                  {...renderAttributeIfDev({ 'data-testid': 'coordsError' })}>
                  {mapError}
                </div>
              ) : (
                <WorldMap longitude={longitude} latitude={latitude} country={country} />
              )}
            </React.Fragment>
          </div>
        </div>
      )}
      {error && (
        <div {...renderAttributeIfDev({ 'data-testid': 'errorMessage' })}>
          <TooltipIpError error={error} />
        </div>
      )}
    </div>
  )
}

const TooltipIpError: React.FC<TooltipIpErrorProps> = ({ error }: TooltipIpErrorProps) => (
  <div className='errorWrapper'>
    <div>{error}</div>
    <div>
      <img src={Telescope} alt='No details for this ip' />
    </div>
  </div>
)

export default TooltipIp
