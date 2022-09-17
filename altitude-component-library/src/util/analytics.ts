import API from '@aws-amplify/api/lib'
import Auth from '@aws-amplify/auth'
import { GENERAL_URLS } from 'api/endpoints'
import { loadData, saveData } from 'util/storage'
import { noop } from 'util/helpers'

const ENDPOINT_NAME = 'altimeter'

interface TrackingProperies {
  [x: string]: string | number
}

export default class Analytics {
  private static getSegment(): SegmentAnalytics.AnalyticsJS {
    return (
      (window as any).analytics || {
        identify: noop,
        alias: noop
      }
    )
  }

  public static async track(event: string, properties?: TrackingProperies, _options?: {}) {
    try {
      const user = await Auth.currentUserInfo()
      if (user) {
        await API.post(ENDPOINT_NAME, `${GENERAL_URLS.ALTIMETER}`, {
          body: {
            altimeterMethod: 'track',
            eventName: event,
            userId: user.username ? user.username : '',
            metadata: properties
          }
        })
      }
      await Analytics.getSegment().track(event, properties, _options)
    } catch (error) {
      console.error('analytics track error', error)
    }
  }

  public static async identify(userId: string, traits?: {}) {
    try {
      saveData({ userId })
      await API.post(ENDPOINT_NAME, `${GENERAL_URLS.ALTIMETER}`, {
        body: {
          altimeterMethod: 'identify',
          eventName: '',
          userId,
          metadata: traits
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
      await Analytics.getSegment().identify(userId, traits)
    } catch (error) {
      console.error('analytics identify error', error)
    }
  }

  public static async alias(userId: string, previousUserId?: string, options?: {}) {
    try {
      saveData({ userId })
      await API.post(ENDPOINT_NAME, `${GENERAL_URLS.ALTIMETER}`, {
        body: {
          altimeterMethod: 'alias',
          eventName: '',
          userId: previousUserId,
          newUserId: userId,
          metadata: options
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
      await Analytics.getSegment().alias(userId, previousUserId, options)
    } catch (error) {
      console.error('analytics alias error', error)
    }
  }

  public static async page(name?: string, properties?: {}) {
    try {
      const { userId } = loadData()
      await API.post(ENDPOINT_NAME, `${GENERAL_URLS.ALTIMETER}`, {
        body: {
          altimeterMethod: 'page',
          userId: userId || null,
          eventName: name,
          metadata: properties
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error('analytics page error', error)
    }
  }
}
