// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)CYPRESS_USER_PASSWORD

module.exports = (on, config) => {
  // modify env var value
  config.env.CYPRESS_USER_PASSWORD = process.env.CYPRESS_USER_PASSWORD
  config.env.NODE_ENV = process.env.NODE_ENV
  config.env.HEARTBEAT_TEST = !!process.env.HEARTBEAT_TEST
  config.env.REACT_APP_STAGE = process.env.REACT_APP_STAGE
  config.env.NUM_BENCHMARK_TESTS = Number.parseInt(process.env.NUM_BENCHMARK_TESTS)

  on('task', {
    log(message) {
      console.log(message)
      return null
    }
  })

  // return config
  return config
}
