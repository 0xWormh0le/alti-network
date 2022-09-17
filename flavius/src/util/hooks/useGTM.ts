import config from 'config'
import { useEffect } from 'react'

const useGTM = () => {
  useEffect(() => {
    // This comes in auto-generated and should not be changed
    const scriptText = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${config.google.gtmId}')`

    // Google's script text inserts a secondary script
    // This is how it's concatenated.
    const insertedUrl = `https://www.googletagmanager.com/gtm.js?id=${config.google.gtmId}`

    // Loading the script using the scripted text
    const script = document.createElement('script')
    script.innerHTML = scriptText // Loading the script
    document.head.appendChild(script)

    return () => {
      // Removing the original inserted script
      document.head.removeChild(script)

      // Removing Google's inserted script.
      // Only grabbing scripts with a src tag to avoid unnecessary looping
      // We need to do this because we do not have a ref to the second-generated script.
      const scripts = document.head.querySelectorAll(`script[src]`)
      scripts.forEach((outerScript) => {
        const srcNode = outerScript.attributes.getNamedItem('src')
        // Secondary check, could be unnecessary but it does not hurt to be safe.
        if (!srcNode) return

        if (srcNode.value === insertedUrl) {
          document.head.removeChild(outerScript)
        }
      })
    }
  }, [])
}

export default useGTM
