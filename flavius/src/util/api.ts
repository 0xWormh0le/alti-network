export const poll = <T>(fn: () => Promise<T>, interval: number, onResult: (rs: T) => boolean) => {
  const executePoll = async () => {
    fn()
      .then((rs) => {
        if (rs && !onResult(rs)) {
          setTimeout(executePoll, interval)
        }
      })
      .catch((rs) => {
        if (!onResult(rs)) {
          setTimeout(executePoll, interval)
        }
      })
  }

  executePoll()
}
