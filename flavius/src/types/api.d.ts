type QueryParamValue = string | number | string[] | number[] | null | undefined | boolean
type QueryParams = { [k: string]: QueryParamValue }

type ApiClientReturn<TState extends any, TCallerArgs extends any> = [
  Maybe<TState>,
  Maybe<{ error: string }>,
  boolean,
  ApiCaller<TCallerArgs>
]

type ApiErrorCallback = (err: any) => void
type ApiSuccessCallback = (response: any) => void

interface ApiClientInit {
  defaultPageSize?: number
  pageCountCacheTtl?: number
  handleError?: ApiErrorCallback
  handleSuccess?: ApiSuccessCallback
  immediateTrigger?: boolean
}

interface ApiCaller<T> {
  call: (args?: T) => void
}

interface PaginationArgs {
  pageSize: number
  pageCountCacheTtl: number
  pageCountLastUpdated: number
}

interface MetaArgs<T, TParams = unknown> {
  handleError?: (err: Error) => void
  handleSuccess?: (rs: T) => void
  params?: (QueryParams & TParams) | undefined
  preventFirstCall?: boolean
  triggeringKeys?: string[]
}

interface InternalMetaArgs<T, TParams = unknown> extends MetaArgs<T, TParams> {
  trigger: boolean
  resetTrigger: () => void
  handleError: (err: Error) => void
  handleSuccess: (rs: T) => void
  params: (QueryParams & TParams) | undefined
}
interface ApiCallArgs<T, TArgs> {
  requestDetails?: TArgs
  meta?: MetaArgs<T>
}

type WithPagination<T> = T & {
  pageNumber: number
  pageSize: number
}
