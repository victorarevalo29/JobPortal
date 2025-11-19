const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '')
const API_BASE_WITH_TRAILING_SLASH = `${API_BASE_URL}/`
export const TOKEN_STORAGE_KEY = 'jobportal-token'

const buildUrl = (path = '', params) => {
  let url

  if (/^https?:\/\//i.test(path)) {
    url = new URL(path)
  } else {
    const sanitizedPath = path.replace(/^\/+/, '')
    url = new URL(sanitizedPath, API_BASE_WITH_TRAILING_SLASH)
  }

  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      url.searchParams.append(key, value)
    })
  }
  return url.toString()
}

const getAuthHeader = () => {
  if (typeof window === 'undefined') return {}
  const token = window.localStorage.getItem(TOKEN_STORAGE_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const apiRequest = async (path, { method = 'GET', params, data, headers = {}, auth = false } = {}) => {
  const url = buildUrl(path, params)
  const config = {
    method,
    headers: {
      Accept: 'application/json',
      ...headers
    },
    credentials: 'include'
  }

  if (data !== undefined) {
    config.body = typeof data === 'string' ? data : JSON.stringify(data)
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }
  }

  if (auth) {
    Object.assign(config.headers, getAuthHeader())
  }

  const response = await fetch(url, config)
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload?.message || 'Ocurrió un error al consultar la API'
    const error = new Error(message)
    error.status = response.status
    error.data = payload
    throw error
  }

  return payload?.data ?? payload
}
