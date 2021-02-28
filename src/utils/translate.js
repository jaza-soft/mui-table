import lodashGet from 'lodash.get'

const translate = (message, i18nMap = {}, args = {}) => {
  let result = lodashGet(i18nMap, message, args?._)
  const keys = Object.keys(args)
  keys.forEach((key) => {
    result = result.replaceAll(`%{${key}}`, args[key])
  })
  return result
}

export default translate
