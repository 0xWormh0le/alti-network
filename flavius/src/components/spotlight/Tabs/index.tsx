import React from 'react'
import RisksTable from 'components/spotlight/RisksTable'
import FilesTable from 'components/spotlight/FilesTable'
import EventsTable from 'components/spotlight/EventsTable'
import { SubNavTab } from '../SpotlightGridNav/SpotlightGridNav'
import UI_STRINGS from 'util/ui-strings'
import { GENERAL_URLS } from 'api/endpoints'

const INITIAL_TABS: SubNavTab[] = [
  {
    label: UI_STRINGS.SPOTLIGHT.ALL,
    seriesKey: 'risks',
    value: 0,
    valueType: 'risk',
    unit: 'risk',
    renderDetailsTable: (personId: string) => (
      <RisksTable queryParams={{ personId }} exportUrl={`${GENERAL_URLS.RISKS}?person-id=${personId}`} />
    )
  },
  {
    label: UI_STRINGS.SPOTLIGHT.CREATED,
    seriesKey: 'risksCreated',
    value: 0,
    valueType: 'risk',
    unit: 'risk',
    renderDetailsTable: (personId: string) => (
      <RisksTable queryParams={{ creatorId: personId }} exportUrl={`${GENERAL_URLS.RISKS}?creator-id=${personId}`} />
    )
  },
  {
    label: UI_STRINGS.SPOTLIGHT.ACCESSIBLE,
    seriesKey: 'filesAccessible',
    value: 0,
    valueType: 'file',
    unit: 'file',
    renderDetailsTable: (personId: string) => (
      <FilesTable
        queryParams={{ personId }}
        fields={[
          UI_STRINGS.FILE.FILE_NAME,
          UI_STRINGS.FILE.FILE_OWNER,
          UI_STRINGS.EDIT_PERMISSIONS.CREATED_ON,
          UI_STRINGS.EDIT_PERMISSIONS.LAST_MODIFIED
        ]}
        exportUrl={`${GENERAL_URLS.FILES}?person-id=${personId}`}
      />
    )
  },
  {
    label: UI_STRINGS.SPOTLIGHT.OWNED_AND_ATRISK,
    seriesKey: 'atRiskFilesOwned',
    value: 0,
    valueType: 'file',
    unit: 'file',
    renderDetailsTable: (personId: string) => (
      <FilesTable
        queryParams={{ ownerId: personId, atRisk: true }}
        fields={[
          UI_STRINGS.FILE.FILE_NAME,
          UI_STRINGS.EDIT_PERMISSIONS.CREATED_ON,
          UI_STRINGS.EDIT_PERMISSIONS.LAST_MODIFIED
        ]}
        exportUrl={`${GENERAL_URLS.FILES}?owner-id=${personId}&at-risk=true`}
      />
    )
  },
  {
    label: UI_STRINGS.SPOTLIGHT.RECEIVED,
    seriesKey: 'filesSharedWith',
    value: 0,
    valueType: 'file',
    unit: 'file',
    renderDetailsTable: (personId: string) => (
      <EventsTable
        personId={personId}
        eventType='sharedWith'
        fields={[
          UI_STRINGS.FILE.FILE_NAME,
          UI_STRINGS.DASHBOARD.OWNER,
          UI_STRINGS.SPOTLIGHT.SHARED_WITH,
          UI_STRINGS.SPOTLIGHT.DATE_TIME
        ]}
        exportUrl={`${GENERAL_URLS.PERSON}/${personId}/events?event-type=sharedWith`}
        sortingHeader={[UI_STRINGS.SPOTLIGHT.DATE_TIME]}
        csvHeaderRow={[
          UI_STRINGS.CSV_HEADERS.FILE_NAME,
          UI_STRINGS.CSV_HEADERS.LINK_INSPECTOR,
          UI_STRINGS.CSV_HEADERS.LINK_STORAGE,
          UI_STRINGS.CSV_HEADERS.FILE_ID,
          UI_STRINGS.CSV_HEADERS.PLATFORM,
          UI_STRINGS.CSV_HEADERS.FILE_OWNER,
          UI_STRINGS.CSV_HEADERS.IP_ADDRESS,
          UI_STRINGS.CSV_HEADERS.DOWNLOADED_ON
        ]}
      />
    )
  },
  {
    label: UI_STRINGS.SPOTLIGHT.SHARED,
    seriesKey: 'filesSharedBy',
    value: 0,
    valueType: 'file',
    unit: 'file',
    renderDetailsTable: (personId: string) => (
      <EventsTable
        personId={personId}
        eventType='sharedBy'
        fields={[
          UI_STRINGS.FILE.FILE_NAME,
          UI_STRINGS.DASHBOARD.OWNER,
          UI_STRINGS.SPOTLIGHT.SHARED_TO,
          UI_STRINGS.SPOTLIGHT.DATE_TIME
        ]}
        exportUrl={`${GENERAL_URLS.PERSON}/${personId}/events?event-type=sharedBy`}
        sortingHeader={[UI_STRINGS.SPOTLIGHT.DATE_TIME]}
        csvHeaderRow={[
          UI_STRINGS.CSV_HEADERS.FILE_NAME,
          UI_STRINGS.CSV_HEADERS.LINK_INSPECTOR,
          UI_STRINGS.CSV_HEADERS.LINK_STORAGE,
          UI_STRINGS.CSV_HEADERS.FILE_ID,
          UI_STRINGS.CSV_HEADERS.PLATFORM,
          UI_STRINGS.CSV_HEADERS.FILE_OWNER,
          UI_STRINGS.CSV_HEADERS.IP_ADDRESS,
          UI_STRINGS.CSV_HEADERS.DOWNLOADED_ON
        ]}
      />
    )
  },
  {
    label: UI_STRINGS.SPOTLIGHT.PERSON_DOWNLOADS,
    seriesKey: 'personDownloads',
    value: 0,
    valueType: 'event',
    unit: 'download',
    renderDetailsTable: (personId: string) => (
      <EventsTable
        personId={personId}
        eventType='personDownloads'
        fields={[
          UI_STRINGS.FILE.FILE_NAME,
          UI_STRINGS.DASHBOARD.OWNER,
          UI_STRINGS.TOOLTIP_IP.IP,
          UI_STRINGS.SPOTLIGHT.DATE_DOWNLOADED
        ]}
        exportUrl={`${GENERAL_URLS.PERSON}/${personId}/events?event-type=personDownloads`}
        sortingHeader={[UI_STRINGS.SPOTLIGHT.DATE_DOWNLOADED]}
        csvHeaderRow={[
          UI_STRINGS.CSV_HEADERS.FILE_NAME,
          UI_STRINGS.CSV_HEADERS.LINK_INSPECTOR,
          UI_STRINGS.CSV_HEADERS.LINK_STORAGE,
          UI_STRINGS.CSV_HEADERS.FILE_ID,
          UI_STRINGS.CSV_HEADERS.PLATFORM,
          UI_STRINGS.CSV_HEADERS.FILE_OWNER,
          UI_STRINGS.CSV_HEADERS.IP_ADDRESS,
          UI_STRINGS.CSV_HEADERS.DOWNLOADED_ON
        ]}
      />
    )
  },
  {
    label: UI_STRINGS.SPOTLIGHT.APP_DOWNLOADS,
    seriesKey: 'appDownloads',
    value: 0,
    valueType: 'event',
    unit: 'download',
    renderDetailsTable: (personId: string) => (
      <EventsTable
        personId={personId}
        eventType='appDownloads'
        fields={[
          UI_STRINGS.FILE.FILE_NAME,
          UI_STRINGS.DASHBOARD.OWNER,
          UI_STRINGS.TOOLTIP_IP.IP,
          UI_STRINGS.SPOTLIGHT.DATE_DOWNLOADED
        ]}
        exportUrl={`${GENERAL_URLS.PERSON}/${personId}/events?event-type=appDownloads`}
        sortingHeader={[UI_STRINGS.SPOTLIGHT.DATE_DOWNLOADED]}
        csvHeaderRow={[
          UI_STRINGS.CSV_HEADERS.FILE_NAME,
          UI_STRINGS.CSV_HEADERS.LINK_INSPECTOR,
          UI_STRINGS.CSV_HEADERS.LINK_STORAGE,
          UI_STRINGS.CSV_HEADERS.FILE_ID,
          UI_STRINGS.CSV_HEADERS.PLATFORM,
          UI_STRINGS.CSV_HEADERS.FILE_OWNER,
          UI_STRINGS.CSV_HEADERS.IP_ADDRESS,
          UI_STRINGS.CSV_HEADERS.DOWNLOADED_ON
        ]}
      />
    )
  },
  {
    label: UI_STRINGS.SPOTLIGHT.COLLABORATOR_ADDS,
    seriesKey: 'collaborators',
    value: 0,
    valueType: 'event',
    unit: 'collaborator',
    renderDetailsTable: (personId: string) => (
      <EventsTable
        personId={personId}
        eventType='added'
        fields={[
          UI_STRINGS.SPOTLIGHT.COLLABORATOR,
          UI_STRINGS.FILE.FILE_NAME,
          UI_STRINGS.DASHBOARD.OWNER,
          UI_STRINGS.TOOLTIP_IP.IP,
          UI_STRINGS.SPOTLIGHT.DATE_TIME
        ]}
        exportUrl={`${GENERAL_URLS.PERSON}/${personId}/events?event-type=added`}
        sortingHeader={[UI_STRINGS.SPOTLIGHT.DATE_TIME]}
        csvHeaderRow={[
          UI_STRINGS.CSV_HEADERS.FILE_NAME,
          UI_STRINGS.CSV_HEADERS.LINK_INSPECTOR,
          UI_STRINGS.CSV_HEADERS.LINK_STORAGE,
          UI_STRINGS.CSV_HEADERS.FILE_ID,
          UI_STRINGS.CSV_HEADERS.PLATFORM,
          UI_STRINGS.CSV_HEADERS.FILE_OWNER,
          UI_STRINGS.CSV_HEADERS.IP_ADDRESS,
          UI_STRINGS.CSV_HEADERS.DOWNLOADED_ON
        ]}
      />
    )
  },
  {
    label: UI_STRINGS.SPOTLIGHT.ALL_FILE_EVENTS,
    seriesKey: 'allActivity',
    value: 0,
    valueType: 'event',
    unit: 'activity',
    renderDetailsTable: (personId: string) => (
      <EventsTable
        personId={personId}
        eventType={null}
        fields={[
          UI_STRINGS.FILE.FILE_NAME,
          UI_STRINGS.SPOTLIGHT.EVENT,
          UI_STRINGS.SPOTLIGHT.TARGET,
          UI_STRINGS.SPOTLIGHT.DATE_TIME
        ]}
        exportUrl={`${GENERAL_URLS.PERSON}/${personId}/events`}
        sortingHeader={[UI_STRINGS.SPOTLIGHT.DATE_TIME]}
        csvHeaderRow={[
          UI_STRINGS.CSV_HEADERS.FILE_NAME,
          UI_STRINGS.CSV_HEADERS.LINK_INSPECTOR,
          UI_STRINGS.CSV_HEADERS.LINK_STORAGE,
          UI_STRINGS.CSV_HEADERS.FILE_ID,
          UI_STRINGS.CSV_HEADERS.PLATFORM,
          UI_STRINGS.CSV_HEADERS.EVENT,
          UI_STRINGS.CSV_HEADERS.IP_ADDRESS,
          UI_STRINGS.CSV_HEADERS.DOWNLOADED_ON
        ]}
      />
    )
  }
]

export default INITIAL_TABS
