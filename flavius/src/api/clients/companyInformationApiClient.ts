import { usePrepareApiClientMetadata, useGet, useBuildApiCaller } from 'api/apiClientUtils'
import { GENERAL_URLS } from 'api/endpoints'

const useCompanyInformationApiClient = (initialSettings?: ApiClientInit) => {
  const { settings } = usePrepareApiClientMetadata(initialSettings)

  const client = {
    useGetCompanyPlatforms: (): ApiClientReturn<CompanyPlatformsResponse, {}> => {
      const [caller, args, resetTrigger] = useBuildApiCaller<any>()

      const asyncState = useGet<CompanyPlatformsResponse>('company_info', `${GENERAL_URLS.COMPANY_INFO}/platforms`, {
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

export default useCompanyInformationApiClient
