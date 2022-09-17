import config from 'config'
import React from 'react'
import { useCallback } from 'react'
import { useRef } from 'react'
import { normalizeId } from 'util/helpers'
import useHeadScript from 'util/hooks/useHeadScript'

interface HubspotFormProps {
  formTitle: string
}

/**
 * @param formTitle The form title within the internal config
 */
const HubspotForm: React.FC<HubspotFormProps> = ({ formTitle }) => {
  const ref = useRef<HTMLDivElement>(null)

  const memoizedOnLoad = useCallback(() => {
    // Only grab the id when the div loads
    const id = ref.current?.getAttribute('id')

    const innerLoadForm = () => {
      const formId = config.hubspot.formIds[formTitle]
      if (id) {
        // @ts-ignore
        window.hbspt.forms.create({
          target: `#${id}`,
          region: config.hubspot.region,
          portalId: config.hubspot.portalId,
          formId
        })
      } else {
        // Just in case the div is not loaded when the form loads.
        // It is unlikely, but this is a failsafe.
        setTimeout(innerLoadForm, 10)
      }
    }
    innerLoadForm()
  }, [formTitle])

  useHeadScript(
    {
      url: '//js.hsforms.net/forms/v2.js'
    },
    memoizedOnLoad
  )

  return <div className={formTitle} id={normalizeId(formTitle)} ref={ref} />
}

export default HubspotForm
