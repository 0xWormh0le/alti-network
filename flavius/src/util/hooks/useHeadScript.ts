import { useEffect } from 'react'

type Script = { url: string; text?: undefined } | { text: string; url?: undefined }

const useHeadScript = (src: Script, onLoad?: () => void) => {
  useEffect(() => {
    const script = document.createElement('script')
    document.head.appendChild(script)

    if (onLoad) {
      script.onload = onLoad
    }

    if (src.url) {
      script.src = src.url
    } else if (src.text) {
      script.type = 'text/javascript'
      script.innerHTML = src.text
    }

    return () => {
      document.head.removeChild(script)
    }
  }, [src.url, src.text, onLoad])
}

export default useHeadScript
