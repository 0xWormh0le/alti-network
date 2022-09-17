// import API from '@aws-amplify/api/lib'
// import { GENERAL_URLS } from 'api/endpoints'
// import { loadData, saveData } from 'util/storage'
// import { noop } from 'util/helpers'
// import { getUserFromStorage } from './auth'

// const ENDPOINT_NAME = 'altimeter'

interface TrackingProperies {
  [x: string]: string | number
}

export default class Analytics {
  public static track = (event: string, properties?: TrackingProperies, _options?: {}) => null

  public static identify = (userId: string, traits?: {}) => null

  public static alias = (userId: string, previousUserId?: string, options?: {}) => null

  public static page = (name?: string, properties?: {}) => null
}

// class DisabledAnalytics {
//   private static getSegment(): SegmentAnalytics.AnalyticsJS {
//     return (
//       (window as any).analytics || {
//         identify: noop,
//         alias: noop
//       }
//     )
//   }

//   public static async track(event: string, properties?: TrackingProperies, _options?: {}) {
//     try {
//       const user = getUserFromStorage()
//       if (user) {
//         await API.post(ENDPOINT_NAME, `${GENERAL_URLS.ALTIMETER}`, {
//           body: {
//             altimeterMethod: 'track',
//             eventName: event,
//             userId: user.email ? user.email : '',
//             metadata: properties
//           }
//         })
//       }
//       await DisabledAnalytics.getSegment().track(event, properties, _options)
//     } catch (error) {
//       console.error('analytics track error', error)
//     }
//   }

//   public static async identify(userId: string, traits?: {}) {
//     try {
//       saveData({ userId })
//       await API.post(ENDPOINT_NAME, `${GENERAL_URLS.ALTIMETER}`, {
//         body: {
//           altimeterMethod: 'identify',
//           eventName: '',
//           userId,
//           metadata: traits
//         },
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       })
//       await DisabledAnalytics.getSegment().identify(userId, traits)
//     } catch (error) {
//       console.error('analytics identify error', error)
//     }
//   }

//   public static async alias(userId: string, previousUserId?: string, options?: {}) {
//     try {
//       saveData({ userId })
//       await API.post(ENDPOINT_NAME, `${GENERAL_URLS.ALTIMETER}`, {
//         body: {
//           altimeterMethod: 'alias',
//           eventName: '',
//           userId: previousUserId,
//           newUserId: userId,
//           metadata: options
//         },
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       })
//       await DisabledAnalytics.getSegment().alias(userId, previousUserId, options)
//     } catch (error) {
//       console.error('analytics alias error', error)
//     }
//   }

//   public static async page(name?: string, properties?: {}) {
//     try {
//       const { userId } = loadData()
//       await API.post(ENDPOINT_NAME, `${GENERAL_URLS.ALTIMETER}`, {
//         body: {
//           altimeterMethod: 'page',
//           userId: userId || null,
//           eventName: name,
//           metadata: properties
//         },
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       })
//     } catch (error) {
//       console.error('analytics page error', error)
//     }
//   }
// }
