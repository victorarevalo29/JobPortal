import axios from 'axios'
import { defineStore } from 'pinia'
import { TOKEN_STORAGE_KEY } from '@/services/httpClient'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const USER_KEY = 'jobportal-user'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
})

let interceptorsReady = false
const configureInterceptors = (store) => {
  if (interceptorsReady) return

  api.interceptors.request.use((config) => {
    if (store.token) {
      config.headers.Authorization = `Bearer ${store.token}`
    }
    return config
  })

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        store.clearSession()
      }
      return Promise.reject(error)
    }
  )

  interceptorsReady = true
}

const safeStorage = {
  get(key) {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(key)
  },
  set(key, value) {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(key, value)
  },
  remove(key) {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(key)
  }
}

const parseStoredUser = () => {
  try {
    return safeStorage.get(USER_KEY) ? JSON.parse(safeStorage.get(USER_KEY)) : null
  } catch (error) {
    console.warn('No se pudo parsear el usuario almacenado', error)
    safeStorage.remove(USER_KEY)
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: parseStoredUser(),
    token: safeStorage.get(TOKEN_STORAGE_KEY),
    loading: false,
    profileSaving: false,
    initialized: false
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token)
  },
  actions: {
    setSession({ user, token }) {
      if (user) {
        this.user = user
        safeStorage.set(USER_KEY, JSON.stringify(user))
      }
      if (token) {
        this.token = token
        safeStorage.set(TOKEN_STORAGE_KEY, token)
      }
      this.initialized = true
    },
    clearSession() {
      this.user = null
      this.token = null
      safeStorage.remove(USER_KEY)
      safeStorage.remove(TOKEN_STORAGE_KEY)
    },
    async login(credentials) {
      this.loading = true
      configureInterceptors(this)
      try {
        const { data } = await api.post('/auth/login', credentials)
        const payload = data?.data || {}
        this.setSession(payload)
        return payload
      } catch (error) {
        throw error.response?.data || { message: 'No se pudo iniciar sesión' }
      } finally {
        this.loading = false
      }
    },
    async register(payload) {
      this.loading = true
      configureInterceptors(this)
      try {
        const { data } = await api.post('/auth/register', payload)
        const payloadResponse = data?.data || {}
        this.setSession(payloadResponse)
        return payloadResponse
      } catch (error) {
        throw error.response?.data || { message: 'No se pudo completar el registro' }
      } finally {
        this.loading = false
      }
    },
    async logout() {
      configureInterceptors(this)
      try {
        if (this.token) {
          await api.post('/auth/logout')
        }
      } catch (error) {
        console.warn('No se pudo cerrar sesión en el servidor', error)
      } finally {
        this.clearSession()
      }
    },
    async fetchCurrentUser() {
      if (!this.token) {
        this.initialized = true
        return null
      }

      configureInterceptors(this)
      this.loading = true
      try {
        const { data } = await api.get('/auth/profile')
        const profile = data?.data || null
        this.setSession({ user: profile, token: this.token })
        return profile
      } catch (error) {
        this.clearSession()
        return null
      } finally {
        this.loading = false
        this.initialized = true
      }
    },
    async updateProfile(payload) {
      if (!this.token) {
        throw new Error('Necesitas iniciar sesión para actualizar tu perfil')
      }

      configureInterceptors(this)
      this.profileSaving = true
      try {
        const { data } = await api.patch('/auth/profile', payload)
        const updatedUser = data?.data || null
        this.setSession({ user: updatedUser, token: this.token })
        return updatedUser
      } catch (error) {
        throw error.response?.data || { message: 'No se pudo actualizar el perfil' }
      } finally {
        this.profileSaving = false
      }
    }
  }
})
