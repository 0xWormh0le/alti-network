import { application, applicationStat, peopleResponse, fileDownloadsResponse, risksResponse } from 'test/mocks'
import cloneDeep from 'lodash/cloneDeep'

const sendResponse = (response: any) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(cloneDeep(response))
    }, 100)
  })
}

export const APIMock = {
  getApplication: async () => await sendResponse(application),
  getApplicationStats: async () => await sendResponse(applicationStat),
  getPeople: async () => await sendResponse(peopleResponse),
  getDownloads: async () => await sendResponse(fileDownloadsResponse),
  getRisks: async () => await sendResponse(risksResponse)
}

export default { APIMock }
