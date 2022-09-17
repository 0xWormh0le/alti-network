import { GENERAL_URLS } from 'api/endpoints'
import {
  useBuildApiCaller,
  useBuildDel,
  useBuildGetByPage,
  useGetById,
  usePrepareApiClientMetadata
} from 'api/apiClientUtils'

const useFileApiClient = (initialSettings?: ApiClientInit) => {
  const { pageCountCacheTtl, pageCountLastUpdated, pageSize, settings } = usePrepareApiClientMetadata(initialSettings)

  const client = {
    useGetFileEvents: (
      args: ApiCallArgs<
        ServerResponseData<{ events: IFileEvent[] }>,
        WithPagination<{
          fileId: string
          platformId: string
          queryParams?: QueryParams
        }>
      >
    ) =>
      useBuildGetByPage(
        'file',
        `${GENERAL_URLS.FILE}/:fileId/events`,
        { pageSize, pageCountCacheTtl, pageCountLastUpdated },
        args,
        (data) => ({
          ...data.queryParams,
          platformId: data.platformId
        })
      ),
    useGetFilePermissions: (
      args: ApiCallArgs<
        ServerResponseData<{ permissions: Permission[]; permissionsCount: number }>,
        WithPagination<{
          fileId: string
          platformId: string
          queryParams?: QueryParams
        }>
      >
    ) =>
      useBuildGetByPage(
        'file',
        `${GENERAL_URLS.FILE}/:fileId/permissions`,
        { pageSize, pageCountCacheTtl, pageCountLastUpdated },
        args,
        (data) => ({
          ...data.queryParams,
          platformId: data.platformId
        })
      ),
    useGetFile: (
      fileId: string,
      platformId: string,
      queryParams?: QueryParams
    ): ApiClientReturn<IFile, { fileId: string; platformId: string; queryParams: QueryParams }> => {
      const [caller, args, resetTrigger] = useBuildApiCaller({ fileId, platformId, queryParams })

      const asyncState = useGetById<IFile>('file', GENERAL_URLS.FILE, args.fileId || '', {
        handleError: settings.handleError,
        handleSuccess: settings.handleSuccess,
        trigger: args.trigger,
        resetTrigger,
        params: {
          ...args?.queryParams,
          platformId: args?.platformId
        }
      })

      return [...asyncState, caller]
    },
    useGetFiles: (
      args: ApiCallArgs<
        ServerResponseData<{ files: IFile[] }>,
        WithPagination<{
          riskId: string
          platformIds: string[]
          queryParams: QueryParams
        }>
      >
    ) =>
      useBuildGetByPage(
        'files',
        GENERAL_URLS.FILES,
        { pageSize, pageCountCacheTtl, pageCountLastUpdated },
        args,
        (data) => ({
          platformIds: data.platformIds,
          riskId: data.riskId,
          ...data.queryParams
        })
      ),

    useGetFilesInFolder: (
      args: ApiCallArgs<
        ServerResponseData<{ files: IFile[] }>,
        WithPagination<{
          folderId: string
          platformId: string
          queryParams?: QueryParams
        }>
      >
    ) =>
      useBuildGetByPage(
        'files',
        `${GENERAL_URLS.FILES}/parentFolder/:folderId`,
        { pageCountLastUpdated, pageCountCacheTtl, pageSize },
        args,
        (data) => ({
          platformId: data.platformId,
          ...data.queryParams
        })
      ),
    useDeleteFilePermission: (args?: ApiCallArgs<void, { permissionId: string; fileId: string; platformId: string }>) =>
      useBuildDel(
        'permission',
        `${GENERAL_URLS.PERMISSION}/:permissionId`,
        args,
        () => ({}),
        (data) => ({
          fileId: data?.fileId,
          platformId: data?.platformId
        })
      )
  }

  return client
}

export default useFileApiClient
