import HubspotForm from 'components/hubspot/HubspotForm'
import React from 'react'
import UI_STRINGS from 'util/ui-strings'
import './Support.scss'

const Support: React.FC<{}> = () => {
  return (
    <div className='Support__wrapper'>
      <HubspotForm formTitle={UI_STRINGS.HEADER_BAR.SUPPORT} />
    </div>
  )
}

export default Support
