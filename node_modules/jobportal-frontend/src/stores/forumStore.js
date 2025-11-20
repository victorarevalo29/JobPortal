import { defineStore } from 'pinia'
import { apiRequest } from '@/services/httpClient'

const relativeTimeFrom = (value) => {
  if (!value) return 'Reciente'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Reciente'
  const diffMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60))
  if (diffMinutes < 1) return 'Justo ahora'
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `Hace ${diffHours} h`
  const diffDays = Math.floor(diffHours / 24)
  return `Hace ${diffDays} d`
}

const mapComment = (comment) => ({
  id: comment._id || globalThis.crypto?.randomUUID?.() || `comment-${Date.now()}`,
  author: comment.author?.name || 'Participante',
  authorRole: comment.author?.role,
  content: comment.content,
  date: relativeTimeFrom(comment.createdAt)
})

const mapThread = (thread) => ({
  id: thread._id,
  category: thread.category,
  title: thread.title,
  author: thread.author?.name || 'Comunidad JobPortal',
  authorRole: thread.author?.role,
  preview: thread.content?.slice(0, 180) || '',
  replies: thread.comments?.length || 0,
  lastActivity: relativeTimeFrom(thread.updatedAt || thread.createdAt),
  status: thread.comments?.length ? 'Con actividad' : 'Nuevo',
  focus: [thread.category],
  comments: (thread.comments || []).map(mapComment).reverse(),
  raw: thread
})

export const useForumStore = defineStore('forum', {
  state: () => ({
    threads: [],
    selectedThread: null,
    loading: false,
    error: ''
  }),
  actions: {
    async fetchThreads(params = {}) {
      this.loading = true
      this.error = ''
      try {
        const data = await apiRequest('/forum', { params })
        this.threads = Array.isArray(data) ? data.map(mapThread) : []
      } catch (error) {
        this.error = error.message
        this.threads = []
      } finally {
        this.loading = false
      }
    },
    async selectThread(id) {
      if (!id) {
        this.selectedThread = null
        return
      }
      this.loading = true
      this.error = ''
      try {
        const data = await apiRequest(`/forum/${id}`)
        this.selectedThread = mapThread(data)
      } catch (error) {
        this.error = error.message
        this.selectedThread = null
      } finally {
        this.loading = false
      }
    },
    async createThread(payload, options = {}) {
      this.loading = true
      this.error = ''
      try {
        const data = await apiRequest('/forum', { method: 'POST', data: payload, auth: true })
        const thread = mapThread(data)
        if (Array.isArray(options.focus) && options.focus.length) {
          thread.focus = options.focus
        }
        this.threads = [thread, ...this.threads]
        return thread
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    async addComment(threadId, payload) {
      if (!threadId) return
      this.error = ''
      try {
        const data = await apiRequest(`/forum/${threadId}/comments`, {
          method: 'POST',
          data: payload,
          auth: true
        })
        const updated = mapThread(data)
        this.threads = this.threads.map((thread) => (thread.id === threadId ? updated : thread))
        if (this.selectedThread?.id === threadId) {
          this.selectedThread = updated
        }
        return updated
      } catch (error) {
        this.error = error.message
        throw error
      }
    }
  }
})
