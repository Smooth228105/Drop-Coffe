export function parseApiFieldErrors(data) {
  if (!data || typeof data !== 'object') {
    return {}
  }

  const fieldErrors = {}

  for (const [key, value] of Object.entries(data)) {
    if (key === 'detail') {
      continue
    }
    if (Array.isArray(value) && value.length > 0) {
      fieldErrors[key] = value[0]
    } else if (typeof value === 'string') {
      fieldErrors[key] = value
    }
  }

  return fieldErrors
}

export function getApiErrorMessage(data, fallback = 'Произошла ошибка') {
  if (typeof data === 'string') {
    return data
  }
  if (data?.detail) {
    return data.detail
  }
  if (Array.isArray(data?.non_field_errors) && data.non_field_errors.length > 0) {
    return data.non_field_errors[0]
  }
  const fieldErrors = parseApiFieldErrors(data)
  const firstError = Object.values(fieldErrors)[0]
  return firstError || fallback
}
