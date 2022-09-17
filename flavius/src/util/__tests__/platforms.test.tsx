import { checkIfSubscribed, filterPlatformsByOptions, isLitePlatform, getFullPlatformIds } from '../platforms'

jest.mock('@aws-amplify/api/lib')

const mock: Dictionary<PlatformStatusInfo> = {
  box: {
    canConnect: true,
    isActive: true,
    isLiteEnabled: true,
    platformId: 'box',
    platformName: 'Box',
    isFullEnabled: false
  },
  gsuite: {
    canConnect: false,
    isActive: true,
    isLiteEnabled: false,
    platformId: 'gsuite',
    platformName: 'Google Suite',
    isFullEnabled: true
  },
  o365: {
    canConnect: false,
    isActive: false,
    isLiteEnabled: false,
    platformId: 'o365',
    platformName: 'Microsoft O365',
    isFullEnabled: false
  }
}

describe('Platforms Utility', () => {
  it('Filters properly', async () => {
    // @ts-ignore

    const allPlatforms = mock
    const litePlatforms = filterPlatformsByOptions(mock, { onlyLite: true })
    const activePlatforms = filterPlatformsByOptions(mock, { onlyActive: true })
    const activeLitePlatforms = filterPlatformsByOptions(mock, { onlyActive: true, onlyLite: true })

    expect(litePlatforms).toEqual({
      box: {
        canConnect: true,
        isActive: true,
        isLiteEnabled: true,
        platformId: 'box',
        platformName: 'Box',
        isFullEnabled: false
      }
    })

    expect(activePlatforms).toEqual({
      box: {
        canConnect: true,
        isActive: true,
        isLiteEnabled: true,
        platformId: 'box',
        platformName: 'Box',
        isFullEnabled: false
      },
      gsuite: {
        canConnect: false,
        isActive: true,
        isLiteEnabled: false,
        platformId: 'gsuite',
        platformName: 'Google Suite',
        isFullEnabled: true
      }
    })

    expect(activeLitePlatforms).toEqual({
      box: {
        canConnect: true,
        isActive: true,
        isLiteEnabled: true,
        platformId: 'box',
        platformName: 'Box',
        isFullEnabled: false
      }
    })
  })

  it('Correctly discerns if platform is active', async () => {
    const box = checkIfSubscribed(mock, 'box', {})
    const o356 = checkIfSubscribed(mock, 'o365', {})

    expect(box).toEqual(true)
    expect(o356).toEqual(false)
  })

  it('Correctly return if platform is lite', () => {
    expect(isLitePlatform('box')).toEqual(true)
    expect(isLitePlatform('gsuite')).toEqual(false)
  })

  it('getFullPlatformIds', () => {
    expect(getFullPlatformIds()).toEqual(['gsuite', 'o365'])
  })
})
