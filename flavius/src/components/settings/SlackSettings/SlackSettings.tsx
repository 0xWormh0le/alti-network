import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import Button from 'components/elements/Button'
import API from '@aws-amplify/api/lib'
import FormGroup from 'components/elements/FormGroup'
import FormLabel from 'components/elements/FormLabel'
import UI_STRINGS from 'util/ui-strings'
import Select, { OptionsType, ValueType } from 'react-select'
import { INTEGRATION_URLS } from 'api/endpoints'
import { useCancelablePromise } from 'util/hooks'
import SectionTitle from 'components/elements/SectionTitle'
import noop from 'lodash/noop'
import { createPopupWindow } from 'util/window'
import './SlackSettings.scss'
interface SelectOption {
  value: string
  label: string
}

interface CurrentlySelectedChannelsResponse {
  channel_names: string[]
  reason?: string
}

interface SlackAuthResponse {
  url: string
}

interface SlackInfoResponse {
  available_channel_names: string[]
}

const SlackSettings: React.FC = () => {
  const cancelablePromise = useCancelablePromise()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentChannels, setCurrentChannels] = useState<string[]>([])
  const [availableChannelOptions, setAvailableChannelOptions] = useState<SelectOption[]>([])
  const [previousChannels, setPreviousChannels] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<SelectOption>()

  const handleSelectedOptionChange = (nextSelectedOption: ValueType<SelectOption>) => {
    if (nextSelectedOption) {
      setSelectedOption(nextSelectedOption as SelectOption)
    }
  }

  const handleSaveChangesClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    if (selectedOption) {
      try {
        const body: CurrentlySelectedChannelsResponse = {
          channel_names: [selectedOption?.value]
        }
        const selectedChannelBody = { body }
        const data: CurrentlySelectedChannelsResponse = await API.put(
          'slack',
          `${INTEGRATION_URLS.SLACK}/channels/current`,
          selectedChannelBody
        )

        if (data.channel_names && data.channel_names.length > 0) {
          setCurrentChannels(data.channel_names)
          setLoading(false)
        }
      } catch (error) {
        handleCancelChangeChannels()
        setLoading(false)
      }
    }
  }

  const getChannels = useCallback(async () => {
    try {
      const { available_channel_names }: SlackInfoResponse = await API.get(
        'slack',
        `${INTEGRATION_URLS.SLACK}/channels`,
        {}
      )
      if (available_channel_names && available_channel_names.length > 0) {
        setAvailableChannelOptions(
          available_channel_names.map((option) => {
            return {
              label: option,
              value: option
            } as SelectOption
          })
        )
        setLoading(false)
      }
    } catch (error) {
      setAvailableChannelOptions([])
      setLoading(false)
    }
  }, [])

  const handleChangeChannelsClick = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      await getChannels()
      setPreviousChannels(currentChannels)
      setCurrentChannels([])
    },
    [currentChannels, getChannels]
  )

  const handleCancelChangeChannels = () => {
    setCurrentChannels(previousChannels)
    setPreviousChannels([])
  }

  const getStatus = useCallback(async () => {
    setLoading(true)
    let data: CurrentlySelectedChannelsResponse
    try {
      data = await API.get('slack', `${INTEGRATION_URLS.SLACK}/channels/current`, {})

      if (data.reason === 'not_authorized') {
        setLoading(false)
        setAuthorized(false)
        return
      }

      setAuthorized(true)
      if (data.reason === 'no_channels_selected') {
        await getChannels()
      }
      setCurrentChannels(data.channel_names)
      setLoading(false)
    } catch {
      setLoading(false)
      setAuthorized(false)
      return
    }
  }, [getChannels])

  useEffect(() => {
    cancelablePromise(getStatus()).catch(noop)
  }, [cancelablePromise, getStatus])
  const handleGetStartedClick = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)

      try {
        const data: SlackAuthResponse = await API.get('slack', `${INTEGRATION_URLS.SLACK}/begin_auth`, {})
        createPopupWindow(data.url, UI_STRINGS.SETTINGS.SLACK_POPUP_TITLE, getStatus)
      } catch (error) {
        setLoading(false)
      }
    },
    [getStatus]
  )

  return (
    <div className='SlackSettings'>
      <SectionTitle titleText={UI_STRINGS.SETTINGS.SLACK_SECTION_TITLE} />
      {authorized && currentChannels.length === 0 && (
        <form className='SlackSettings__form' onSubmit={handleSaveChangesClick}>
          <FormGroup>
            <FormLabel>
              <span className='SlackSettings__integration-status SlackSettings__integration-status--inactive'>
                &nbsp;
              </span>
              {UI_STRINGS.SETTINGS.SLACK_SELECT_CHANNEL}
            </FormLabel>
            <Select
              value={selectedOption as ValueType<SelectOption>}
              onChange={handleSelectedOptionChange}
              options={availableChannelOptions as OptionsType<SelectOption>}
            />
          </FormGroup>
          <div className='SlackSettings__button-group'>
            <Button
              action='primary'
              type='submit'
              isLoading={loading}
              text={UI_STRINGS.SETTINGS.SAVE_CHANGES}
              loadingText={UI_STRINGS.SETTINGS.SAVING_CHANGES}
            />
            {previousChannels.length > 0 && (
              <Button
                onClick={handleCancelChangeChannels}
                action='secondary'
                type='reset'
                text={UI_STRINGS.BUTTON_LABELS.CANCEL}
              />
            )}
          </div>
        </form>
      )}
      {authorized && currentChannels.length > 0 && (
        <form className='SlackSettings__form' onSubmit={handleChangeChannelsClick}>
          <FormGroup>
            <FormLabel>
              <span className='SlackSettings__integration-status SlackSettings__integration-status--active'>
                &nbsp;
              </span>
              {UI_STRINGS.SETTINGS.SLACK_CURRENT_CHANNEL(currentChannels[0])}
            </FormLabel>
          </FormGroup>
          <Button
            action='primary'
            type='submit'
            isLoading={loading}
            loadingText={UI_STRINGS.SETTINGS.SLACK_WAITING_FOR_CHANNELS}
            text={UI_STRINGS.SETTINGS.SLACK_SELECT_CHANNEL_CTA}
          />
        </form>
      )}
      {!authorized && (
        <form className='SlackSettings__form' onSubmit={handleGetStartedClick}>
          <FormGroup>
            <FormLabel>{UI_STRINGS.SETTINGS.SLACK_GET_STARTED}</FormLabel>
          </FormGroup>
          <Button
            action='primary'
            type='submit'
            isLoading={loading}
            text={UI_STRINGS.SETTINGS.SLACK_GET_STARTED_CTA}
            loadingText={UI_STRINGS.SETTINGS.SLACK_GET_STARTED_CTA_LOADING}
          />
        </form>
      )}
    </div>
  )
}

export default SlackSettings
