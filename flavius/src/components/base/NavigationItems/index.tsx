import React, { lazy, ReactNode } from 'react'
import Plugins from 'pages/Plugins'
import { ReactComponent as DashboardIcon } from 'icons/dashboard.svg'
import { ReactComponent as RisksIcon } from 'icons/iron.svg'
import { ReactComponent as SettingsIcon } from 'icons/settings.svg'
import { ReactComponent as PluginsIcon } from 'icons/plugin.svg'
import { ReactComponent as RiskSettingsIcon } from 'icons/risk-settings.svg'
import { ReactComponent as SearchIcon } from 'icons/search.svg'
import { ReactComponent as ActivityIcon } from 'icons/activity.svg'
import { ReactComponent as ManagePlatformsIcon } from 'icons/manage-platforms.svg'
import config, { platformImages, platformsLite } from 'config'
import { trimName } from 'util/helpers'
import ManagePlatforms from 'pages/ManagePlatforms '

const Dashboard = lazy(() => import('pages/Dashboard'))
const Risks = lazy(() => import('pages/Risks'))
const Settings = lazy(() => import('pages/Settings'))
const Search = lazy(() => import('pages/Search'))
const RiskSettings = lazy(() => import('pages/RiskSettings'))
const Activity = lazy(() => import('pages/Activity'))

const { navigationItemsNames, navigationItemsParams } = config

interface NavItem {
  label: string
  key: string
  icon: ReactNode
  component: ReactNode
  disabled: boolean
  routePath?: string
  params?: string[]
  subItems?: NavItem[]
}

/* Main Menu */
export const dashboardItem: NavItem = {
  label: navigationItemsNames.DASHBOARD,
  key: trimName(navigationItemsNames.DASHBOARD),
  icon: <DashboardIcon />,
  component: Dashboard,
  disabled: false
}

export const risksItem: NavItem = {
  label: navigationItemsNames.RISKS,
  key: trimName(navigationItemsNames.RISKS),
  icon: <RisksIcon />,
  component: Risks,
  disabled: false
}

export const searchItem: NavItem = {
  label: navigationItemsNames.SEARCH,
  key: trimName(navigationItemsNames.SEARCH),
  icon: <SearchIcon />,
  component: Search,
  disabled: false
}

export const pluginsItem: NavItem = {
  label: navigationItemsNames.PLUGINS,
  key: trimName(navigationItemsNames.PLUGINS),
  icon: <PluginsIcon />,
  component: Plugins,
  disabled: true
}

export const riskSettingsItem: NavItem = {
  label: navigationItemsNames.RISK_SETTINGS,
  key: trimName(navigationItemsNames.RISK_SETTINGS),
  icon: <RiskSettingsIcon />,
  component: RiskSettings,
  disabled: false
}

const getPlatformList = () => {
  const platformList = platformsLite.map((platform: BasicPlatformData) => ({
    label: platform.platformName,
    routePath: `${navigationItemsNames.ACTIVITY}/${platform.platformName}`,
    key: platform.platformId,
    icon: <img src={platformImages[platform.platformId].Icon} alt={platform.platformName} />,
    component: Activity,
    disabled: false
  }))

  return platformList
}

export const activityItem: NavItem = {
  label: navigationItemsNames.ACTIVITY,
  key: trimName(navigationItemsNames.ACTIVITY),
  icon: <ActivityIcon />,
  component: Activity,
  disabled: false,
  params: navigationItemsParams.ACTIVITY,
  subItems: getPlatformList()
}

/* Support */
export const settingsItem: NavItem = {
  label: navigationItemsNames.SETTINGS,
  key: trimName(navigationItemsNames.SETTINGS),
  icon: <SettingsIcon />,
  component: Settings,
  disabled: false
}

export const managePlatformsItem: NavItem = {
  label: navigationItemsNames.MANAGE_PLATFORMS,
  key: trimName(navigationItemsNames.MANAGE_PLATFORMS),
  icon: <ManagePlatformsIcon />,
  component: ManagePlatforms,
  disabled: false
}
