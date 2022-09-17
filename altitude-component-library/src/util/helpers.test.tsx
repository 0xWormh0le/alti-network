import { DateUtils, printCSVdate } from './helpers'

describe('helpers', () => {
  it('should get the time now as a unix timestamp', () => {
    const now = DateUtils.timestamp().toString()
    expect(now).toEqual(Date.now().toString().substring(0, now.length))
  })
  it('should display 09/25/2020 16:21:29', () => {
    // for testing, we need to render utc dates to get an expected date & time, thus 'true' as 2nd arg
    const date = printCSVdate(1601050889, 'MM/DD/yyyy HH:mm:ss', true)
    expect(date).toEqual('09/25/2020 16:21:29')
  })
  it('should return a timestamp(1601050889) based on the given value: 09/25/2020 16:21:29', () => {
    const timestamp = DateUtils.timestamp('09/25/2020 16:21:29', true)
    expect(timestamp).toEqual(1601050889)
  })
  it('should display September 25, 2020 4:21 PM', () => {
    // for testing, we need to render utc dates to get an expected date & time, thus 'true' as 3rd arg
    expect(DateUtils.dateFormat(1601050889, 'LLL', true)).toEqual('September 25, 2020 4:21 PM')
  })
})
