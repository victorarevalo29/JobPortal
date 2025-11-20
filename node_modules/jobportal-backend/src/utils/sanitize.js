export const deepTrim = (value) => {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (Array.isArray(value)) {
    return value.map(deepTrim)
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, nested]) => {
      acc[key] = deepTrim(nested)
      return acc
    }, Array.isArray(value) ? [] : {})
  }

  return value
}
