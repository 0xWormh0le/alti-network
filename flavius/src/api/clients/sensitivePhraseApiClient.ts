import {
  useBuildApiCaller,
  useGetByPage,
  useDel,
  usePost,
  usePrepareApiClientMetadata,
  useBuildPost
} from 'api/apiClientUtils'
import { GENERAL_URLS } from 'api/endpoints'

const useSensitivePhraseApiClient = (initialSettings?: ApiClientInit) => {
  const { pageCountCacheTtl, pageCountLastUpdated, pageSize, settings } = usePrepareApiClientMetadata(initialSettings)

  const client = {
    useGetSensitivePhrases: (
      pageNumber: number
    ): ApiClientReturn<
      SensitivePhrasesResponse,
      {
        pageNumber: number
      }
    > => {
      const [caller, args, resetTrigger] = useBuildApiCaller({
        pageNumber
      })

      const asyncState = useGetByPage<SensitivePhrasesResponse>('sensitive_phrases', GENERAL_URLS.SENSITIVE_PHRASES, {
        handleError: settings.handleError,
        handleSuccess: settings.handleSuccess,
        trigger: args.trigger,
        resetTrigger,
        params: {
          pageCountCacheTtl,
          pageCountLastUpdated,
          pageNumber: args.pageNumber,
          pageSize
        }
      })
      return [...asyncState, caller]
    },
    useDeleteSensitivePhrase: (): ApiClientReturn<
      void,
      {
        id: string
      }
    > => {
      const [caller, args, resetTrigger] = useBuildApiCaller<{
        id: string
      }>()

      const asyncState = useDel(
        'sensitive_phrase',
        GENERAL_URLS.SENSITIVE_PHRASE,
        {},
        {
          handleError: settings.handleError,
          handleSuccess: settings.handleSuccess,
          trigger: args.trigger,
          resetTrigger,
          params: {
            id: args?.id
          }
        }
      )

      return [...asyncState, caller]
    },
    useNewAddSensitivePhrase: (args?: ApiCallArgs<SensitivePhrasesResponse, SensitivePhrase>) =>
      useBuildPost(
        'sensitive_phrase',
        `${GENERAL_URLS.SENSITIVE_PHRASE}`,
        args,
        (data) => ({
          phrase: data?.phrase,
          exact: data?.exact
        }),
        (data) => ({
          phrase: data?.phrase,
          exact: data?.exact
        })
      ),
    useAddSensitivePhrase: (): ApiClientReturn<SensitivePhrasesResponse, SensitivePhrase> => {
      const [caller, args, resetTrigger] = useBuildApiCaller<SensitivePhrase>()
      const asyncState = usePost<SensitivePhrase, SensitivePhrasesResponse>(
        'sensitive_phrase',
        `${GENERAL_URLS.SENSITIVE_PHRASE}`,
        {
          phrase: args.phrase,
          exact: args.exact
        } as SensitivePhrase,
        {
          handleError: settings.handleError,
          handleSuccess: settings.handleSuccess,
          trigger: args.trigger,
          resetTrigger,
          params: {
            // todo: remove query string in post in the future update
            phrase: args.phrase || '',
            exact: args.exact || false
          }
        }
      )

      return [...asyncState, caller]
    }
  }
  return client
}

export default useSensitivePhraseApiClient
