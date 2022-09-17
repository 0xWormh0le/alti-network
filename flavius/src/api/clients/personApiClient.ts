import { GENERAL_URLS } from 'api/endpoints'
import { useBuildGetByPage, usePrepareApiClientMetadata, useBuildGet } from 'api/apiClientUtils'

const usePersonApiClient = (initialSettings?: ApiClientInit) => {
  const { pageCountCacheTtl, pageCountLastUpdated, pageSize } = usePrepareApiClientMetadata(initialSettings)

  const client = {
    useGetPerson: (
      args: ApiCallArgs<
        IPerson,
        {
          personId: string
        }
      >
    ) => useBuildGet('person', `${GENERAL_URLS.PERSON}/:personId`, args),
    useGetPersonStats: (
      args: ApiCallArgs<
        PersonStatistics,
        {
          personId: string
        }
      >
    ) => useBuildGet('person', `${GENERAL_URLS.PERSON}/:personId/stats`, args),
    useGetPersonEvents: (
      args: ApiCallArgs<
        ServerResponseData<{ events: SpotlightEvent[] }>,
        WithPagination<{
          personId: string
          platformIds: string[]
          eventType: string | null
          queryParams?: QueryParams
        }>
      >
    ) =>
      useBuildGetByPage(
        'person',
        `${GENERAL_URLS.PERSON}/:personId/events`,
        { pageCountLastUpdated, pageCountCacheTtl, pageSize },
        args,
        (data) => ({
          personId: data.personId,
          platformIds: data.platformIds,
          eventType: data.eventType,
          ...data.queryParams
        })
      ),

    useGetPeople: (
      args: ApiCallArgs<
        ServerResponseData<{ people: IPerson[] }>,
        WithPagination<{
          applicationId: string
          platformId: string
          queryParams: QueryParams
        }>
      >
    ) =>
      useBuildGetByPage(
        'people',
        GENERAL_URLS.PEOPLE,
        { pageCountCacheTtl, pageCountLastUpdated, pageSize },
        args,
        (data) => ({
          ...data.queryParams,
          platformId: data.platformId,
          applicationId: data.applicationId
        })
      )
  }

  return client
}

export default usePersonApiClient
