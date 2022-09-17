import React, { useContext } from 'react'
import Actionbar from 'components/base/Actionbar'
import Breadcrumb from 'components/elements/Breadcrumb'
import SectionTitle from 'components/elements/SectionTitle'
import FileIcon from 'icons/inspector'
import FilesTableContainer from 'components/files/FilesTableContainer'
import { getRiskText } from 'util/helpers'
import { useParams } from 'react-router'
import { MetadataStoreContext } from 'util/metadataStore'
import { useQueryParam } from 'util/hooks'
import Moment from 'react-moment'
import UI_STRINGS from 'util/ui-strings'
import CONSTANTS from 'util/constants'
import './Files.scss'

const Files: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  // const pageName = config.navigationItemsNames.FILES
  const params = useParams<{ riskId: string }>()
  const breadcrumb = <Breadcrumb pageName='Files' Icon={FileIcon} />
  const [riskTypeId] = useQueryParam('riskTypeId', '')
  const titleText = getRiskText(riskTypeId ?? '')

  const { retrieveValue } = useContext(MetadataStoreContext)
  const incidentDates = retrieveValue<Dictionary<number>>(`riskIncidentDates`, {})
  const incidentDate = incidentDates?.[params.riskId]

  return (
    <div className='Files ModalPage'>
      <Actionbar titleComponent={breadcrumb} closeButtonAction={closeModal} />
      <div className='Files__main'>
        <SectionTitle titleText={titleText} />
        <div className='Files__metadata'>
          {incidentDate && (
            <div className='Files__metadata-entry'>
              <span> {UI_STRINGS.RISKS.ACTIVITY_DATE_LABEL}</span>
              <span>
                <Moment utc={true} unix={true} format={CONSTANTS.TIME_DISPLAY_FORMAT.DATE_FORMAT}>
                  {incidentDate * 1000}
                </Moment>
              </span>
            </div>
          )}
        </div>
        <FilesTableContainer riskId={params.riskId} />
      </div>
    </div>
  )
}

export default Files
