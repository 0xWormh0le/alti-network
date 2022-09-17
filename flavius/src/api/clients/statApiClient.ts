import { GENERAL_URLS } from 'api/endpoints'
import { useBuildApiCaller, useGetByPage, usePrepareApiClientMetadata, useGet } from 'api/apiClientUtils'

const useStatApiClient = (initialSettings?: ApiClientInit) => {
  const { pageCountCacheTtl, pageCountLastUpdated, pageSize, settings } = usePrepareApiClientMetadata(initialSettings)

  const client = {
    useGetStats: () => {
      const [caller, args, resetTrigger] = useBuildApiCaller<{ pageNumber: number }>()
      const asyncState = useGetByPage<ServerResponseData<{}>>('', `${GENERAL_URLS.STATS}`, {
        handleError: settings.handleError,
        handleSuccess: settings.handleSuccess,
        trigger: args.trigger,
        resetTrigger,
        params: {
          pageCountCacheTtl,
          pageCountLastUpdated,
          pageSize,
          pageNumber: args.pageNumber
        }
      })

      return [...asyncState, caller]
    },
    useGetDashboardStats: (): ApiClientReturn<DashviewStats, {}> => {
      const [caller, args, resetTrigger] = useBuildApiCaller<{}>({})
      const asyncState = useGet<DashviewStats>('dashview_stats', `${GENERAL_URLS.DASHVIEW_STATS}`, {
        handleError: settings.handleError,
        handleSuccess: settings.handleSuccess,
        trigger: args.trigger,
        resetTrigger,
        params: {}
      })
      return [...asyncState, caller]
    }
  }

  return client
}

export default useStatApiClient
