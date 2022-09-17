import React, { useEffect, useRef } from 'react'
import './Support.scss'

const hbsptScript = `
  hbspt.forms.create({
    'portalId': "5502362",
    'formId': "292c57c9-7e9f-4a00-950e-d00db0f096c8"
  });
`

const Support: React.FC<{}> = () => {
  const parent = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.innerHTML = hbsptScript
    if (parent && parent.current) {
      parent.current.appendChild(script)
    }
    return () => script.remove()
  }, [])

  return <div className='Support' ref={parent} />
}

export default Support
