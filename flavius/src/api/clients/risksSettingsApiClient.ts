import {
  useBuildApiCaller,
  useGet,
  usePost,
  useDel,
  useGetByPage,
  usePrepareApiClientMetadata
} from 'api/apiClientUtils'
import { GENERAL_URLS } from 'api/endpoints'

const useRisksSettingsApiClient = (initialSettings?: ApiClientInit) => {
  const { pageCountCacheTtl, pageCountLastUpdated, pageSize, settings } = usePrepareApiClientMetadata(initialSettings)

  const client = {
    useGetDefaultThreshold: (): ApiClientReturn<DefaultThresholdResponse, {}> => {
      const [caller, args, resetTrigger] = useBuildApiCaller<{}>({})
      const asyncState = useGet<DefaultThresholdResponse>(
        'risks_settings',
        `${GENERAL_URLS.RISKS_SETTINGS}/default-threshold`,
        {
          handleError: settings.handleError,
          handleSuccess: settings.handleSuccess,
          trigger: args.trigger,
          resetTrigger,
          params: {}
        }
      )

      return [...asyncState, caller]
    },
    useUpdateDefaultThreshold: (): ApiClientReturn<
      DefaultThresholdResponse,
      {
        actor: RiskThresholdActorType
        value: number
      }
    > => {
      const [caller, args, resetTrigger] = useBuildApiCaller<{
        actor: RiskThresholdActorType
        value: number
      }>()

      const asyncState = usePost<DefaultThresholdPost, DefaultThresholdResponse>(
        'risks_settings',
        `${GENERAL_URLS.RISKS_SETTINGS}/default-threshold`,
        {
          settingValue: {
            actor: args.actor,
            defaultThreshold: args.value
          }
        } as DefaultThresholdPost,
        {
          handleError: settings.handleError,
          handleSuccess: settings.handleSuccess,
          trigger: args.trigger,
          resetTrigger,
          params: {}
        }
      )

      return [...asyncState, caller]
    },
    useGetWhitelistedDomains: (
      pageNumber: number,
      queryParams: QueryParams
    ): ApiClientReturn<
      WhitelistedDomainsResponse,
      {
        pageNumber: number
        queryParams: QueryParams
      }
    > => {
      const [caller, args, resetTrigger] = useBuildApiCaller({
        pageNumber,
        queryParams
      })

      const asyncState = useGetByPage<WhitelistedDomainsResponse>(
        'risks_settings',
        `${GENERAL_URLS.RISKS_SETTINGS}/whitelisted-domains`,
        {
          handleError: settings.handleError,
          handleSuccess: settings.handleSuccess,
          trigger: args.trigger,
          resetTrigger,
          params: {
            pageCountCacheTtl,
            pageCountLastUpdated,
            pageNumber: args.pageNumber,
            pageSize,
            ...args?.queryParams
          }
        }
      )

      return [...asyncState, caller]
    },
    useAddWhitelistedDomain: (
      queryParams: QueryParams
    ): ApiClientReturn<WhitelistedDomainsResponse, RiskSettingsDomain> => {
      const [caller, args, resetTrigger] = useBuildApiCaller<RiskSettingsDomain>()
      const asyncState = usePost<WhitelistedDomainPost, WhitelistedDomainsResponse>(
        'risks_settings',
        `${GENERAL_URLS.RISKS_SETTINGS}/whitelisted-domains`,
        {
          settingValue: {
            domain: args.domain
          }
        } as WhitelistedDomainPost,
        {
          handleError: settings.handleError,
          handleSuccess: settings.handleSuccess,
          trigger: args.trigger,
          resetTrigger,
          params: queryParams
        }
      )

      return [...asyncState, caller]
    },
    useDeleteWhitelistedDomain: (
      queryParams: QueryParams
    ): ApiClientReturn<WhitelistedDomainsResponse, RiskSettingsDomain> => {
      const [caller, args, resetTrigger] = useBuildApiCaller<RiskSettingsDomain>()

      const asyncState = useDel(
        'risks_settings',
        `${GENERAL_URLS.RISKS_SETTINGS}/whitelisted-domains`,
        {
          settingValue: {
            domain: args.domain
          }
        } as WhitelistedDomainPost,
        {
          handleError: settings.handleError,
          handleSuccess: settings.handleSuccess,
          trigger: args.trigger,
          resetTrigger,
          params: queryParams
        }
      )

      return [...asyncState, caller]
    },
    useGetInternalDomains: (
      pageNumber: number,
      queryParams: QueryParams
    ): ApiClientReturn<
      InternalDomainsResponse,
      {
        pageNumber: number
        queryParams: QueryParams
      }
    > => {
      const [caller, args, resetTrigger] = useBuildApiCaller({
        pageNumber,
        queryParams
      })

      const asyncState = useGetByPage<InternalDomainsResponse>(
        'risks_settings',
        `${GENERAL_URLS.RISKS_SETTINGS}/internal-domains`,
        {
          handleError: settings.handleError,
          handleSuccess: settings.handleSuccess,
          trigger: args.trigger,
          resetTrigger,
          params: {
            pageCountCacheTtl,
            pageCountLastUpdated,
            pageNumber: args.pageNumber,
            pageSize,
            ...args?.queryParams
          }
        }
      )

      return [...asyncState, caller]
    },
    useAddInternalDomain: (queryParams: QueryParams): ApiClientReturn<InternalDomainsResponse, RiskSettingsDomain> => {
      const [caller, args, resetTrigger] = useBuildApiCaller<RiskSettingsDomain>()
      const asyncState = usePost<InternalDomainPost, InternalDomainsResponse>(
        'risks_settings',
        `${GENERAL_URLS.RISKS_SETTINGS}/internal-domains`,
        {
          settingValue: {
            domain: args.domain
          }
        } as InternalDomainPost,
        {
          handleError: settings.handleError,
          handleSuccess: settings.handleSuccess,
          trigger: args.trigger,
          resetTrigger,
          params: queryParams
        }
      )

      return [...asyncState, caller]
    },
    useDeleteInternalDomain: (
      queryParams: QueryParams
    ): ApiClientReturn<InternalDomainsResponse, RiskSettingsDomain> => {
      const [caller, args, resetTrigger] = useBuildApiCaller<RiskSettingsDomain>()

      const asyncState = useDel(
        'risks_settings',
        `${GENERAL_URLS.RISKS_SETTINGS}/internal-domains`,
        {
          settingValue: {
            domain: args.domain
          }
        } as InternalDomainPost,
        {
          handleError: settings.handleError,
          handleSuccess: settings.handleSuccess,
          trigger: args.trigger,
          resetTrigger,
          params: queryParams
        }
      )

      return [...asyncState, caller]
    },
    useGetWhitelistedApps: (
      pageNumber: number,
      queryParams: QueryParams
    ): ApiClientReturn<
      WhitelistedAppsResponse,
      {
        pageNumber: number
        queryParams: QueryParams
      }
    > => {
      const [caller, args, resetTrigger] = useBuildApiCaller({
        pageNumber,
        queryParams
      })

      const asyncState = useGetByPage<WhitelistedAppsResponse>(
        'risks_settings',
        `${GENERAL_URLS.RISKS_SETTINGS}/whitelisted-apps`,
        {
          handleError: settings.handleError,
          handleSuccess: settings.handleSuccess,
          trigger: args.trigger,
          resetTrigger,
          params: {
            pageCountCacheTtl,
            pageCountLastUpdated,
            pageNumber: args.pageNumber,
            pageSize,
            ...args?.queryParams
          }
        }
      )

      return [...asyncState, caller]
    },
    useAddWhitelistedApp: (queryParams: QueryParams): ApiClientReturn<WhitelistedAppsResponse, RiskSettingsApp> => {
      const [caller, args, resetTrigger] = useBuildApiCaller<RiskSettingsApp>()
      const asyncState = usePost<WhitelistedAppPost, WhitelistedAppsResponse>(
        'risks_settings',
        `${GENERAL_URLS.RISKS_SETTINGS}/whitelisted-apps`,
        {
          settingValue: {
            appId: args.appId,
            appDesc: args.appDesc
          }
        } as WhitelistedAppPost,
        {
          handleError: settings.handleError,
          handleSuccess: settings.handleSuccess,
          trigger: args.trigger,
          resetTrigger,
          params: queryParams
        }
      )

      return [...asyncState, caller]
    },
    useDeleteWhitelistedApp: (queryParams: QueryParams): ApiClientReturn<WhitelistedAppsResponse, RiskSettingsApp> => {
      const [caller, args, resetTrigger] = useBuildApiCaller<RiskSettingsApp>()

      const asyncState = useDel(
        'risks_settings',
        `${GENERAL_URLS.RISKS_SETTINGS}/whitelisted-apps`,
        {
          settingValue: {
            appId: args.appId,
            appDesc: args.appDesc
          }
        } as WhitelistedAppPost,
        {
          handleError: settings.handleError,
          handleSuccess: settings.handleSuccess,
          trigger: args.trigger,
          resetTrigger,
          params: queryParams
        }
      )

      return [...asyncState, caller]
    },
    useGetRiskTypeStatus: (): ApiClientReturn<RiskTypeStatusResponse, {}> => {
      const [caller, args, resetTrigger] = useBuildApiCaller<{}>({})
      const asyncState = useGet<RiskTypeStatusResponse>(
        'risks_settings',
        `${GENERAL_URLS.RISKS_SETTINGS}/risk-type-status`,
        {
          handleError: settings.handleError,
          handleSuccess: settings.handleSuccess,
          trigger: args.trigger,
          resetTrigger,
          params: {}
        }
      )

      return [...asyncState, caller]
    },
    useUpdateRiskTypeStatus: (): ApiClientReturn<
      RiskTypeStatusResponse,
      {
        riskCategories: RiskCategoryPost[]
      }
    > => {
      const [caller, args, resetTrigger] = useBuildApiCaller<{
        riskCategories: RiskCategoryPost[]
      }>()

      const asyncState = usePost<RiskTypeStatusPost, RiskTypeStatusResponse>(
        'risks_settings',
        `${GENERAL_URLS.RISKS_SETTINGS}/risk-type-status`,
        {
          settingValue: {
            categories: args.riskCategories
          }
        } as RiskTypeStatusPost,
        {
          handleError: settings.handleError,
          handleSuccess: settings.handleSuccess,
          trigger: args.trigger,
          resetTrigger,
          params: {}
        }
      )

      return [...asyncState, caller]
    }
  }
  return client
}

export default useRisksSettingsApiClient
