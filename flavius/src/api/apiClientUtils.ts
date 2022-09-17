import { useAsyncState } from '@altitudenetworks/component-library/'
import { API } from 'aws-amplify'
import noop from 'lodash/noop'
import { useEffect, useState } from 'react'
import { paramsToString } from 'util/helpers'
import CONSTANTS from 'util/constants'

interface FalsyTrigger {
  [k: string]: undefined | false
  trigger: false
}

type TriggeringState<T> = (T & { trigger: true }) | FalsyTrigger

const { DEFAULT_PAGE_SIZE, PAGE_COUNT_CACHE_TTL } = CONSTANTS

const filterObjectUsingKeys = (keys?: string[], obj?: Dictionary<any>) => {
  return keys && obj ? Object.fromEntries(keys.map((key) => [key, obj && obj[key]])) : obj
}

export const fillUrl = (url: string, params?: Dictionary<any>) => {
  if (!params) return url

  // Normalizing all urls to have a slash to simplify Regex operations.
  if (url[url.length - 1] !== '/') {
    url = `${url}/`
  }

  const regex = new RegExp(`:.*?/`, 'g')
  const matches = Array.from(url.matchAll(regex))

  if (!matches) return url

  matches.forEach((match) => {
    const urlKeyMatch = match[0].match(new RegExp(`:\\w*`, 'g'))?.filter((m) => m)[0]
    const keyMatch = urlKeyMatch?.slice(1, urlKeyMatch.length)
    if (!keyMatch || !urlKeyMatch) return

    url = url.replace(urlKeyMatch, params[keyMatch])
  })

  // Removing slash.
  return url.slice(0, url.length - 1)
}

const getDefaultArgs = (trigger: boolean, resetTrigger: () => void): InternalMetaArgs<any> => ({
  handleSuccess: noop,
  handleError: noop,
  trigger,
  resetTrigger,
  params: {}
})

export const defaultSetting = {
  defaultPageSize: DEFAULT_PAGE_SIZE,
  pageCountCacheTtl: PAGE_COUNT_CACHE_TTL,
  // Silent handle by default
  handleError: noop,
  handleSuccess: noop,
  immediateTrigger: true
}

/**
 *
 * @param rq Actual promise to call or null if no call is to be made
 * @param depArr Dependency array, when to trigger the above promise
 * @param handleError How to handle errors
 * @param resetTrigger How to reset trigger back to falsy state after call is over
 * @returns
 */
export const useHandleAmplifyRequest = <T>(
  rq: null | (() => Promise<any>),
  depArr: any[],
  metaArgs: InternalMetaArgs<T>
) => {
  return useAsyncState<T>(() => {
    const rqRs = rq && rq()

    return rqRs
      ? rqRs
          .catch((err) => {
            // Handling it in whatever way is passed
            metaArgs.handleError(err)
            // Forwarding the error the useAsyncState's error handler
            throw err
          })
          .then((rs) => {
            metaArgs.handleSuccess(rs)

            return rs
          })
          .finally(() => {
            metaArgs.resetTrigger()
          })
      : null
  }, depArr)
}

/**
 * Wrapper over Amplify's get, managing it using useAsyncSate
 * @param endpointName Amplify-configured endpoint name
 * @param url Base URL of the entity being called, eg: /dev-01/file
 * @param handleError How errors should be handled
 * @param trigger Should this api fire?
 * @param resetTrigger How to set the trigger back to a falsy state after the api call is over
 * @param params any optional query parameters
 * @returns Async State Array with the specific type
 */
export const useGet = <T>(endpointName: string, url: string, metaArgs: InternalMetaArgs<T>) => {
  const urlAndParams = `${url}?${paramsToString(metaArgs.params)}`
  return useHandleAmplifyRequest<T>(
    metaArgs.trigger ? () => API.get(endpointName, urlAndParams, {}) : null,
    [urlAndParams, metaArgs.trigger],
    metaArgs
  )
}

/**
 *
 * @param endpointName Amplify-configured endpoint name
 * @param url Base URL of the entity being called, eg: /dev-01/file
 * @param id Id of entity
 * @param handleError How errors should be handled
 * @param trigger Should this api fire?
 * @param resetTrigger How to set the trigger back to a falsy state after the api call is over
 * @param params any optional query parameters
 * @returns Async State Array with the specific type
 */
export const useGetById = <T>(endpointName: string, url: string, id: string, metaArgs: InternalMetaArgs<T>) =>
  useGet<T>(endpointName, `${url}/${id}`, metaArgs)

