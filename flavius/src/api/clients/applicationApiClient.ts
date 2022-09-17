import { GENERAL_URLS } from 'api/endpoints'
import {
  useBuildApiCaller,
  useBuildGetByPage,
  useGet,
  useGetById,
  usePrepareApiClientMetadata
} from 'api/apiClientUtils'

const useApplicationApiClient = (initialSettings?: ApiClientInit) => {
  const { pageCountCacheTtl, pageCountLastUpdated, pageSize, settings } = usePrepareApiClientMetadata(initialSettings)

  const client = {
    useGetApplication: (
      applicationId: string
    ): ApiClientReturn<
      Application,
      {
        applicationId: string
      }
    > => {
      const [caller, args, resetTrigger] = useBuildApiCaller({ applicationId })
      const asyncState = useGetById('application', GENERAL_URLS.APPLICATION, args.applicationId || '', {
        handleError: settings.handleError,
        handleSuccess: settings.handleSuccess,
        trigger: args.trigger,
        resetTrigger,
        params: {}
      })
      return [...asyncState, caller]
    },
    useGetApplicationStats: (
      applicationId: string
    ): ApiClientReturn<
      any,
      {
        applicationId: string
      }
    > => {
      const [caller, args, resetTrigger] = useBuildApiCaller({ applicationId })
      const asyncState = useGet('application', `${GENERAL_URLS.APPLICATION}/${args.applicationId}/stats`, {
        handleError: settings.handleError,
        handleSuccess: settings.handleSuccess,
        trigger: args.trigger,
        resetTrigger,
        params: {}
      })
      return [...asyncState, caller]
    },
    useGetApplicationEvents: (
      args: ApiCallArgs<
        ServerResponseData<{ events: SpotlightEvent[] }>,
        WithPagination<{
          applicationId: string
          eventType: string | null
          queryParams?: QueryParams
        }>
      >
    ) =>
      useBuildGetByPage(
        'application',
        `${GENERAL_URLS.APPLICATION}/:applicationId/events`,
        { pageCountCacheTtl, pageCountLastUpdated, pageSize },
        args,
        (data) => ({
          eventType: data.eventType,
          ...data.queryParams
        })
      )
  }

  return client
}

export default useApplicationApiClient
