import React from 'react'
import Auth from '@aws-amplify/auth'
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom'
import { Tabs, Tab, TabList, TabPanel } from '@altitudenetworks/component-library'
import PageTitle from 'components/elements/PageTitle'
import TwoFactorAuthentication from 'components/settings/TwoFactorAuthentication'
import ChangePassword from 'components/settings/ChangePassword'
import BasePage from '../BasePage'
import SlackSettings from 'components/settings/SlackSettings'
import SlackNotifications from 'components/settings/SlackNotifications'
import UI_STRINGS from 'util/ui-strings'
import InformationCard from 'components/elements/InformationCard'
import LightBulb from 'icons/LightBulb'
import './Settings.scss'

interface SettingsState {
  user?: SettingsUser
}

class Settings extends BasePage<RouteComponentProps, SettingsState> {
  protected pageName = this.routePathNames.SETTINGS

  public state = {
    user: undefined
  }

  public async componentDidMount() {
    const user = await Auth.currentAuthenticatedUser()

    this.setState({ user })
  }

  public renderPageContent() {
    const { user } = this.state
    const currentPath = this.props.match.path
    const tabLinks = [`${currentPath}/notifications`, `${currentPath}/accounts`]

    return (
      <div className='Settings'>
        <PageTitle title={UI_STRINGS.SETTINGS.TITLE} />
        {user && (
          <Tabs className='Settings__main' defaultActiveTab={tabLinks.indexOf(this.props.location.pathname)}>
            <TabList>
              <Tab as={NavLink} to={tabLinks[0]} className='Settings__tab'>
                {UI_STRINGS.SETTINGS.NOTIFICATIONS}
              </Tab>
              <Tab as={NavLink} to={tabLinks[1]} className='Settings__tab'>
                {UI_STRINGS.SETTINGS.ACCOUNTS}
              </Tab>
            </TabList>

            <TabPanel>
              <div className='Settings__config-section'>
                <SlackSettings />
                <hr />
                <SlackNotifications />
              </div>
            </TabPanel>
            <TabPanel>
              <InformationCard
                className='Settings__config-tip'
                iconLocation='left'
                icon={<LightBulb size={20} color='black' />}>
                <p>{UI_STRINGS.SETTINGS.ACCOUNTS_NOTE}</p>
              </InformationCard>
              <div className='Settings__config-section'>
                <ChangePassword user={user as unknown as SettingsUser} />
              </div>
              <div className='Settings__config-section'>
                <TwoFactorAuthentication user={user as unknown as SettingsUser} />
              </div>
            </TabPanel>
          </Tabs>
        )}
      </div>
    )
  }
}

export default withRouter(Settings)
