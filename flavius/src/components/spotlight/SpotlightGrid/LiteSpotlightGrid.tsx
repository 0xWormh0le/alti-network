import React, { Fragment } from 'react'
import ExplorePlatformsHeader from 'components/spotlight/ExplorePlatformsHeader'
import SpotlightHeader from '../SpotlightHeader'
import { Tab, TabList, Tabs } from '@altitudenetworks/component-library'
import { noop } from 'lodash'
import LiteSpotlightContactTab from '../SpotlightContactTab/LiteSpotlightContactTab'
import SpotlightGridNav from '../SpotlightGridNav'
import LITE_TABS from '../LiteTabs'
import '../SpotlightGrid/SpotlightGrid.scss'

const TAB_WIDTH = 300

interface LiteSpotlightGridProps {
  selectedSubNavKey: SubNavType
  selectedEmail?: string
  personLoading: boolean
  onSubNavClick: (key: SubNavType) => void
  activePerson: Maybe<LitePerson>
  renderDetailsTable: (personId: string) => React.ReactNode
}

const LiteSpotlightGrid: React.FC<LiteSpotlightGridProps> = (props) => {
  const { selectedSubNavKey, selectedEmail, personLoading, onSubNavClick, activePerson, renderDetailsTable } = props
  return (
    <div className='SpotlightGrid'>
      <ExplorePlatformsHeader person={selectedEmail || ''} isLite={true} />
      <div className='SpotlightGrid__header'>
        <SpotlightHeader person={activePerson} loading={personLoading || !activePerson} />
        {activePerson && (
          <Fragment>
            <Tabs className='SpotlightGrid__tabbox' onSelect={noop} width={TAB_WIDTH}>
              <TabList className='SpotlightGrid__tablist'>
                <Tab
                  key={`spotlight_tab`}
                  className='SpotlightGrid__tab'
                  component={(selected) => (
                    <LiteSpotlightContactTab
                      emailInfo={activePerson?.primaryEmail}
                      isSelected={selected}
                      person={activePerson}
                    />
                  )}
                />
              </TabList>
            </Tabs>
            <div className='SpotlightGrid__wrapper'>
              <SpotlightGridNav
                isLite={true}
                subNavTabs={LITE_TABS}
                selectedSubNavKey={selectedSubNavKey}
                subNavLoaded={true}
                onSubNavClick={onSubNavClick}
                onRemoveAccessClick={noop}
                removedAccessCards={[]}
                personInfo={[{ address: activePerson?.primaryEmail.address } as Email]}
                selectedEmail={selectedEmail || ''}
              />
              <div className='SpotlightGrid__main'>
                <div className='SpotlightGrid__content'>{selectedEmail && renderDetailsTable(selectedEmail)}</div>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default LiteSpotlightGrid
