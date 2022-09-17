import React from 'react'
import Tabs from './Tabs'
import TabList from './TabList'
import Tab from './Tab'
import TabPanel from './TabPanel'
import { renderWithRouter } from 'test/support/helpers'

describe('Tabs', () => {
  it('renders correctly', () => {
    const { container } = renderWithRouter(
      <Tabs>
        <TabList>
          <Tab>Name</Tab>
          <Tab>Gender</Tab>
          <Tab>Advanced</Tab>
        </TabList>
        <TabPanel>Altitude Network</TabPanel>
        <TabPanel>Neutral</TabPanel>
        <TabPanel>Cyber security</TabPanel>
      </Tabs>
    )
    expect(container).toMatchSnapshot()
  })
})
