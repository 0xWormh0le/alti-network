import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import Breadcrumb, { BreadcrumbProps } from './Breadcrumb'
import { LocationHistoryContext } from 'models/LocationHistoryContext'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Elements/Breadcrumb',
  component: Breadcrumb
} as Meta

const Template: Story<BreadcrumbProps> = (args) => (
  <BrowserRouter>
    <LocationHistoryContext.Provider
      value={{
        breadcrumbLocations: ['/files/', '/spotlight/', '/page/'],
        trackedQueryParams: {}
      }}>
      <div style={{ background: '#2ea1f8' }}>
        <Breadcrumb {...args} />
      </div>
    </LocationHistoryContext.Provider>
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {
  pageName: 'page'
}
