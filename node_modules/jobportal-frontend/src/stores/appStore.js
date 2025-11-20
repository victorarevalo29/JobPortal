import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    appName: 'JobPortal',
    tagline: 'Explora oportunidades, comparte talento'
  }),
  getters: {
    heroMessage: (state) => `${state.appName}: ${state.tagline}`
  }
})
