export const getDistinctValues = (values) => {
  if (!values) return values
  if (!Array.isArray(values)) return values
  let set = new Set()
  values.forEach((value) => set.add(value))
  return Array.from(set)
}

export const multiLineText = (text, length) => {
  if (!text) return [text]
  let result = []
  if (text) {
    while (text.length > length) {
      let idx = text.substring(0, length).lastIndexOf(' ')
      if (idx === -1) {
        idx = text.indexOf(' ')
        if (idx === -1) break
      }
      result.push(text.substring(0, idx))
      text = text.substring(idx + 1)
    }
    result.push(text)
  }
  return result
}

export const capitalize = (text) => {
  if (typeof text === 'string' && text.trim().length > 0) {
    text = text.trim()
    text = text.charAt(0).toUpperCase() + text.substring(1)
  }
  return text
}
