import Alert from 'react-s-alert'

const basicConfig = {
  position: 'top-right',
  effect: 'jelly',
  offset: 56,
  timeout: 3500
}

export function alertError(message: string, description?: string) {
  return Alert.error(message, {
    ...basicConfig,
    customFields: { description }
  })
}

export function alertSuccess(message: string, description?: string) {
  return Alert.success(message, {
    ...basicConfig,
    customFields: { description }
  })
}

export function alertInfo(message: string, description?: string) {
  return Alert.info(message, {
    ...basicConfig,
    customFields: { description }
  })
}

export function alertWarning(message: string, description?: string) {
  return Alert.warning(message, {
    ...basicConfig,
    customFields: { description }
  })
}
