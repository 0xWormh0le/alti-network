export const createPopupWindow = (url: string, title: string, whileOpen?: () => void) => {
  const defaultWindowConfig = {
    width: 500,
    height: 800,
    title
  }

  const { width, height } = defaultWindowConfig
  const left = window.screenX + (window.outerWidth - width) / 2
  const top = window.screenY + (window.outerHeight - height) / 2.5
  const popupConfig = `toolbar=0,scrollbars=1,status=1,resizable=0,location=1,menuBar=0,width=${width},height=${height},top=${top},left=${left}`

  const popupWindow = window.open(url, title, popupConfig)

  const popupWatcher = setInterval(() => {
    if (popupWindow?.closed) {
      clearInterval(popupWatcher)
      if (whileOpen) whileOpen()
    }
  }, 100)
}
