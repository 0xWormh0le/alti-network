import React from 'react'
import UI_STRINGS from 'util/ui-strings'
import LiteFilesTable from 'components/spotlight/FilesTable/LiteFilesTable'
import LiteEventsTable from 'components/spotlight/EventsTable/LiteEventsTable'
import { SubNavTab } from 'components/spotlight/SpotlightGridNav/SpotlightGridNav'

const LITE_TABS: SubNavTab[] = [
  {
    label: UI_STRINGS.SPOTLIGHT.ACCESSIBLE,
    seriesKey: 'filesAccessible',
    value: 0,
    valueType: 'file',
    unit: 'file',
    renderDetailsTable: (personId: string) => (
      <LiteFilesTable
        personId={personId}
        fields={[
          UI_STRINGS.FILE.FILE_NAME,
          UI_STRINGS.FILE.FILE_OWNER,
          UI_STRINGS.EDIT_PERMISSIONS.CREATED_ON,
          UI_STRINGS.EDIT_PERMISSIONS.LAST_MODIFIED
        ]}
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
      <LiteFilesTable
        ownerId={personId}
        fields={[
          UI_STRINGS.FILE.FILE_NAME,
          UI_STRINGS.EDIT_PERMISSIONS.CREATED_ON,
          UI_STRINGS.EDIT_PERMISSIONS.LAST_MODIFIED
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
      <LiteEventsTable
        personId={personId}
        eventType='personDownloads'
        fields={[UI_STRINGS.FILE.FILE_NAME, UI_STRINGS.DASHBOARD.OWNER, UI_STRINGS.SPOTLIGHT.DATE_DOWNLOADED]}
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
      <LiteEventsTable
        personId={personId}
        eventType={'allActivity'}
        fields={[
          UI_STRINGS.FILE.FILE_NAME,
          UI_STRINGS.SPOTLIGHT.EVENT,
          UI_STRINGS.SPOTLIGHT.TARGET,
          UI_STRINGS.SPOTLIGHT.DATE_TIME
        ]}
      />
    )
  }
]

export default LITE_TABS
