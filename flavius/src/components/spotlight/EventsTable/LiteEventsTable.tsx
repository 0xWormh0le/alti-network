import { ErrorBox, ModernTable } from '@altitudenetworks/component-library'
import useLitePlatformApiClient from 'api/clients/litePlatformApiClient'
import React, { Fragment } from 'react'
import useQueryParam from 'util/hooks/useQueryParam'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import UI_STRINGS from 'util/ui-strings'
import DateAndTimeCell from 'components/elements/DateAndTimeCell'
import LitePersonCell from 'components/elements/PersonCell/LitePersonCell'
import LiteFileCell from 'components/elements/FileCell/LiteFileCell'
import LiteEventDescriptionCell from 'components/elements/EventDescriptionCell/LiteEventDescriptionCell'
import TableLoading from 'components/elements/TableLoading'
/*
import DateAndTimeCell from 'components/elements/DateAndTimeCell'
import EventDescriptionCell from 'components/elements/EventDescriptionCell'
import IpCell from 'components/elements/IpCell'
import PersonCell from 'components/elements/PersonCell'
import SimplePersonCell from 'components/elements/SimplePersonCell'
import SingleFileCell from 'components/elements/SingleFileCell'
import Person from 'models/Person'
import { valToFileData } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
*/

interface LiteEventsTableProps {
  personId: string
  eventType: string | null
  fields: string[]
}

// const scopedSlots = {
//   [UI_STRINGS.FILE.FILE_NAME]: (val: SpotlightEvent) => <SingleFileCell file={valToFileData(val.files[0])} />,
//   [UI_STRINGS.DASHBOARD.OWNER]: (val: SpotlightEvent) => (
//     <PersonCell personData={new Person(val.files[0].createdBy as IPerson)} />
//   ),
//   [UI_STRINGS.SPOTLIGHT.SHARED_WITH]: (val: SpotlightEvent) =>
//     val.targetPeople.length !== 0 && <PersonCell personData={new Person(val.targetPeople[0] as IPerson)} />,
//   [UI_STRINGS.SPOTLIGHT.SHARED_TO]: (val: SpotlightEvent) =>
//     val.targetPeople.length !== 0 && <PersonCell personData={new Person(val.targetPeople[0] as IPerson)} />,
//   [UI_STRINGS.TOOLTIP_IP.IP]: (val: SpotlightEvent) => <IpCell value={val.ipAddress} />,
//   [UI_STRINGS.SPOTLIGHT.COLLABORATOR]: (val: SpotlightEvent) =>
//     val.targetPeople.length !== 0 && <PersonCell personData={new Person(val.targetPeople[0] as IPerson)} />,
//   [UI_STRINGS.SPOTLIGHT.DATE_TIME]: (val: SpotlightEvent) => <DateAndTimeCell value={val.datetime} />,
//   [UI_STRINGS.SPOTLIGHT.EVENT]: (val: any) => <EventDescriptionCell fileEvent={val as IFileEvent} />,
//   [UI_STRINGS.SPOTLIGHT.TARGET]: (val: SpotlightEvent) =>
//     val.targetPeople?.length && <SimplePersonCell personInfo={val.targetPeople[0]} />,
//   [UI_STRINGS.SPOTLIGHT.DATE_DOWNLOADED]: (val: SpotlightEvent) => <DateAndTimeCell value={val.datetime} />
// }

const LiteEventsTable: React.FC<LiteEventsTableProps> = (props) => {
  const [platformId] = useQueryParam<string>('platformId', '')
  const { personId, eventType, fields } = props
  const [pageNumber, setPageNumber] = useQueryParam<number>('pageNumber', 1)
  const { useGetLitePersonEvents } = useLitePlatformApiClient()
  const [events, eventsErr, isLoading] = useGetLitePersonEvents(platformId, personId, eventType, pageNumber)

  const scopedSlots = {
    [UI_STRINGS.FILE.FILE_NAME]: (val: LiteFileEvent) => <LiteFileCell file={val.files[0]} platformId={platformId} />,
    [UI_STRINGS.DASHBOARD.OWNER]: (val: LiteFileEvent) => <LitePersonCell person={val.actor} platformId={platformId} />,
    [UI_STRINGS.SPOTLIGHT.EVENT]: (val: LiteFileEvent) => <LiteEventDescriptionCell eventName={val.eventName} />,
    [UI_STRINGS.SPOTLIGHT.DATE_DOWNLOADED]: (val: LiteFileEvent) => <DateAndTimeCell value={val.createdAt} />,
    [UI_STRINGS.SPOTLIGHT.DATE_TIME]: (val: LiteFileEvent) => <DateAndTimeCell value={val.createdAt} />,
    [UI_STRINGS.SPOTLIGHT.TARGET]: (val: LiteFileEvent) => <LitePersonCell person={val.actor} platformId={platformId} />
  }

  if (eventsErr) {
    return <ErrorBox />
  }
  return (
    <Fragment>
      <ModernTable
        loadingComponent={<TableLoading />}
        scopedSlots={scopedSlots}
        isLoading={isLoading}
        items={events?.events || []}
        fields={fields}>
        <EntityCountPagination
          entityCount={events?.events?.length || 0}
          onPageChange={setPageNumber}
          pageCount={events?.pageCount || 0}
          pageSize={events?.pageSize || 0}
          pageNumber={pageNumber || 0}
        />
      </ModernTable>
    </Fragment>
  )
}

export default LiteEventsTable
