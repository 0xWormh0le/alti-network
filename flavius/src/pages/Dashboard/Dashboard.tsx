import React from 'react'
import DashboardRiskSummary from 'components/dashboard/DashboardRiskSummary'
import DashboardRiskInsights from 'components/dashboard/DashboardRiskInsights'
import DashboardRiskGraph from 'components/dashboard/DashboardRiskGraph'
import PageTitle from 'components/elements/PageTitle'
import BasePage from '../BasePage'
import { UserContextConsumer } from 'models/UserContext'
import UI_STRINGS from 'util/ui-strings'
import './Dashboard.scss'

class Dashboard extends BasePage<{}, {}> {
  protected pageName = this.routePathNames.DASHBOARD

  public renderPageContent() {
    return (
      <UserContextConsumer>
        {({ showWelcomeDialog, setShowWelcomeDialog }) => (
          <div className='Dashboard'>
            <PageTitle title={UI_STRINGS.DASHBOARD.TITLE} />
            <div className='Dashboard__wrapper Dashboard__wrapper_separator' />
            <div className='Dashboard__wrapper'>
              <div className='Dashboard__wrapper_top'>
                <DashboardRiskGraph />
                <DashboardRiskInsights />
              </div>
              <DashboardRiskSummary />
            </div>
          </div>
        )}
      </UserContextConsumer>
    )
  }
}

export default Dashboard
