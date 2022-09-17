interface PlatformStatusInfo extends BasicPlatformData {
  isLiteEnabled: boolean
  isFullEnabled: boolean
  isActive: boolean
  connectedOn?: number
}

interface CompanyPlatforms {
  platforms: Dictionary<PlatformStatusInfo>
}

interface CompanyPlatformsResponse {
  platforms: (PlatformStatusInfo & { platformName: never })[]
}
