import { useBuildDel, useBuildGetByPage, usePrepareApiClientMetadata, useBuildPost } from 'api/apiClientUtils'
import { GENERAL_URLS } from 'api/endpoints'

const useRiskApiClient = (initialSettings?: ApiClientInit) => {
  const { pageCountCacheTtl, pageCountLastUpdated, pageSize } = usePrepareApiClientMetadata(initialSettings)

  const client = {
    useGetRisks: (
      args: ApiCallArgs<
        RisksResponse,
        WithPagination<{
          platformIds: string[]
          riskTypeIds: string[]
          userVisibilityState: FilterUserVisibilityState
          queryParams: QueryParams
        }>
      >
    ) =>
      useBuildGetByPage(
        'risks',
        `${GENERAL_URLS.RISKS}`,
        { pageCountCacheTtl, pageCountLastUpdated, pageSize },
        args,
        (data) => ({
          platformIds: data.platformIds,
          riskTypeIds: data.riskTypeIds,
          userVisibilityState: data.userVisibilityState,
          ...data.queryParams
        })
      ),
    useUpdateRiskState: (
      args: ApiCallArgs<
        RisksResponse,
        {
          riskId: string
          userVisibilityState: FilterUserVisibilityState
          queryParams: QueryParams
        }
      >
    ) =>
      useBuildPost(
        'risks',
        `${GENERAL_URLS.RISKS}/:riskId`,
        args,
        (data) => ({
          userVisibilityState: data?.userVisibilityState || ''
        }),
        (data) => ({ pageCountCacheTtl, pageCountLastUpdated, ...data?.queryParams })
      ),
    useDeleteAllPermissions: (args?: ApiCallArgs<void, { riskId: string }>) =>
      useBuildDel('risk', `${GENERAL_URLS.RISK}/:riskId/permissions`, args)
  }

  return client
}

export default useRiskApiClient
