import { useBuildApiCaller, useGet, usePost, usePrepareApiClientMetadata } from 'api/apiClientUtils'
import { GENERAL_URLS } from 'api/endpoints'

const SlackNotificationApiClient = (initialSettings?: ApiClientInit) => {
  const { settings } = usePrepareApiClientMetadata(initialSettings)

  const client = {
    useGetSlackNotifications: (): ApiClientReturn<RiskCategory[], {}> => {
      const [caller, args, resetTrigger] = useBuildApiCaller<{}>({})
      const asyncState = useGet<RiskCategory[]>('slack_notifications', GENERAL_URLS.SLACK_NOTIFICATIONS, {
        handleError: settings.handleError,
        handleSuccess: settings.handleSuccess,
        trigger: args.trigger,
        resetTrigger,
        params: {}
      })

      return [...asyncState, caller]
    },
    useUpdateSlackNotifications: (): ApiClientReturn<
      RiskCategory[],
      {
        platformId: string
        riskCategories: RiskCategoryPost[]
      }
    > => {
      const [caller, args, resetTrigger] = useBuildApiCaller<{
        platformId: string
        riskCategories: RiskCategoryPost[]
      }>()

      const asyncState = usePost<SlackNotificationsPost, RiskCategory[]>(
        'slack_notifications',
        GENERAL_URLS.SLACK_NOTIFICATIONS,
        {
          'platform-id': args.platformId,
          categories: args.riskCategories
        } as SlackNotificationsPost,
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

export default SlackNotificationApiClient
