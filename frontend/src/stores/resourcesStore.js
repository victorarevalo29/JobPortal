import { defineStore } from 'pinia'
import { apiRequest } from '@/services/httpClient'

const daysSince = (value) => {
  if (!value) return Infinity
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return Infinity
  const diffMs = Date.now() - date.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

const formatDateLabel = (value) => {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) return 'Reciente'
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' }).format(date)
}

const readTimeFromContent = (content = '') => {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.max(5, Math.round(words / 180))
  return `${minutes} min`
}

const inferFormat = (category = '', title = '') => {
  const value = `${category} ${title}`.toLowerCase()
  if (value.includes('taller') || value.includes('workshop')) return 'Taller'
  if (value.includes('playbook') || value.includes('kit')) return 'Playbook'
  if (value.includes('plantilla') || value.includes('canvas')) return 'Plantilla'
  return 'Artículo'
}

const buildTags = (resource) => {
  const tags = new Set()
  if (resource.category) tags.add(resource.category)
  resource.title
    ?.split(/\s+/)
    ?.filter((word) => word.length > 3)
    ?.slice(0, 2)
    ?.forEach((word) => tags.add(word.replace(/[^\wáéíóúñ]+/gi, '')))
  return Array.from(tags)
}

const mapResource = (resource) => {
  const snippetSource = resource.summary?.trim() || resource.content?.trim() || ''
  const normalizedSnippet = snippetSource.length > 200 ? `${snippetSource.slice(0, 200)}…` : snippetSource
  const status = resource.status?.length
    ? resource.status
    : daysSince(resource.publishedAt || resource.createdAt) <= 21
      ? ['Nuevo']
      : []
  const format = resource.format || inferFormat(resource.category, resource.title)
  const tags = Array.isArray(resource.tags) && resource.tags.length ? resource.tags : buildTags(resource)
  const duration = resource.duration?.trim() || readTimeFromContent(resource.content)
  const media = resource.mediaUrl
    ? {
        type: resource.mediaType || (format === 'Video' ? 'video' : 'article'),
        url: resource.mediaUrl
      }
    : null

  return {
    id: resource._id,
    title: resource.title,
    category: resource.category,
    format,
    description: normalizedSnippet,
    date: formatDateLabel(resource.publishedAt || resource.createdAt),
    duration,
    author: resource.author || 'Equipo JobPortal',
    tags,
    status,
    media,
    raw: resource
  }
}

export const useResourcesStore = defineStore('resources', {
  state: () => ({
    resources: [],
    loading: false,
    error: '',
    creating: false
  }),
  actions: {
    async fetchResources(params = {}) {
      this.loading = true
      this.error = ''
      try {
        const data = await apiRequest('/resources', { params })
        this.resources = Array.isArray(data) ? data.map(mapResource) : []
      } catch (error) {
        this.error = error.message
        this.resources = []
      } finally {
        this.loading = false
      }
    },
    async createResource(payload) {
      this.creating = true
      this.error = ''
      try {
        const data = await apiRequest('/resources', { method: 'POST', data: payload, auth: true })
        const resource = mapResource(data)
        this.resources = [resource, ...this.resources]
        return resource
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.creating = false
      }
    }
  }
})
