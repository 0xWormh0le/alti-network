import compact from 'lodash/compact'
import { isDemoEnv, isDevEnv } from 'util/helpers'
import {
  activityItem,
  dashboardItem,
  risksItem,
  settingsItem,
  searchItem,
  riskSettingsItem,
  managePlatformsItem
} from 'components/base/NavigationItems'

type NullableAuthenticatedUser = AuthenticatedUser | null

// This is used to map visibility levels to the custom user attributes defined in Amazon
// Cognito, look for `visibility_level` on the User Pools.

export const VISIBILITY_LEVEL_ATTRIBUTE = 'custom:visibility_level'

export const VisibilityLevel = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
}

const demoEnvironment = isDemoEnv
// temp hide box lite features/routes for staging and production build ONLY, will remove later once box lite is ready
const devEnvironment = isDevEnv

const items = demoEnvironment
  ? [dashboardItem, risksItem, searchItem]
  : devEnvironment
  ? [dashboardItem, risksItem, searchItem, riskSettingsItem, activityItem]
  : [dashboardItem, risksItem, searchItem, riskSettingsItem]

const navigationItemsVisibilityLevelMap = {
  [VisibilityLevel.HIGH]: items,
  [VisibilityLevel.MEDIUM]: items,
  [VisibilityLevel.LOW]: items
}

const supportItemsVisibilityLevelMap = devEnvironment
  ? {
      // settings page is disabled on Demo Environment
      [VisibilityLevel.HIGH]: compact([!demoEnvironment && settingsItem, managePlatformsItem]),
      [VisibilityLevel.MEDIUM]: compact([!demoEnvironment && settingsItem, managePlatformsItem]),
      [VisibilityLevel.LOW]: compact([!demoEnvironment && settingsItem, managePlatformsItem])
    }
  : {
      // settings page is disabled on Demo Environment
      [VisibilityLevel.HIGH]: compact([!demoEnvironment && settingsItem]),
      [VisibilityLevel.MEDIUM]: compact([!demoEnvironment && settingsItem]),
      [VisibilityLevel.LOW]: compact([!demoEnvironment && settingsItem])
    }

function getVisibilityFromAuthenticatedUser(user: NullableAuthenticatedUser) {
  // default visibility: we provide access to all navigation elements (HIGH)
  let visibility = VisibilityLevel.HIGH

  if (user && user.attributes && user.attributes[VISIBILITY_LEVEL_ATTRIBUTE]) {
    visibility = user.attributes[VISIBILITY_LEVEL_ATTRIBUTE]
  }

  return visibility
}

// Based on the visibility level of the authenticatedUser, this will return the menu
// items and routes that the user is allowed to access
export function getNavigationItems(authenticatedUser: NullableAuthenticatedUser) {
  if (!authenticatedUser) {
    return []
  }

  const visibility = getVisibilityFromAuthenticatedUser(authenticatedUser)
  return navigationItemsVisibilityLevelMap[visibility]
}

// Based on the visibility level of the authenticatedUser, this will return the support menu
// items and routes that the user is allowed to access
export function getSupportItems(authenticatedUser: NullableAuthenticatedUser) {
  if (!authenticatedUser) {
    return []
  }

  const visibility = getVisibilityFromAuthenticatedUser(authenticatedUser)
  return supportItemsVisibilityLevelMap[visibility]
}
