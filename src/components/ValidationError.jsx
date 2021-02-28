import React from 'react'

import translate from '../utils/translate'

const ValidationError = ({ error, i18nMap }) => {
  if (error !== null && typeof error === 'object' && error.message) {
    const { message, args } = error
    return <React.Fragment>{translate(message, i18nMap, { ...args })}</React.Fragment>
  } else if (typeof error === 'string') {
    return <React.Fragment>{translate(error, i18nMap)}</React.Fragment>
  }
  return null
}

export default ValidationError
