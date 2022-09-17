import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from '@altitudenetworks/component-library'
import PageTitle from 'components/elements/PageTitle'
import SensitivePhrases from 'components/risk-settings/SensitivePhrases'
import DefaultThreshold from 'components/risk-settings/DefaultThreshold'
import WhitelistGroup from 'components/risk-settings/Whitelist'
import RiskTypeStatus from 'components/risk-settings/RiskTypeStatus'
import {
  ClassifySensitiveFilesInfo,
  ManageSensitivePhrasesInfo,
  DownloadsRiskThresholdAppliedInfo,
  RiskTypeSettingInfo,
  WhitelistInfo,
  InternalDomainInfo
} from 'components/risk-settings/InfoCards'
import UI_STRINGS from 'util/ui-strings'
import './RiskSettings.scss'

const RiskSettings: React.FC<{}> = () => (
  <div className='RiskSettings'>
    <PageTitle title='Risk Settings' />
    <Tabs className='RiskSettings__tabs'>
      <TabList>
        <Tab>{UI_STRINGS.RISK_SETTINGS.SENSITIVE_PHRASES}</Tab>
        <Tab>{UI_STRINGS.RISK_SETTINGS.CONFIGURATION}</Tab>
        <Tab>{UI_STRINGS.RISK_SETTINGS.WHITELISTS}</Tab>
      </TabList>
      <TabPanel className='RiskSettings__configuration'>
        <SensitivePhrases />
        <div className='RiskSettings__information'>
          <ClassifySensitiveFilesInfo />
          <ManageSensitivePhrasesInfo />
        </div>
      </TabPanel>
      <TabPanel>
        <div className='RiskSettings__configuration'>
          <DefaultThreshold />
          <div className='RiskSettings__information'>
            <DownloadsRiskThresholdAppliedInfo />
          </div>
        </div>
        <RiskTypeStatus infoCard={<RiskTypeSettingInfo />} />
      </TabPanel>
      <TabPanel className='RiskSettings__configuration'>
        <WhitelistGroup />
        <div className='RiskSettings__information'>
          <WhitelistInfo />
          <InternalDomainInfo />
        </div>
      </TabPanel>
    </Tabs>
  </div>
)

export default RiskSettings
