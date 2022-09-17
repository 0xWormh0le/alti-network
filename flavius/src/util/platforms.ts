import useCompanyInformationApiClient from 'api/clients/companyInformationApiClient'
import { platforms as platformsFull, platformsLite } from 'config'
import { createContext, useEffect, useState } from 'react'

interface GetCompanyPlatformOptions {
  onlyActive?: boolean
  onlyLite?: boolean
}

export const filterPlatformsByOptions = (
  platforms: Dictionary<PlatformStatusInfo>,
  options: GetCompanyPlatformOptions
): Dictionary<PlatformStatusInfo> => {
  if (!platforms) return {}

  return Object.fromEntries(
    Object.entries(platforms).filter(([, platformData]) => {
      if (options.onlyLite && !platformData.isLiteEnabled) return false
      if (options.onlyActive && !platformData.isActive) return false
      return true
    })
  )
}

const fillOutBasicPlatformDetails = (platformsRs: CompanyPlatformsResponse) => {
  const basicPlatformData = getAllPlatformsBasicData()
  const platformStatusWithName: Dictionary<PlatformStatusInfo> = Object.fromEntries(
    Object.values(platformsRs.platforms || {}).map((platformValue) => [
      platformValue.platformId,
      {
        ...platformValue,
        platformName:
          basicPlatformData.find((basicPlatform) => basicPlatform.platformId === platformValue.platformId)
            ?.platformName || ''
      }
    ])
  )

  return platformStatusWithName
}

/**
 * This function fetches the data from the API and first normalizes it by hydrating it with platform names,
 * as well changing its shape and filtering it.
 * @param options Filters
 * @param onFail What to do on fail
 * @returns [Platforms, Loading, Function To Refresh Cache]
 */
export const useGetNormalizedCompanyPlatforms = (
  options: GetCompanyPlatformOptions = { onlyActive: false, onlyLite: false },
  onFail?: (err: { error: string }) => void
): [Dictionary<PlatformStatusInfo>, boolean, ApiCaller<any>] => {
  const [platforms, setPlatforms] = useState<Maybe<Dictionary<PlatformStatusInfo>>>(null)

  const companyInformationApiClient = useCompanyInformationApiClient({
    handleError: (err) => {
      if (onFail) onFail({ error: err.message })
    },
    handleSuccess: (platformsRs) => {
      const platformStatusWithName: Dictionary<PlatformStatusInfo> = fillOutBasicPlatformDetails(platformsRs)
      setPlatforms(platformStatusWithName)
    }
  })

  const [, platformsErr, isLoading, getPlatforms] = companyInformationApiClient.useGetCompanyPlatforms()

  useEffect(() => {
    if (!platforms && !isLoading && !platformsErr) {
      getPlatforms.call()
    }
  }, [platforms, isLoading, platformsErr, getPlatforms])

  return [filterPlatformsByOptions(platforms || {}, options), isLoading, getPlatforms]
}

/**
 * Internal function to check if a platform is subscribed to.
 */
export const checkIfSubscribed = (
  platforms: Dictionary<PlatformStatusInfo>,
  platformId: string,
  extraFilters: { onlyLite?: boolean }
) => {
  return Object.keys(filterPlatformsByOptions(platforms, { onlyActive: true, ...extraFilters })).includes(platformId)
}

/**
 * Fetches data if necessary, and checks if platform is active
 * @param platformId Platform to check for
 * @param options Extra filters
 * @returns A pair of booleans, [isLoading, isSubscribed]
 */
export const useIsSubscribedToPlatform = (
  platformId: string,
  options: { onlyLite?: boolean } = {}
): [boolean, boolean] => {
  const [platforms, isLoading] = useGetNormalizedCompanyPlatforms()
  // If platforms have been fetched
  if (Object.entries(platforms).length && !isLoading) {
    return [isLoading, checkIfSubscribed(platforms, platformId, options)]
  }

  return [isLoading, false]
}

export const getAllPlatformsBasicData = (): BasicPlatformData[] => platformsFull.concat(platformsLite)

export const getPlatformBasicData = (platformId: string): BasicPlatformData => {
  const allPlatforms = getAllPlatformsBasicData()
  const platform = allPlatforms.find((p) => p.platformId === platformId)

  if (!platform) throw new Error('No platform found')

  return platform
}

export const isLitePlatform = (platformId: string): boolean =>
  platformsLite.findIndex((platform) => platform.platformId === platformId) > -1

export const getFullPlatformIds = (): string[] => platformsFull.map((platform) => platform.platformId)

// Creating dedicated platforms context to avoid prop-drilling in cases like Spotlight.tsx
export const PlatformsContext = createContext<{ platforms: Maybe<Dictionary<PlatformStatusInfo>> }>({ platforms: {} })
