import { lazy } from 'react'
import Plugins from 'pages/Plugins'
import DashboardIcon from '../../icons/ic-dashboard'
import RisksIcon from '../../icons/iron'
import SettingsIcon from '../../icons/settings'
import PluginsIcon from '../../icons/plugin'
import RiskSettingsIcon from '../../icons/risk-settings'
import SearchIcon from '../../icons/search'
import config from 'config'

const Dashboard = lazy(() => import('pages/Dashboard'))
const Risks = lazy(() => import('pages/Risks'))
const Settings = lazy(() => import('pages/Settings'))
const Search = lazy(() => import('pages/Search'))
const RiskSettings = lazy(() => import('pages/RiskSettings'))

const { navigationItemsNames } = config

const trimName = (name: string) => name.toLowerCase().replace(' ', '-')

/* Main Menu */
export const dashboardItem = {
  label: navigationItemsNames.DASHBOARD,
  key: trimName(navigationItemsNames.DASHBOARD),
  icon: DashboardIcon,
  component: Dashboard,
  disabled: false
}

export const risksItem = {
  label: navigationItemsNames.RISKS,
  key: trimName(navigationItemsNames.RISKS),
  icon: RisksIcon,
  component: Risks,
  disabled: false
}

export const searchItem = {
  label: navigationItemsNames.SEARCH,
  key: trimName(navigationItemsNames.SEARCH),
  icon: SearchIcon,
  component: Search,
  disabled: false
}

export const pluginsItem = {
  label: navigationItemsNames.PLUGINS,
  key: trimName(navigationItemsNames.PLUGINS),
  icon: PluginsIcon,
  component: Plugins,
  disabled: true
}

export const riskSettingsItem = {
  label: navigationItemsNames.RISK_SETTINGS,
  key: trimName(navigationItemsNames.RISK_SETTINGS),
  icon: RiskSettingsIcon,
  component: RiskSettings,
  disabled: false
}

/* Support */
export const settingsItem = {
  label: navigationItemsNames.SETTINGS,
  key: trimName(navigationItemsNames.SETTINGS),
  icon: SettingsIcon,
  component: Settings,
  disabled: false
}
