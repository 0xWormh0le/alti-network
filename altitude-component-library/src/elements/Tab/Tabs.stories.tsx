import React, { ReactNode } from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import Tabs, { TabsProps } from './Tabs'
import TabList from './TabList'
import Tab from './Tab'
import TabPanel from './TabPanel'

export default {
  title: 'Elements/Tabs',
  component: Tabs
} as Meta

interface TabsDemoProps extends TabsProps {
  tabComponents?: ReactNode[]
}

const ArrowRight = () => <div style={{ padding: '2px 5px' }}>›</div>
const ArrowLeft = () => <div style={{ padding: '2px 5px' }}>‹</div>
const FirstTab = () => (
  <div>
    <img
      src='https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg'
      style={{ height: '1em' }}
    />
  </div>
)
const SecondTab = () => <div>Second Tab</div>
const ThirdTab = () => (
  <div>
    <img src='https://altitudenetworks.com/images/logo-wordmark.png' style={{ height: '1em' }} />
  </div>
)

const Template: Story<TabsDemoProps> = ({ tabComponents, ...tabsProps }) => (
  <Tabs {...tabsProps}>
    <TabList>
      <Tab component={tabComponents ? tabComponents[0] : undefined}>Name</Tab>
      <Tab component={tabComponents ? tabComponents[1] : undefined}>Gender</Tab>
      <Tab component={tabComponents ? tabComponents[2] : undefined}>Advanced</Tab>
    </TabList>
    <TabPanel>
      Altitude Network
      <br />
      If you are testing Scrolled Tab, decrease your browser width to see horizontal scrolled tab.
    </TabPanel>
    <TabPanel>Neutral</TabPanel>
    <TabPanel>Cyber security</TabPanel>
  </Tabs>
)

export const Default = Template.bind({})
Default.args = {}

export const DefaultActiveTab = Template.bind({})
DefaultActiveTab.args = {
  defaultActiveTab: 1
}

export const ControlledTab = Template.bind({})
ControlledTab.args = {
  activeTab: 1
}

export const ScrolledTab = Template.bind({})
ScrolledTab.args = {
  width: 290,
  arrowLeft: <ArrowLeft />,
  arrowRight: <ArrowRight />
}

export const CustomTab = Template.bind({})
CustomTab.args = {
  width: 200,
  tabComponents: [<FirstTab key={1} />, <SecondTab key={2} />, <ThirdTab key={3} />]
}