/**
 *
 * @param endpointName Amplify-configured endpoint name
 * @param url Base URL of the entity being called, eg: /dev-01/file
 * @param pageNumber Which page number to call for specified entity
 * @param handleError How errors should be handled
 * @param trigger Should this api fire?
 * @param resetTrigger How to set the trigger back to a falsy state after the api call is over
 * @param params any optional query parameters
 * @returns Async State Array with the specific type
 */
export const useGetByPage = <T>(
  endpointName: string,
  url: string,
  metaArgs: InternalMetaArgs<
    T,
    {
      pageNumber: number | undefined | false
      pageSize: number | undefined
      pageCountCacheTtl: number
      pageCountLastUpdated: number
    }
  >
) => {
  const rs = useGet<T>(endpointName, url, {
    ...metaArgs,
    params: {
      ...metaArgs.params,
      pageNumber: metaArgs.params?.pageNumber || 0
    }
  })
  return rs
}

/**
 *
 * Wrapper over Amplify's del, managing it using useAsyncSate
 * @param endpointName Amplify-configured endpoint name
 * @param url Base URL of the entity being called, eg: /dev-01/file
 * @param handleError How errors should be handled
 * @param trigger Should this api fire?
 * @param resetTrigger How to set the trigger back to a falsy state after the api call is over
 * @param params any optional query parameters
 * @returns Async State Array with the specific type
 */
export const useDel = <TReq, TRes>(endpointName: string, url: string, body: TReq, metaArgs: InternalMetaArgs<TRes>) => {
  const urlAndParams = `${url}?${paramsToString(metaArgs.params)}`
  return useHandleAmplifyRequest<TRes>(
    metaArgs.trigger ? () => API.del(endpointName, urlAndParams, { body }) : null,
    [urlAndParams, JSON.stringify(body), metaArgs.trigger],
    metaArgs
  )
}

export const usePost = <TReq, TRes>(
  endpointName: string,
  url: string,
  body: TReq,
  metaArgs: InternalMetaArgs<TRes>
) => {
  const urlAndParams = `${url}?${paramsToString(metaArgs.params)}`
  return useHandleAmplifyRequest<TRes>(
    metaArgs.trigger ? () => API.post(endpointName, urlAndParams, { body }) : null,
    [urlAndParams, JSON.stringify(body), metaArgs.trigger],
    metaArgs
  )
}

// DISABLED UNTIL USE REQUIRED
/*
const usePatch = <TReq, TRes>(
  endpointName: string,
  url: string,
  body: TReq,
  handleError: ApiErrorCallback,
  params?: QueryParams
) => {
  const urlAndParams = `${url}?${paramsToString(params)}`
  return useHandleAmplifyRequest<TRes>(
    () => API.patch(endpointName, urlAndParams, body),
    [urlAndParams, JSON.stringify(body)],
    handleError
  )
}


*/

const shouldMakeCall = (incomingArgs: any, storedArgs: TriggeringState<any>) => {
  // If there are no args incoming
  if (!incomingArgs) return false

  // If it is the first call
  if (storedArgs === undefined && incomingArgs) return true

  // States not equal
  return !Object.entries(incomingArgs).every(([key, value]) => {
    return JSON.stringify(storedArgs[key]) === JSON.stringify(value)
  })
}

/**
 *
 * @param incomingArgs Arguments. When changed, a call is fired immediately. Only pass if a call needs to be immediately.
 * @param preventFirstCall Only allow dependency array to determine if call should happen after manual .call
 * @param triggeringKeys Keys of incomingArgs that should be watched
 *
 * @returns An object used to trigger manual calls to the API
 */
export const useBuildApiCaller = <T>(
  incomingArgs?: T,
  preventFirstCall?: boolean,
  triggeringKeys?: any[]
): [ApiCaller<T>, TriggeringState<T>, () => void] => {
  // These arguements are what's actually going to be used to make api calls,
  // as they are exposed to the api client using returned array.
  const [callingArgs, setCallingArgs] = useState<TriggeringState<T>>()
  const [firstCallOccurred, setFirstCallOccurred] = useState(false)

  useEffect(() => {
    if (
      shouldMakeCall(
        filterObjectUsingKeys(triggeringKeys, incomingArgs),
        filterObjectUsingKeys(triggeringKeys, callingArgs)
      )
    ) {
      setCallingArgs({ ...(incomingArgs as T), trigger: true })
    }
  }, [triggeringKeys, callingArgs, incomingArgs])

  // Define a caller, used to manipulate the buffer
  // To trigger a new call. This way, we do not need
  // Incoming args AT ALL in this specific sencario
  const caller: ApiCaller<T> = {
    call: (args = {} as T) => {
      setFirstCallOccurred(true)
      setCallingArgs({ ...args, trigger: true })
    }
  }

  const resetTrigger = () => {
    setCallingArgs({ ...callingArgs, trigger: false })
  }

  if (callingArgs) {
    callingArgs.trigger = preventFirstCall && !firstCallOccurred ? false : callingArgs.trigger
  }

  return [caller, callingArgs || { trigger: false }, resetTrigger]
}

