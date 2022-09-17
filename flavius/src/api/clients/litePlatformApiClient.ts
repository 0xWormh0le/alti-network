import { INTEGRATION_URLS } from 'api/endpoints'
import {
  useBuildApiCaller,
  useGet,
  useGetByPage,
  usePost,
  usePrepareApiClientMetadata,
  useBuildGet,
  useBuildGetByPage,
  useBuildDel
} from 'api/apiClientUtils'
import UI_STRINGS from 'util/ui-strings'

const platformIdUrls = {
  [UI_STRINGS.PLATFORMS.BOX_ID]: INTEGRATION_URLS.BOXLITE
}

const platformEndpointName = {
  [UI_STRINGS.PLATFORMS.BOX_ID]: 'boxlite'
}

const useLitePlatformApiClient = (initialSettings?: ApiClientInit) => {
  const { settings, pageCountCacheTtl, pageCountLastUpdated, pageSize } = usePrepareApiClientMetadata(initialSettings)

  const client = {
    useBeginBoxAuth: (): ApiClientReturn<{ url: string }, {}> => {
      const [caller, args, resetTrigger] = useBuildApiCaller<{}>()
      const asyncState = useGet<{ url: string }>('boxlite', `${INTEGRATION_URLS.BOXLITE}/begin_auth`, {
        handleError: settings.handleError,
        trigger: args.trigger,
        resetTrigger,
        params: {},
        handleSuccess: settings.handleSuccess
      })

      return [...asyncState, caller]
    },
    useDisconnectBox: (): ApiClientReturn<{}, {}> => {
      const [caller, args, resetTrigger] = useBuildApiCaller<{}>()
      const asyncState = usePost<{}, {}>(
        'boxlite',
        `${INTEGRATION_URLS.BOXLITE}/disconnect`,
        {},
        {
          handleError: settings.handleError,
          trigger: args.trigger,
          resetTrigger,
          params: {},
          handleSuccess: settings.handleSuccess
        }
      )

      return [...asyncState, caller]
    },
    useGetLitePersonEvents: (
      platformId: string,
      personId: string,
      eventType: Maybe<string>,
      pageNumber: number
    ): ApiClientReturn<
      LitePersonEvents,
      { platformId: string; personId: string; eventType: string; pageNumber: number }
    > => {
      const [caller, args, resetTrigger] = useBuildApiCaller({ personId, platformId, eventType, pageNumber })

      const url = `${platformIdUrls[args.platformId || '']}/person/${personId}/events`

      const asyncState = useGetByPage<any>(platformEndpointName[args.platformId || ''], url, {
        handleError: settings.handleError,
        handleSuccess: settings.handleSuccess,
        resetTrigger,
        trigger: args.trigger,
        params: {
          eventType: args.eventType,
          pageCountCacheTtl,
          pageCountLastUpdated,
          pageNumber,
          pageSize
        }
      })

      return [...asyncState, caller]
    },
    useGetLitePerson: (
      personId: string,
      platformId: string
    ): ApiClientReturn<LitePerson, { personId: string; platformId: string }> => {
      const [caller, args, resetTrigger] = useBuildApiCaller({ personId, platformId })

      const asyncState = useGet(
        platformEndpointName[args.platformId || ''],
        `${platformIdUrls[args.platformId || '']}/person/${args.personId}`,
        {
          handleError: settings.handleError,
          handleSuccess: settings.handleSuccess,
          params: {},
          resetTrigger,
          trigger: args.trigger
        }
      )
      return [...asyncState, caller]
    },
    useGetBoxUsers: (personId: string): ApiClientReturn<IPerson, { personId: string }> => {
      const [caller, args, resetTrigger] = useBuildApiCaller({ personId })

      const asyncState = useGet('boxlite', `${INTEGRATION_URLS.BOXLITE}/users`, {
        handleError: settings.handleError,
        handleSuccess: settings.handleSuccess,
        params: {},
        resetTrigger,
        trigger: args.trigger
      })
      return [...asyncState, caller]
    },
    useGetLiteFiles: (
      platformId: string,
      pageNumber: number,
      personId: Maybe<string>,
      ownerId: Maybe<string>
    ): ApiClientReturn<
      LiteFiles,
      {
        platformId: string
        pageNumber: number
        personId: Maybe<string>
        ownerId: Maybe<string>
      }
    > => {
      const [caller, args, resetTrigger] = useBuildApiCaller({ personId, ownerId, platformId, pageNumber })

      const asyncState = useGetByPage(
        platformEndpointName[args.platformId || ''],
        `${platformIdUrls[args.platformId || '']}/files`,
        {
          handleError: settings.handleError,
          handleSuccess: settings.handleSuccess,
          params: {
            personId: args.personId,
            ownerId: args.ownerId,
            pageCountCacheTtl,
            pageCountLastUpdated,
            pageSize,
            pageNumber: args.pageNumber || 1
          },
          resetTrigger,
          trigger: args.trigger
        }
      )

      return [...asyncState, caller]
    },
    useGetLiteFileActivities: (
      args: ApiCallArgs<
        FileActivitiesResponse,
        WithPagination<{
          platformId: string
          activityType: string
          createdBefore: string
          createdAfter: string
          limit: number
          accounts: string
        }>
      >
    ) =>
      useBuildGetByPage(
        platformEndpointName[args.requestDetails?.platformId || ''],
        `${platformIdUrls[args.requestDetails?.platformId || '']}/all-file-activity`,
        { pageCountCacheTtl, pageCountLastUpdated, pageSize },
        args,
        (data) => ({
          activityType: data.activityType,
          createdBefore: data.createdBefore,
          createdAfter: data.createdAfter,
          limit: data.limit,
          accounts: data.accounts
        })
      ),
    useGetLiteFile: (args: ApiCallArgs<LiteFile, { fileId: string; platformId: string }>) =>
      useBuildGet(
        platformEndpointName[args.requestDetails?.platformId || ''],
        `${platformIdUrls[args.requestDetails?.platformId || '']}/file/:fileId`,
        args
      ),
    useGetLiteFileEvents: (
      args: ApiCallArgs<
        ServerResponseData<{ events: LiteFileEvent[] }>,
        WithPagination<{
          fileId: string
          platformId: string
          queryParams?: QueryParams
        }>
      >
    ) =>
      useBuildGetByPage(
        platformEndpointName[args.requestDetails?.platformId || ''],
        `${platformIdUrls[args.requestDetails?.platformId || '']}/${args.requestDetails?.fileId}/events`,
        { pageSize, pageCountCacheTtl, pageCountLastUpdated },
        args,
        (data) => ({
          ...data.queryParams
        })
      ),
    useGetLiteFilesInFolder: (
      args: ApiCallArgs<
        ServerResponseData<{ files: LiteFile[] }>,
        WithPagination<{
          fileId: string
          platformId: string
          queryParams?: QueryParams
        }>
      >
    ) =>
      useBuildGetByPage(
        platformEndpointName[args.requestDetails?.platformId || ''],
        `${platformIdUrls[args.requestDetails?.platformId || '']}/file/:fileId/parentFolder`,
        { pageCountLastUpdated, pageCountCacheTtl, pageSize },
        args,
        (data) => ({
          ...data.queryParams
        })
      ),
    useGetLiteFilePermissions: (
      args: ApiCallArgs<
        ServerResponseData<{ permissions: LiteFilePermission[] }>,
        WithPagination<{
          fileId: string
          platformId: string
          queryParams?: QueryParams
        }>
      >
    ) =>
      useBuildGetByPage(
        platformEndpointName[args.requestDetails?.platformId || ''],
        `${platformIdUrls[args.requestDetails?.platformId || '']}/file/:fileId/permissions`,
        { pageSize, pageCountCacheTtl, pageCountLastUpdated },
        args,
        (data) => ({
          ...data.queryParams
        })
      ),
    useDeleteLiteFilePermissions: (
      args: ApiCallArgs<void, { fileId: string; permissionId: string; permissionEmailAddress: Maybe<string> }>,
      platformId: string
    ) =>
      useBuildDel(
        platformEndpointName[platformId],
        `${platformIdUrls[platformId]}/file/:fileId/permissions`,
        args,
        (data) => ({
          permissionId: data?.permissionId,
          permissionEmailAddress: data?.permissionEmailAddress
        })
      )
  }

  return client
}

export default useLitePlatformApiClient