export const usePrepareApiClientMetadata = (initialSettings?: ApiClientInit) => {
  // Overriding defaults with user-provided settings
  const settings = { ...defaultSetting, ...initialSettings }

  // Maintaining it in state to avoid any redefinition
  const [pageCountLastUpdated] = useState(Date.now())

  const pageSize = settings.defaultPageSize
  const pageCountCacheTtl = settings.pageCountCacheTtl

  return { settings, pageCountCacheTtl, pageCountLastUpdated, pageSize }
}

export const useBuildGet = <T, TArgs>(
  endpointName: string,
  url: string,
  args?: ApiCallArgs<T, TArgs>,
  buildQueryParams?: (args: TriggeringState<TArgs>) => Dictionary<QueryParamValue>
): ApiClientReturn<T, TArgs> => {
  // Leveraging triggering keys to handle special kases
  const [caller, internalArgs, resetTrigger] = useBuildApiCaller(
    args?.requestDetails,
    args?.meta?.preventFirstCall,
    args?.meta?.triggeringKeys
  )

  const asyncState = useGet<T>(endpointName, fillUrl(url, args?.requestDetails), {
    ...getDefaultArgs(internalArgs.trigger, resetTrigger),
    ...args?.meta,
    params: buildQueryParams && buildQueryParams({ ...internalArgs })
  })

  return [...asyncState, caller]
}

export const useBuildGetByPage = <T, TArgs>(
  endpointName: string,
  url: string,
  pagination: PaginationArgs,
  args?: ApiCallArgs<T, WithPagination<TArgs>>,
  buildQueryParams?: (args: TriggeringState<TArgs>) => Dictionary<QueryParamValue>
): ApiClientReturn<T, WithPagination<TArgs>> =>
  useBuildGet(endpointName, url, args, (queryArgs: TriggeringState<WithPagination<TArgs>>) => {
    return {
      ...pagination,
      ...(() => ({
        pageNumber: args?.requestDetails?.pageNumber,
        pageSize: args?.requestDetails?.pageSize,
        ...(buildQueryParams && buildQueryParams(queryArgs))
      }))()
    }
  })

export const useBuildPost = <T, TArgs>(
  endpointName: string,
  url: string,
  args?: ApiCallArgs<T, TArgs>,
  buildPayload?: (args?: TriggeringState<TArgs>) => Dictionary<any>,
  buildQueryParams?: (args?: TriggeringState<TArgs>) => Dictionary<QueryParamValue>
): ApiClientReturn<T, TArgs> => {
  const [caller, internalArgs, resetTrigger] = useBuildApiCaller(args?.requestDetails)

  const asyncState = usePost<any, T>(
    endpointName,
    fillUrl(url, internalArgs),
    buildPayload && buildPayload(internalArgs),
    {
      ...getDefaultArgs(internalArgs.trigger, resetTrigger),
      ...args?.meta,
      params: buildQueryParams && buildQueryParams(internalArgs)
    }
  )

  return [...asyncState, caller]
}

export const useBuildDel = <T, TArgs>(
  endpointName: string,
  url: string,
  args?: ApiCallArgs<T, TArgs>,
  buildPayload?: (args?: TriggeringState<TArgs>) => Dictionary<any>,
  buildQueryParams?: (args?: TriggeringState<TArgs>) => Dictionary<QueryParamValue>
): ApiClientReturn<T | void, TArgs> => {
  const [caller, internalArgs, resetTrigger] = useBuildApiCaller(args?.requestDetails)

  const asyncState = useDel(endpointName, fillUrl(url, internalArgs), buildPayload && buildPayload(internalArgs), {
    ...getDefaultArgs(internalArgs.trigger, resetTrigger),
    ...args?.meta,
    params: buildQueryParams && buildQueryParams({ ...internalArgs })
  })

  return [...asyncState, caller]
}
